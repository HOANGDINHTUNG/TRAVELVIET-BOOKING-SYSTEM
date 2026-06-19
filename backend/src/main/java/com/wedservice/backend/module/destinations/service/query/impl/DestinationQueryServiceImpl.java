package com.wedservice.backend.module.destinations.service.query.impl;

import com.querydsl.core.BooleanBuilder;
import com.wedservice.backend.common.exception.ResourceNotFoundException;
import com.wedservice.backend.common.i18n.LocaleTagUtil;
import com.wedservice.backend.common.util.DataNormalizer;
import com.wedservice.backend.module.destinations.dto.request.DestinationSearchRequest;
import com.wedservice.backend.module.destinations.dto.response.DestinationBreadcrumbItem;
import com.wedservice.backend.module.destinations.dto.response.DestinationPublicDetailResponse;
import com.wedservice.backend.module.destinations.dto.response.DestinationPublicResponse;
import com.wedservice.backend.module.destinations.entity.Destination;
import com.wedservice.backend.module.destinations.entity.DestinationMedia;
import com.wedservice.backend.module.destinations.entity.DestinationStatus;
import com.wedservice.backend.module.destinations.entity.DestinationTranslation;
import com.wedservice.backend.module.destinations.entity.QDestination;
import com.wedservice.backend.module.destinations.mapper.DestinationMapper;
import com.wedservice.backend.module.destinations.repository.DestinationRepository;
import com.wedservice.backend.module.destinations.repository.DestinationTranslationRepository;
import com.wedservice.backend.module.destinations.service.query.DestinationQueryService;
import com.wedservice.backend.module.destinations.util.DestinationProgramSlug;
import com.wedservice.backend.module.tours.entity.TourStatus;
import com.wedservice.backend.module.tours.repository.TourRepository;
import com.wedservice.backend.common.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DestinationQueryServiceImpl implements DestinationQueryService {

    private final DestinationRepository destinationRepository;
    private final DestinationTranslationRepository destinationTranslationRepository;
    private final DestinationMapper destinationMapper;
    private final TourRepository tourRepository;

    @Override
    @Cacheable(
            value = "destinations",
            key = "#request.hashCode() + '_' + T(org.springframework.context.i18n.LocaleContextHolder).getLocale().toLanguageTag()"
    )
    @Transactional(readOnly = true)
    public PageResponse<DestinationPublicResponse> searchApprovedDestinations(DestinationSearchRequest request) {
        Sort sort = Sort.by(Sort.Direction.fromString(request.getSortDir()), request.getSortBy());
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(), sort);

        QDestination qDestination = QDestination.destination;
        BooleanBuilder builder = new BooleanBuilder();

        String keyword = DataNormalizer.normalize(request.getKeyword());
        if (StringUtils.hasText(keyword)) {
            builder.and(qDestination.name.containsIgnoreCase(keyword)
                    .or(qDestination.code.containsIgnoreCase(keyword)));
        }

        if (StringUtils.hasText(request.getProvince())) {
            builder.and(qDestination.province.eq(request.getProvince()));
        }

        if (StringUtils.hasText(request.getRegion())) {
            builder.and(qDestination.region.eq(request.getRegion()));
        }

        if (request.getCrowdLevel() != null) {
            builder.and(qDestination.crowdLevelDefault.eq(request.getCrowdLevel()));
        }

        if (request.getIsFeatured() != null) {
            builder.and(qDestination.isFeatured.eq(request.getIsFeatured()));
        }

        builder.and(qDestination.status.eq(DestinationStatus.APPROVED));
        builder.and(qDestination.deletedAt.isNull());
        builder.and(qDestination.isActive.isTrue());

        if (!Boolean.TRUE.equals(request.getHierarchyFlat())) {
            if (request.getParentUuid() != null) {
                builder.and(qDestination.parent.uuid.eq(request.getParentUuid()));
            } else {
                builder.and(qDestination.parent.isNull());
            }
        }

        Page<Destination> page = destinationRepository.findAll(builder, pageable);
        String lang = LocaleTagUtil.currentLanguageTag();
        List<Destination> destinations = page.getContent();
        Map<Long, DestinationTranslation> byDestId = loadDestinationTranslations(
                destinations.stream().map(Destination::getId).toList(),
                lang
        );
        Map<Long, Long> activeTourCountByDestId = batchCountActiveTours(destinations);
        Map<Long, String> coverImageByDestId = batchResolveCoverImages(destinations);
        return PageResponse.of(page.map(d -> toPublicResponse(
                d,
                byDestId.get(d.getId()),
                activeTourCountByDestId.getOrDefault(d.getId(), 0L),
                coverImageByDestId.get(d.getId())
        )));
    }

    @Override
    @Cacheable(
            value = "destination-details",
            key = "#uuid.toString() + '_' + T(org.springframework.context.i18n.LocaleContextHolder).getLocale().toLanguageTag()"
    )
    @Transactional(readOnly = true)
    public DestinationPublicDetailResponse getApprovedDestinationByUuid(UUID uuid) {
        Destination destination = destinationRepository.findByUuid(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with uuid: " + uuid));
        assertApprovedActive(destination);
        String lang = LocaleTagUtil.currentLanguageTag();
        DestinationTranslation tr = loadDestinationTranslations(List.of(destination.getId()), lang)
                .get(destination.getId());
        return toPublicDetailResponse(destination, tr, lang);
    }

    @Override
    @Cacheable(
            value = "destination-details",
            key = "'prog_' + #programSlug + '_' + T(org.springframework.context.i18n.LocaleContextHolder).getLocale().toLanguageTag()"
    )
    @Transactional(readOnly = true)
    public DestinationPublicDetailResponse getApprovedDestinationByProgramSlug(String programSlug) {
        Long id = DestinationProgramSlug.parseTrailingPid(programSlug);
        if (id == null) {
            throw new ResourceNotFoundException("Invalid destination program slug");
        }
        Destination destination = destinationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found for id: " + id));
        assertApprovedActive(destination);
        String lang = LocaleTagUtil.currentLanguageTag();
        DestinationTranslation tr = loadDestinationTranslations(List.of(destination.getId()), lang)
                .get(destination.getId());
        return toPublicDetailResponse(destination, tr, lang);
    }

    private static void assertApprovedActive(Destination destination) {
        if (destination.getStatus() != DestinationStatus.APPROVED
                || !Boolean.TRUE.equals(destination.getIsActive())
                || destination.getDeletedAt() != null) {
            throw new ResourceNotFoundException("Destination not found or not approved");
        }
    }

    private Map<Long, DestinationTranslation> loadDestinationTranslations(Collection<Long> destinationIds, String lang) {
        if (destinationIds == null || destinationIds.isEmpty()) {
            return Map.of();
        }
        var list = destinationTranslationRepository.findByDestination_IdInAndLocale(destinationIds, lang);
        Map<Long, DestinationTranslation> map = new HashMap<>();
        for (DestinationTranslation t : list) {
            Long id = t.getDestination() != null ? t.getDestination().getId() : null;
            if (id != null) {
                map.putIfAbsent(id, t);
            }
        }
        return map;
    }

    private static String pickLocalized(String translated, String base) {
        return org.springframework.util.StringUtils.hasText(translated) ? translated : base;
    }

    private Map<Long, Long> batchCountActiveTours(List<Destination> destinations) {
        if (destinations == null || destinations.isEmpty()) {
            return Map.of();
        }
        List<Long> rootIds = destinations.stream().map(Destination::getId).filter(Objects::nonNull).toList();
        if (rootIds.isEmpty()) {
            return Map.of();
        }
        try {
            Map<Long, Long> counts = new HashMap<>();
            for (Object[] row : tourRepository.countActiveToursByDestinationRootIds(
                    rootIds,
                    TourStatus.ACTIVE.getValue()
            )) {
                if (row == null || row.length < 2 || row[0] == null) {
                    continue;
                }
                long rootId = row[0] instanceof Number n ? n.longValue() : Long.parseLong(row[0].toString());
                long cnt = row[1] instanceof Number num ? num.longValue() : Long.parseLong(row[1].toString());
                counts.put(rootId, cnt);
            }
            return counts;
        } catch (Exception e) {
            return Map.of();
        }
    }

    private DestinationPublicResponse toPublicResponse(
            Destination destination,
            DestinationTranslation tr,
            long activeTourCount,
            String coverImageUrl
    ) {
        return DestinationPublicResponse.builder()
                .id(destination.getId())
                .uuid(destination.getUuid())
                .name(pickLocalized(tr != null ? tr.getName() : null, destination.getName()))
                .slug(destination.getSlug())
                .countryCode(destination.getCountryCode())
                .province(destination.getProvince())
                .district(destination.getDistrict())
                .region(destination.getRegion())
                .shortDescription(pickLocalized(
                        tr != null ? tr.getShortDescription() : null,
                        destination.getShortDescription()
                ))
                .bestTimeFromMonth(destination.getBestTimeFromMonth())
                .bestTimeToMonth(destination.getBestTimeToMonth())
                .crowdLevelDefault(destination.getCrowdLevelDefault())
                .isFeatured(destination.getIsFeatured())
                .coverImageUrl(coverImageUrl)
                .activeTourCount(activeTourCount)
                .translationKey(destination.getSlug())
                .parentUuid(destination.getParent() != null ? destination.getParent().getUuid() : null)
                .level(destination.getLevel())
                .programSlug(DestinationProgramSlug.build(destination.getSlug(), destination.getId()))
                .build();
    }

    // private Long countActiveTours(Destination destination) {
    //     try {
    //         String pathPrefix = StringUtils.hasText(destination.getPath())
    //                 ? destination.getPath()
    //                 : "/" + destination.getId() + "/";
    //         if (!pathPrefix.endsWith("/")) {
    //             pathPrefix = pathPrefix + "/";
    //         }
    //         return tourRepository.countActiveToursInDestinationSubtree(
    //                 destination.getId(),
    //                 pathPrefix,
    //                 TourStatus.ACTIVE
    //         );
    //     } catch (Exception e) {
    //         return 0L;
    //     }
    // }

    private DestinationPublicDetailResponse toPublicDetailResponse(
            Destination destination,
            DestinationTranslation tr,
            String lang
    ) {
        List<Long> chainIds = parsePathIds(destination.getPath());
        Map<Long, DestinationTranslation> crumbTr = chainIds.isEmpty()
                ? Map.of()
                : loadDestinationTranslations(chainIds, lang);

        return DestinationPublicDetailResponse.builder()
                .id(destination.getId())
                .uuid(destination.getUuid())
                .name(pickLocalized(tr != null ? tr.getName() : null, destination.getName()))
                .slug(destination.getSlug())
                .countryCode(destination.getCountryCode())
                .province(destination.getProvince())
                .district(destination.getDistrict())
                .region(destination.getRegion())
                .address(destination.getAddress())
                .latitude(destination.getLatitude())
                .longitude(destination.getLongitude())
                .shortDescription(pickLocalized(
                        tr != null ? tr.getShortDescription() : null,
                        destination.getShortDescription()
                ))
                .description(pickLocalized(tr != null ? tr.getDescription() : null, destination.getDescription()))
                .bestTimeFromMonth(destination.getBestTimeFromMonth())
                .bestTimeToMonth(destination.getBestTimeToMonth())
                .crowdLevelDefault(destination.getCrowdLevelDefault())
                .isFeatured(destination.getIsFeatured())
                .mediaList(destinationMapper.mapMediaList(destination.getMediaList()))
                .foods(destinationMapper.mapFoodList(destination.getFoods()))
                .specialties(destinationMapper.mapSpecialtyList(destination.getSpecialties()))
                .activities(destinationMapper.mapActivityList(destination.getActivities()))
                .tips(destinationMapper.mapTipList(destination.getTips()))
                .events(destinationMapper.mapEventList(destination.getEvents()))
                .parentUuid(destination.getParent() != null ? destination.getParent().getUuid() : null)
                .level(destination.getLevel())
                .programSlug(DestinationProgramSlug.build(destination.getSlug(), destination.getId()))
                .breadcrumbs(buildBreadcrumbs(chainIds, crumbTr))
                .build();
    }

    private List<Long> parsePathIds(String path) {
        if (!StringUtils.hasText(path) || "/".equals(path.trim())) {
            return List.of();
        }
        List<Long> ids = new ArrayList<>();
        for (String part : path.split("/")) {
            if (!StringUtils.hasText(part)) {
                continue;
            }
            try {
                ids.add(Long.parseLong(part.trim()));
            } catch (NumberFormatException ignored) {
                return List.of();
            }
        }
        return ids;
    }

    private List<DestinationBreadcrumbItem> buildBreadcrumbs(List<Long> chainIds, Map<Long, DestinationTranslation> trByDestId) {
        if (chainIds.isEmpty()) {
            return List.of();
        }
        List<Destination> nodes = destinationRepository.findAllById(chainIds);
        Map<Long, Destination> byId = nodes.stream().collect(Collectors.toMap(Destination::getId, d -> d, (a, b) -> a));
        List<DestinationBreadcrumbItem> out = new ArrayList<>();
        for (Long id : chainIds) {
            Destination d = byId.get(id);
            if (d == null) {
                continue;
            }
            DestinationTranslation tr = trByDestId.get(id);
            out.add(DestinationBreadcrumbItem.builder()
                    .uuid(d.getUuid())
                    .name(pickLocalized(tr != null ? tr.getName() : null, d.getName()))
                    .slug(d.getSlug())
                    .programSlug(DestinationProgramSlug.build(d.getSlug(), d.getId()))
                    .build());
        }
        return out;
    }

    private Map<Long, String> batchResolveCoverImages(List<Destination> destinations) {
        if (destinations == null || destinations.isEmpty()) {
            return Map.of();
        }
        List<Long> ids = destinations.stream().map(Destination::getId).filter(Objects::nonNull).toList();
        if (ids.isEmpty()) return Map.of();
        
        List<DestinationMedia> medias = destinationRepository.findActiveMediaByDestinationIds(ids);
        
        Map<Long, String> map = new HashMap<>();
        for (Long id : ids) {
            String url = medias.stream()
                    .filter(m -> m.getDestination() != null && id.equals(m.getDestination().getId()))
                    .map(DestinationMedia::getMediaUrl)
                    .filter(Objects::nonNull)
                    .findFirst()
                    .orElse(null);
            if (url != null) {
                map.put(id, url);
            }
        }
        return map;
    }
}

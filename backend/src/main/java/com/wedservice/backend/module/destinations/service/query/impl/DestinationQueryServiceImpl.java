package com.wedservice.backend.module.destinations.service.query.impl;

import com.querydsl.core.BooleanBuilder;
import com.wedservice.backend.common.exception.ResourceNotFoundException;
import com.wedservice.backend.common.i18n.LocaleTagUtil;
import com.wedservice.backend.common.util.DataNormalizer;
import com.wedservice.backend.module.destinations.entity.Destination;
import com.wedservice.backend.module.destinations.entity.DestinationTranslation;
import com.wedservice.backend.module.destinations.entity.DestinationMedia;
import com.wedservice.backend.module.destinations.entity.DestinationStatus;
import com.wedservice.backend.module.destinations.entity.QDestination;
import com.wedservice.backend.module.destinations.mapper.DestinationMapper;
import com.wedservice.backend.module.destinations.repository.DestinationRepository;
import com.wedservice.backend.module.destinations.repository.DestinationTranslationRepository;
import com.wedservice.backend.module.destinations.dto.request.DestinationSearchRequest;
import org.springframework.cache.annotation.Cacheable;
import com.wedservice.backend.common.response.PageResponse;
import com.wedservice.backend.module.destinations.dto.response.DestinationPublicDetailResponse;
import com.wedservice.backend.module.destinations.dto.response.DestinationPublicResponse;
import com.wedservice.backend.module.destinations.service.query.DestinationQueryService;
import com.wedservice.backend.module.tours.entity.TourStatus;
import com.wedservice.backend.module.tours.repository.TourRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Collection;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

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

        Page<Destination> page = destinationRepository.findAll(builder, pageable);
        String lang = LocaleTagUtil.currentLanguageTag();
        Map<Long, DestinationTranslation> byDestId = loadDestinationTranslations(
                page.getContent().stream().map(Destination::getId).toList(),
                lang
        );
        return PageResponse.of(page.map(d -> toPublicResponse(d, byDestId.get(d.getId()))));
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

        if (destination.getStatus() != DestinationStatus.APPROVED
                || !Boolean.TRUE.equals(destination.getIsActive())
                || destination.getDeletedAt() != null) {
            throw new ResourceNotFoundException("Destination not found or not approved");
        }

        String lang = LocaleTagUtil.currentLanguageTag();
        DestinationTranslation tr = loadDestinationTranslations(java.util.List.of(destination.getId()), lang)
                .get(destination.getId());
        return toPublicDetailResponse(destination, tr);
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

    private DestinationPublicResponse toPublicResponse(Destination destination, DestinationTranslation tr) {
        return DestinationPublicResponse.builder()
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
                .coverImageUrl(resolveCoverImage(destination))
                .activeTourCount(countActiveTours(destination.getId()))
                .translationKey(destination.getSlug())
                .build();
    }

    private Long countActiveTours(Long destinationId) {
        try {
            return tourRepository.countByDestinationIdAndStatusAndDeletedAtIsNull(destinationId, TourStatus.ACTIVE);
        } catch (Exception e) {
            return 0L;
        }
    }

    private DestinationPublicDetailResponse toPublicDetailResponse(Destination destination, DestinationTranslation tr) {
        return DestinationPublicDetailResponse.builder()
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
                .build();
    }

    private String resolveCoverImage(Destination destination) {
        return destination.getMediaList().stream()
                .filter(media -> Boolean.TRUE.equals(media.getIsActive()))
                .sorted(Comparator.comparing(DestinationMedia::getSortOrder, Comparator.nullsLast(Integer::compareTo)))
                .map(DestinationMedia::getMediaUrl)
                .findFirst()
                .orElse(null);
    }
}

package com.wedservice.backend.module.tours.service.query.impl;

import com.querydsl.core.BooleanBuilder;
import com.wedservice.backend.common.exception.BadRequestException;
import com.wedservice.backend.common.exception.ResourceNotFoundException;
import com.wedservice.backend.common.i18n.LocaleTagUtil;
import com.wedservice.backend.module.commerce.entity.ComboPackage;
import com.wedservice.backend.module.commerce.repository.ComboPackageRepository;
import com.wedservice.backend.module.destinations.entity.Destination;
import com.wedservice.backend.module.destinations.repository.DestinationRepository;
import com.wedservice.backend.module.tours.dto.request.TourSearchRequest;
import com.wedservice.backend.module.tours.dto.response.CancellationPolicyResponse;
import com.wedservice.backend.module.tours.dto.response.CancellationPolicyRuleResponse;
import com.wedservice.backend.module.tours.dto.response.ItineraryItemResponse;
import com.wedservice.backend.module.tours.dto.response.TagResponse;
import com.wedservice.backend.module.tours.dto.response.TourChecklistItemResponse;
import com.wedservice.backend.module.tours.dto.response.TourItineraryDayResponse;
import com.wedservice.backend.module.tours.dto.response.TourMediaResponse;
import com.wedservice.backend.module.tours.dto.response.TourComboPackageOfferResponse;
import com.wedservice.backend.module.tours.dto.response.TourDepartureHubResponse;
import com.wedservice.backend.module.tours.dto.response.TourInclusionFlagsResponse;
import com.wedservice.backend.module.tours.dto.response.TourNextScheduleSummaryResponse;
import com.wedservice.backend.module.tours.dto.response.TourResponse;
import com.wedservice.backend.module.tours.dto.response.TourScheduleGuideResponse;
import com.wedservice.backend.module.tours.dto.response.TourSchedulePickupPointResponse;
import com.wedservice.backend.module.tours.dto.response.TourScheduleResponse;
import com.wedservice.backend.module.tours.dto.response.TourSeasonalityResponse;
import com.wedservice.backend.module.tours.entity.QTour;
import com.wedservice.backend.module.tours.entity.CancellationPolicy;
import com.wedservice.backend.module.tours.entity.CancellationPolicyRule;
import com.wedservice.backend.module.tours.entity.Guide;
import com.wedservice.backend.module.tours.entity.GuideTranslation;
import com.wedservice.backend.module.tours.entity.Tag;
import com.wedservice.backend.module.tours.entity.TourChecklistItem;
import com.wedservice.backend.module.tours.entity.Tour;
import com.wedservice.backend.module.tours.entity.TourSeasonality;
import com.wedservice.backend.module.tours.entity.TourComboPackageLink;
import com.wedservice.backend.module.tours.entity.TourDepartureHub;
import com.wedservice.backend.module.tours.entity.TourInclusionFlags;
import com.wedservice.backend.module.tours.entity.TourSchedule;
import com.wedservice.backend.module.tours.entity.TourScheduleGuide;
import com.wedservice.backend.module.tours.entity.TourScheduleStatus;
import com.wedservice.backend.module.tours.entity.TourStatus;
import com.wedservice.backend.module.tours.entity.TourTranslation;
import com.wedservice.backend.module.tours.mapper.TourTranslationMergeHelper;
import com.wedservice.backend.module.tours.mapper.TourTranslationMergeHelper.MergedTourTexts;
import com.wedservice.backend.module.tours.repository.ItineraryItemRepository;
import com.wedservice.backend.module.tours.repository.CancellationPolicyRepository;
import com.wedservice.backend.module.tours.repository.CancellationPolicyRuleRepository;
import com.wedservice.backend.module.tours.repository.GuideRepository;
import com.wedservice.backend.module.tours.repository.GuideTranslationRepository;
import com.wedservice.backend.module.tours.repository.TagRepository;
import com.wedservice.backend.module.tours.repository.TourRepository;
import com.wedservice.backend.module.tours.repository.TourChecklistItemRepository;
import com.wedservice.backend.module.tours.repository.TourItineraryDayRepository;
import com.wedservice.backend.module.tours.repository.TourMediaRepository;
import com.wedservice.backend.module.tours.repository.TourSeasonalityRepository;
import com.wedservice.backend.module.tours.repository.TourScheduleGuideRepository;
import com.wedservice.backend.module.tours.repository.TourSchedulePickupPointRepository;
import com.wedservice.backend.module.tours.repository.TourComboPackageLinkRepository;
import com.wedservice.backend.module.tours.repository.TourDepartureHubRepository;
import com.wedservice.backend.module.tours.repository.TourInclusionFlagsRepository;
import com.wedservice.backend.module.tours.repository.TourScheduleRepository;
import com.wedservice.backend.module.tours.repository.TourTagRepository;
import com.wedservice.backend.module.tours.repository.TourTranslationRepository;
import com.wedservice.backend.module.tours.service.query.TourQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class TourQueryServiceImpl implements TourQueryService {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "name",
            "basePrice",
            "durationDays",
            "averageRating",
            "totalBookings",
            "isFeatured",
            "createdAt"
    );
    private static final Set<TourScheduleStatus> PUBLIC_SCHEDULE_STATUSES = Set.of(
            TourScheduleStatus.OPEN,
            TourScheduleStatus.CLOSED,
            TourScheduleStatus.FULL,
            TourScheduleStatus.DEPARTED,
            TourScheduleStatus.COMPLETED
    );

    private final TourRepository tourRepository;
    private final CancellationPolicyRepository cancellationPolicyRepository;
    private final CancellationPolicyRuleRepository cancellationPolicyRuleRepository;
    private final GuideRepository guideRepository;
    private final GuideTranslationRepository guideTranslationRepository;
    private final TourMediaRepository tourMediaRepository;
    private final TagRepository tagRepository;
    private final TourTagRepository tourTagRepository;
    private final TourSeasonalityRepository tourSeasonalityRepository;
    private final TourItineraryDayRepository tourItineraryDayRepository;
    private final ItineraryItemRepository itineraryItemRepository;
    private final TourChecklistItemRepository tourChecklistItemRepository;
    private final TourScheduleRepository tourScheduleRepository;
    private final TourDepartureHubRepository tourDepartureHubRepository;
    private final TourInclusionFlagsRepository tourInclusionFlagsRepository;
    private final TourComboPackageLinkRepository tourComboPackageLinkRepository;
    private final ComboPackageRepository comboPackageRepository;
    private final TourSchedulePickupPointRepository tourSchedulePickupPointRepository;
    private final TourScheduleGuideRepository tourScheduleGuideRepository;
    private final TourTranslationRepository tourTranslationRepository;
    private final TourTranslationMergeHelper tourTranslationMergeHelper;
    private final DestinationRepository destinationRepository;

    @Override
    @Cacheable(value = "tours", keyGenerator = "tourSearchCacheKeyGenerator")
    @Transactional(readOnly = true)
    public Page<TourResponse> searchTours(TourSearchRequest request) {
        return searchTours(request, true);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TourResponse> searchAdminTours(TourSearchRequest request) {
        return searchTours(request, false);
    }

    private Page<TourResponse> searchTours(TourSearchRequest request, boolean publicOnly) {
        validateSearchRequest(request);
        PageRequest pr = PageRequest.of(request.getPage(), request.getSize(), buildSort(request));

        QTour qTour = QTour.tour;
        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qTour.deletedAt.isNull());
        if (publicOnly) {
            builder.and(qTour.status.eq(TourStatus.ACTIVE));
        } else if (StringUtils.hasText(request.getStatus())) {
            builder.and(qTour.status.eq(TourStatus.fromValue(request.getStatus().trim())));
        }

        if (request.getDestinationId() != null) {
            Destination anchor = destinationRepository.findById(request.getDestinationId()).orElse(null);
            if (anchor == null || anchor.getDeletedAt() != null) {
                builder.and(qTour.destination.id.eq(request.getDestinationId()));
            } else if (Boolean.FALSE.equals(request.getDestinationSubtree())) {
                builder.and(qTour.destination.id.eq(request.getDestinationId()));
            } else {
                String pathPrefix = org.springframework.util.StringUtils.hasText(anchor.getPath())
                        ? anchor.getPath()
                        : "/" + anchor.getId() + "/";
                if (!pathPrefix.endsWith("/")) {
                    pathPrefix = pathPrefix + "/";
                }
                final String prefix = pathPrefix;
                builder.and(qTour.destination.id.eq(anchor.getId())
                        .or(qTour.destination.path.eq(prefix))
                        .or(qTour.destination.path.startsWith(prefix)));
            }
        }
        if (Boolean.TRUE.equals(request.getDomesticOnly())) {
            builder.and(qTour.destination.countryCode.equalsIgnoreCase("VN"));
        } else if (Boolean.TRUE.equals(request.getInternationalOnly())) {
            builder.and(qTour.destination.countryCode.toLowerCase().ne("vn"));
        } else if (StringUtils.hasText(request.getDestinationCountryCode())) {
            builder.and(qTour.destination.countryCode.equalsIgnoreCase(request.getDestinationCountryCode().trim()));
        }
        if (StringUtils.hasText(request.getKeyword())) {
            String keyword = request.getKeyword().trim();
            builder.and(qTour.name.containsIgnoreCase(keyword)
                    .or(qTour.slug.containsIgnoreCase(keyword))
                    .or(qTour.shortDescription.containsIgnoreCase(keyword))
                    .or(qTour.description.containsIgnoreCase(keyword))
                    .or(qTour.highlights.containsIgnoreCase(keyword)));
        }
        boolean requestedTagFilter = requestedTagFilter(request);
        if (requestedTagFilter) {
            List<Long> effectiveTagIds = resolveEffectiveTagIds(request);
            if (effectiveTagIds.isEmpty()) {
                return Page.empty(pr);
            }
            List<Long> matchingTourIds = resolveTourIdsByTagIds(effectiveTagIds);
            if (matchingTourIds.isEmpty()) {
                return Page.empty(pr);
            }
            builder.and(qTour.id.in(matchingTourIds));
        }
        if (request.getMinPrice() != null) {
            builder.and(qTour.basePrice.goe(request.getMinPrice()));
        }
        if (request.getMaxPrice() != null) {
            builder.and(qTour.basePrice.loe(request.getMaxPrice()));
        }
        if (request.getTravelMonth() != null) {
            List<Long> matchingTourIds = resolveTourIdsByTravelMonth(request.getTravelMonth());
            if (matchingTourIds.isEmpty()) {
                return Page.empty(pr);
            }
            builder.and(qTour.id.in(matchingTourIds));
        }
        if (Boolean.TRUE.equals(request.getFeaturedOnly())) {
            builder.and(qTour.isFeatured.isTrue());
        }
        if (Boolean.TRUE.equals(request.getEsgOnly())) {
            builder.and(qTour.esgScore.goe(80));
        } else if (request.getEsgMin() != null) {
            builder.and(qTour.esgScore.goe(request.getEsgMin()));
        }
        if (Boolean.TRUE.equals(request.getStudentFriendlyOnly())) {
            builder.and(qTour.isStudentFriendly.isTrue());
        }
        if (Boolean.TRUE.equals(request.getFamilyFriendlyOnly())) {
            builder.and(qTour.isFamilyFriendly.isTrue());
        }
        if (Boolean.TRUE.equals(request.getSeniorFriendlyOnly())) {
            builder.and(qTour.isSeniorFriendly.isTrue());
        }
        if (request.getDifficultyLevel() != null) {
            builder.and(qTour.difficultyLevel.eq(request.getDifficultyLevel()));
        }
        if (request.getActivityLevel() != null) {
            builder.and(qTour.activityLevel.eq(request.getActivityLevel()));
        }
        if (request.getMinDurationDays() != null) {
            builder.and(qTour.durationDays.goe(request.getMinDurationDays()));
        }
        if (request.getMaxDurationDays() != null) {
            builder.and(qTour.durationDays.loe(request.getMaxDurationDays()));
        }
        if (request.getTravellerAge() != null) {
            builder.and(qTour.minAge.isNull().or(qTour.minAge.loe(request.getTravellerAge())));
            builder.and(qTour.maxAge.isNull().or(qTour.maxAge.goe(request.getTravellerAge())));
        }
        if (request.getGroupSize() != null) {
            builder.and(qTour.minGroupSize.loe(request.getGroupSize()));
            builder.and(qTour.maxGroupSize.goe(request.getGroupSize()));
        }
        if (StringUtils.hasText(request.getTripMode())) {
            builder.and(qTour.tripMode.equalsIgnoreCase(request.getTripMode().trim()));
        }
        if (StringUtils.hasText(request.getTransportType())) {
            builder.and(qTour.transportType.containsIgnoreCase(request.getTransportType().trim()));
        }
        if (request.getMinRating() != null) {
            builder.and(qTour.averageRating.goe(request.getMinRating()));
        }

        Page<Tour> page = tourRepository.findAll(builder, pr);

        if (publicOnly) {
            String lang = LocaleTagUtil.currentLanguageTag();
            List<Long> tourIds = page.getContent().stream().map(Tour::getId).toList();
            Map<Long, TourTranslation> primaryMap = loadTourTranslationsMap(tourIds, lang);
            Map<Long, TourTranslation> viMap =
                    "vi".equals(lang) ? primaryMap : loadTourTranslationsMap(tourIds, "vi");
            List<TourResponse> rows = page.getContent().stream()
                    .map(t -> buildSearchListRow(
                            t,
                            tourTranslationMergeHelper.merge(
                                    primaryMap.get(t.getId()),
                                    viMap.get(t.getId()),
                                    t)))
                    .toList();
            enrichPublicListRows(rows);
            return new PageImpl<>(rows, pr, page.getTotalElements());
        }

        return page.map(t -> buildSearchListRow(t, tourTranslationMergeHelper.merge(null, null, t)));
    }

    @Override
    @Transactional(readOnly = true)
    public TourResponse getTour(Long id) {
        try {
            Tour tour = findActiveTour(id);
            String lang = LocaleTagUtil.currentLanguageTag();
            TourTranslation primary = tourTranslationRepository.findByTour_IdAndLocale(id, lang).orElse(null);
            TourTranslation vi = "vi".equals(lang)
                    ? primary
                    : tourTranslationRepository.findByTour_IdAndLocale(id, "vi").orElse(null);
            TourResponse response = toResponse(tour, true, primary, vi);
            enrichTourDetail(response);
            return response;
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error fetching tour {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Error processing tour details: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public TourResponse getAdminTour(Long id) {
        try {
            Tour tour = findActiveTour(id);
            return toResponse(tour, true, null, null);
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error fetching admin tour {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Error processing tour details: " + e.getMessage());
        }
    }

    @Override
    public List<TourScheduleResponse> getTourSchedules(Long tourId) {
        try {
            findActiveTour(tourId);
            return tourScheduleRepository.findByTourId(tourId).stream()
                    .filter(schedule -> schedule != null && schedule.getDeletedAt() == null)
                    .filter(schedule -> schedule.getStatus() != null && PUBLIC_SCHEDULE_STATUSES.contains(schedule.getStatus()))
                    .map(this::toScheduleResponse)
                    .toList();
        } catch (Exception e) {
            log.error("Error fetching schedules for tour {}: {}", tourId, e.getMessage(), e);
            throw new RuntimeException("Error processing tour schedules: " + e.getMessage());
        }
    }

    @Override
    public List<TourScheduleResponse> getAdminTourSchedules(Long tourId) {
        findActiveTour(tourId);
        return tourScheduleRepository.findByTourId(tourId).stream()
                .filter(schedule -> schedule.getDeletedAt() == null)
                .map(this::toScheduleResponse)
                .toList();
    }

    @Override
    public TourScheduleResponse getTourSchedule(Long tourId, Long scheduleId) {
        findActiveTour(tourId);
        TourSchedule schedule = tourScheduleRepository.findByIdAndTourId(scheduleId, tourId)
                .orElseThrow(() -> new ResourceNotFoundException("Tour schedule not found"));
        if (schedule.getDeletedAt() != null) {
            throw new ResourceNotFoundException("Tour schedule has been deleted");
        }
        return toScheduleResponse(schedule);
    }

    private Tour findActiveTour(Long id) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + id));
        if (tour.getDeletedAt() != null) {
            throw new ResourceNotFoundException("Tour has been deleted");
        }
        return tour;
    }

    /**
     * Batch-loads {@link TourTranslation} rows for the given locale (e.g. {@code en}, {@code vi}).
     */
    private Map<Long, TourTranslation> loadTourTranslationsMap(Collection<Long> tourIds, String locale) {
        if (tourIds == null || tourIds.isEmpty()) {
            return Map.of();
        }
        List<TourTranslation> list = tourTranslationRepository.findByTour_IdInAndLocale(tourIds, locale);
        Map<Long, TourTranslation> map = new HashMap<>();
        for (TourTranslation tr : list) {
            Long tid = tr.getTour() != null ? tr.getTour().getId() : null;
            if (tid != null) {
                map.putIfAbsent(tid, tr);
            }
        }
        return map;
    }

    private boolean requestedTagFilter(TourSearchRequest request) {
        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            return true;
        }
        if (request.getTagCodes() == null || request.getTagCodes().isEmpty()) {
            return false;
        }
        return request.getTagCodes().stream().anyMatch(StringUtils::hasText);
    }

    private List<Long> resolveEffectiveTagIds(TourSearchRequest request) {
        LinkedHashSet<Long> ids = new LinkedHashSet<>();
        if (request.getTagIds() != null) {
            for (Long id : request.getTagIds()) {
                if (id != null) {
                    ids.add(id);
                }
            }
        }
        if (request.getTagCodes() != null && !request.getTagCodes().isEmpty()) {
            List<String> codes = request.getTagCodes().stream()
                    .filter(StringUtils::hasText)
                    .map(s -> s.trim())
                    .toList();
            if (!codes.isEmpty()) {
                tagRepository.findByCodeInIgnoreCaseAndIsActiveTrue(codes).forEach(tag -> ids.add(tag.getId()));
            }
        }
        return new ArrayList<>(ids);
    }

    private List<Long> resolveTourIdsByTagIds(Collection<Long> tagIds) {
        return new java.util.ArrayList<>(tourTagRepository.findByIdTagIdIn(tagIds).stream()
                .map(tourTag -> tourTag.getId().getTourId())
                .collect(java.util.stream.Collectors.toCollection(LinkedHashSet::new)));
    }

    private List<Long> resolveTourIdsByTravelMonth(Integer travelMonth) {
        return new java.util.ArrayList<>(tourSeasonalityRepository.findActiveByTravelMonth(travelMonth).stream()
                .map(TourSeasonality::getTourId)
                .collect(java.util.stream.Collectors.toCollection(LinkedHashSet::new)));
    }

    private void validateSearchRequest(TourSearchRequest request) {
        BigDecimal minPrice = request.getMinPrice();
        BigDecimal maxPrice = request.getMaxPrice();
        if (minPrice != null && maxPrice != null && maxPrice.compareTo(minPrice) < 0) {
            throw BadRequestException.i18n("api.error.tour.search.maxPriceGteMin");
        }
        Integer minDurationDays = request.getMinDurationDays();
        Integer maxDurationDays = request.getMaxDurationDays();
        if (minDurationDays != null && maxDurationDays != null && maxDurationDays < minDurationDays) {
            throw BadRequestException.i18n("api.error.tour.search.maxDurationGteMin");
        }
        if (Boolean.TRUE.equals(request.getDomesticOnly()) && Boolean.TRUE.equals(request.getInternationalOnly())) {
            throw BadRequestException.i18n("api.error.tour.search.domesticInternationalExclusive");
        }
        if (StringUtils.hasText(request.getDestinationCountryCode())) {
            String cc = request.getDestinationCountryCode().trim();
            if (Boolean.TRUE.equals(request.getDomesticOnly()) && !"VN".equalsIgnoreCase(cc)) {
                throw BadRequestException.i18n("api.error.tour.search.countryConflictDomestic");
            }
            if (Boolean.TRUE.equals(request.getInternationalOnly()) && "VN".equalsIgnoreCase(cc)) {
                throw BadRequestException.i18n("api.error.tour.search.countryConflictInternational");
            }
        }
    }

    private Sort buildSort(TourSearchRequest request) {
        String sortBy = "createdAt";
        if (StringUtils.hasText(request.getSortBy()) && ALLOWED_SORT_FIELDS.contains(request.getSortBy())) {
            sortBy = request.getSortBy();
        }
        
        Sort.Direction direction = Sort.Direction.DESC;
        if (StringUtils.hasText(request.getSortDir())) {
            try {
                direction = Sort.Direction.fromString(request.getSortDir());
            } catch (Exception ignored) {
            }
        }
        return Sort.by(direction, sortBy);
    }

    /**
     * Full tour payload. When {@code primary} and {@code vi} are both null (admin), canonical
     * {@link Tour} text columns are returned; otherwise strings follow Accept-Language with
     * Vietnamese fallback (see {@link TourTranslationMergeHelper}).
     */
    private TourResponse toResponse(Tour t, boolean includeContent, TourTranslation primary, TourTranslation vi) {
        if (t == null) {
            return null;
        }

        MergedTourTexts m = tourTranslationMergeHelper.merge(primary, vi, t);

        Long destinationId = null;
        String destinationCountryCode = null;
        String destinationName = null;
        String destinationProvince = null;
        try {
            if (t.getDestination() != null) {
                Destination d = t.getDestination();
                destinationId = d.getId();
                destinationCountryCode = d.getCountryCode();
                destinationName = d.getName();
                destinationProvince = d.getProvince();
            }
        } catch (Exception e) {
            log.warn("Could not load destination for tour {}: {}", t.getId(), e.getMessage());
        }

        TourResponse.TourResponseBuilder builder = TourResponse.builder()
                .id(t.getId())
                .code(t.getCode())
                .name(m.name())
                .slug(t.getSlug())
                .destinationId(destinationId)
                .destinationCountryCode(destinationCountryCode)
                .destinationName(destinationName)
                .destinationProvince(destinationProvince)
                .cancellationPolicyId(t.getCancellationPolicyId())
                .basePrice(t.getBasePrice())
                .esgScore(t.getEsgScore())
                .leiScore(t.getLeiScore())
                .listPrice(t.getListPrice())
                .currency(t.getCurrency())
                .durationDays(t.getDurationDays())
                .durationNights(t.getDurationNights() != null ? t.getDurationNights() : 0)
                .shortDescription(m.shortDescription())
                .description(m.description())
                .transportType(t.getTransportType())
                .tripMode(t.getTripMode())
                .highlights(m.highlights())
                .inclusions(m.inclusions())
                .exclusions(m.exclusions())
                .notes(m.notes())
                .isFeatured(t.getIsFeatured())
                .status(t.getStatus() != null ? t.getStatus().getValue() : null)
                .averageRating(t.getAverageRating())
                .totalReviews(t.getTotalReviews())
                .totalBookings(t.getTotalBookings())
                .translationKey(t.getSlug())
                .itinerarySummary(m.itinerarySummary());

        if (includeContent) {
            try {
                builder.tags(loadTagResponses(t.getId()))
                        .media(loadMediaResponses(t.getId()))
                        .seasonality(loadSeasonalityResponses(t.getId()))
                        .itineraryDays(loadItineraryDayResponses(t.getId()))
                        .checklistItems(loadChecklistResponses(t.getId()))
                        .cancellationPolicy(loadCancellationPolicyResponse(t.getCancellationPolicyId()));
            } catch (Exception e) {
                log.error("Error loading full content for tour {}: {}", t.getId(), e.getMessage(), e);
            }
        }

        return builder.build();
    }

    /**
     * Search/list card: merged localized title and teaser; media and tags included for gallery-style lists.
     */
    private TourResponse buildSearchListRow(Tour t, MergedTourTexts m) {
        Long destinationId = null;
        String destinationCountryCode = null;
        String destinationName = null;
        String destinationProvince = null;
        if (t.getDestination() != null) {
            Destination d = t.getDestination();
            destinationId = d.getId();
            destinationCountryCode = d.getCountryCode();
            destinationName = d.getName();
            destinationProvince = d.getProvince();
        }
        return TourResponse.builder()
                .id(t.getId())
                .code(t.getCode())
                .name(m.name())
                .slug(t.getSlug())
                .destinationId(destinationId)
                .destinationCountryCode(destinationCountryCode)
                .destinationName(destinationName)
                .destinationProvince(destinationProvince)
                .basePrice(t.getBasePrice())
                .esgScore(t.getEsgScore())
                .leiScore(t.getLeiScore())
                .listPrice(t.getListPrice())
                .currency(t.getCurrency())
                .durationDays(t.getDurationDays())
                .durationNights(t.getDurationNights())
                .shortDescription(m.shortDescription())
                .transportType(t.getTransportType())
                .tripMode(t.getTripMode())
                .isFeatured(t.getIsFeatured())
                .status(t.getStatus() != null ? t.getStatus().getValue() : null)
                .averageRating(t.getAverageRating())
                .totalReviews(t.getTotalReviews())
                .totalBookings(t.getTotalBookings())
                .media(loadMediaResponses(t.getId()))
                .tags(loadTagResponses(t.getId()))
                .translationKey(t.getSlug())
                .itinerarySummary(m.itinerarySummary())
                .build();
    }

    private void enrichPublicListRows(List<TourResponse> rows) {
        if (rows == null || rows.isEmpty()) {
            return;
        }
        List<Long> tourIds = rows.stream().map(TourResponse::getId).filter(id -> id != null).toList();
        if (tourIds.isEmpty()) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();
        Map<Long, TourSchedule> nextScheduleByTour = new HashMap<>();
        for (TourSchedule schedule :
                tourScheduleRepository.findBookableUpcomingByTourIds(
                        tourIds, TourScheduleStatus.OPEN, now)) {
            nextScheduleByTour.putIfAbsent(schedule.getTourId(), schedule);
        }

        Map<Long, String> departureCityByTour = new HashMap<>();
        List<TourDepartureHub> hubs =
                tourDepartureHubRepository.findByTourIdInAndDeletedAtIsNullOrderByTourIdAscSortOrderAsc(
                        tourIds);
        for (TourDepartureHub hub : hubs) {
            if (Boolean.TRUE.equals(hub.getIsPrimary())) {
                departureCityByTour.put(hub.getTourId(), hub.getCityNameVi());
            }
        }
        for (TourDepartureHub hub : hubs) {
            departureCityByTour.putIfAbsent(hub.getTourId(), hub.getCityNameVi());
        }

        Map<Long, TourInclusionFlags> flagsByTour = new HashMap<>();
        for (TourInclusionFlags flags : tourInclusionFlagsRepository.findByTourIdIn(tourIds)) {
            flagsByTour.put(flags.getTourId(), flags);
        }

        for (TourResponse row : rows) {
            Long tourId = row.getId();
            if (tourId == null) {
                continue;
            }
            TourSchedule next = nextScheduleByTour.get(tourId);
            if (next != null) {
                row.setNextOpenSchedule(toNextScheduleSummary(next));
            }
            String city = departureCityByTour.get(tourId);
            if (StringUtils.hasText(city)) {
                row.setPrimaryDepartureCity(city);
            }
            TourInclusionFlags flags = flagsByTour.get(tourId);
            if (flags != null) {
                row.setInclusionFlags(toInclusionFlagsResponse(flags));
            }
        }
    }

    private int resolveRemainingSeats(TourSchedule schedule) {
        if (schedule.getRemainingSeats() != null) {
            return Math.max(0, schedule.getRemainingSeats());
        }
        int capacity = schedule.getCapacityTotal() != null ? schedule.getCapacityTotal() : 0;
        int booked = schedule.getBookedSeats() != null ? schedule.getBookedSeats() : 0;
        return Math.max(0, capacity - booked);
    }

    private TourNextScheduleSummaryResponse toNextScheduleSummary(TourSchedule schedule) {
        int remaining = resolveRemainingSeats(schedule);
        return TourNextScheduleSummaryResponse.builder()
                .scheduleId(schedule.getId())
                .scheduleCode(schedule.getScheduleCode())
                .departureAt(schedule.getDepartureAt())
                .returnAt(schedule.getReturnAt())
                .remainingSeats(remaining)
                .capacityTotal(schedule.getCapacityTotal())
                .meetingPointName(schedule.getMeetingPointName())
                .adultPrice(schedule.getAdultPrice())
                .build();
    }

    private TourInclusionFlagsResponse toInclusionFlagsResponse(TourInclusionFlags flags) {
        return TourInclusionFlagsResponse.builder()
                .hasFlight(flags.getHasFlight())
                .hasHotel(flags.getHasHotel())
                .hasMeals(flags.getHasMeals())
                .hasTickets(flags.getHasTickets())
                .hasGuide(flags.getHasGuide())
                .hasInsurance(flags.getHasInsurance())
                .hasTransport(flags.getHasTransport())
                .hotelStars(flags.getHotelStars())
                .flightType(flags.getFlightType() != null ? flags.getFlightType().name() : null)
                .notes(flags.getNotes())
                .build();
    }

    private void enrichTourDetail(TourResponse response) {
        if (response == null || response.getId() == null) {
            return;
        }
        enrichPublicListRows(List.of(response));

        Long tourId = response.getId();
        List<TourDepartureHubResponse> hubs =
                tourDepartureHubRepository.findByTourIdAndDeletedAtIsNullOrderBySortOrderAsc(tourId).stream()
                        .map(this::toDepartureHubResponse)
                        .toList();
        response.setDepartureHubs(hubs);

        List<TourComboPackageOfferResponse> combos = new ArrayList<>();
        for (TourComboPackageLink link :
                tourComboPackageLinkRepository.findByTourIdOrderBySortOrderAsc(tourId)) {
            comboPackageRepository
                    .findById(link.getComboId())
                    .filter(combo -> Boolean.TRUE.equals(combo.getIsActive()))
                    .ifPresent(combo -> combos.add(toComboOfferResponse(link, combo)));
        }
        response.setComboPackages(combos);
    }

    private TourDepartureHubResponse toDepartureHubResponse(TourDepartureHub hub) {
        return TourDepartureHubResponse.builder()
                .cityCode(hub.getCityCode())
                .cityNameVi(hub.getCityNameVi())
                .cityNameEn(hub.getCityNameEn())
                .isPrimary(hub.getIsPrimary())
                .sortOrder(hub.getSortOrder())
                .build();
    }

    private TourComboPackageOfferResponse toComboOfferResponse(
            TourComboPackageLink link, ComboPackage combo) {
        BigDecimal finalPrice =
                combo.getBasePrice().subtract(combo.getDiscountAmount()).max(BigDecimal.ZERO);
        return TourComboPackageOfferResponse.builder()
                .comboId(combo.getId())
                .code(combo.getCode())
                .name(combo.getName())
                .description(combo.getDescription())
                .basePrice(combo.getBasePrice())
                .discountAmount(combo.getDiscountAmount())
                .finalPrice(finalPrice)
                .packageRole(link.getPackageRole() != null ? link.getPackageRole().name() : null)
                .isDefault(link.getIsDefault())
                .sortOrder(link.getSortOrder())
                .build();
    }

    private TourScheduleResponse toScheduleResponse(TourSchedule schedule) {
        List<TourSchedulePickupPointResponse> pickupPoints = loadSchedulePickupPoints(schedule.getId());
        List<TourScheduleGuideResponse> guideAssignments = loadScheduleGuides(schedule.getId());
        int remainingSeats = resolveRemainingSeats(schedule);

        return TourScheduleResponse.builder()
                .id(schedule.getId())
                .scheduleCode(schedule.getScheduleCode())
                .tourId(schedule.getTourId())
                .departureAt(schedule.getDepartureAt())
                .returnAt(schedule.getReturnAt())
                .bookingOpenAt(schedule.getBookingOpenAt())
                .bookingCloseAt(schedule.getBookingCloseAt())
                .meetingAt(schedule.getMeetingAt())
                .meetingPointName(schedule.getMeetingPointName())
                .meetingAddress(schedule.getMeetingAddress())
                .meetingLatitude(schedule.getMeetingLatitude())
                .meetingLongitude(schedule.getMeetingLongitude())
                .capacityTotal(schedule.getCapacityTotal())
                .bookedSeats(schedule.getBookedSeats())
                .remainingSeats(remainingSeats)
                .minGuestsToOperate(schedule.getMinGuestsToOperate())
                .adultPrice(schedule.getAdultPrice())
                .childPrice(schedule.getChildPrice())
                .infantPrice(schedule.getInfantPrice())
                .seniorPrice(schedule.getSeniorPrice())
                .singleRoomSurcharge(schedule.getSingleRoomSurcharge())
                .transportDetail(schedule.getTransportDetail())
                .note(schedule.getNote())
                .status(schedule.getStatus() != null ? schedule.getStatus().getValue() : TourScheduleStatus.DRAFT.getValue())
                .pickupPoints(pickupPoints)
                .guideAssignments(guideAssignments)
                .build();
    }

    private List<TourSchedulePickupPointResponse> loadSchedulePickupPoints(Long scheduleId) {
        try {
            return tourSchedulePickupPointRepository
                    .findByScheduleIdOrderBySortOrder(scheduleId)
                    .stream()
                    .filter(pickupPoint -> pickupPoint.getDeletedAt() == null)
                    .map(pickupPoint -> TourSchedulePickupPointResponse.builder()
                            .id(pickupPoint.getId())
                            .pointName(pickupPoint.getPointName())
                            .address(pickupPoint.getAddress())
                            .latitude(pickupPoint.getLatitude())
                            .longitude(pickupPoint.getLongitude())
                            .pickupAt(pickupPoint.getPickupAt())
                            .sortOrder(pickupPoint.getSortOrder())
                            .build())
                    .toList();
        } catch (Exception e) {
            log.warn("Could not load pickup points for schedule {}: {}", scheduleId, e.getMessage());
            return List.of();
        }
    }

    private List<TourScheduleGuideResponse> loadScheduleGuides(Long scheduleId) {
        try {
            List<TourScheduleGuide> assignedGuides = tourScheduleGuideRepository.findByScheduleId(scheduleId).stream()
                    .filter(guide -> guide.getDeletedAt() == null)
                    .toList();
            Map<Long, Guide> guideMap = loadGuideMap(assignedGuides.stream().map(TourScheduleGuide::getGuideId).toList());
            String lang = LocaleTagUtil.currentLanguageTag();
            Map<Long, GuideTranslation> guideTr = loadGuideTranslations(guideMap.keySet(), lang);
            return assignedGuides
                    .stream()
                    .map(guide -> {
                        Guide guideProfile = guideMap.get(guide.getGuideId());
                        GuideTranslation tr = guide.getGuideId() != null ? guideTr.get(guide.getGuideId()) : null;
                        return TourScheduleGuideResponse.builder()
                                .id(guide.getId())
                                .guideId(guide.getGuideId())
                                .guideCode(guideProfile != null ? guideProfile.getCode() : null)
                                .guideFullName(resolveGuideFullName(guideProfile, tr))
                                .guidePhone(guideProfile != null ? guideProfile.getPhone() : null)
                                .guideEmail(guideProfile != null ? guideProfile.getEmail() : null)
                                .guideStatus(guideProfile != null ? guideProfile.getStatus() : null)
                                .isLocalGuide(guideProfile != null ? guideProfile.getIsLocalGuide() : null)
                                .guideRole(guide.getGuideRole())
                                .assignedAt(guide.getAssignedAt())
                                .build();
                    })
                    .toList();
        } catch (Exception e) {
            log.warn("Could not load guide assignments for schedule {}: {}", scheduleId, e.getMessage());
            return List.of();
        }
    }

    private List<TourMediaResponse> loadMediaResponses(Long tourId) {
        return tourMediaRepository.findByTourIdOrderBySortOrder(tourId).stream()
                .filter(media -> media.getDeletedAt() == null)
                .map(media -> TourMediaResponse.builder()
                        .id(media.getId())
                        .mediaType(media.getMediaType())
                        .mediaUrl(media.getMediaUrl())
                        .altText(media.getAltText())
                        .sortOrder(media.getSortOrder())
                        .isActive(media.getIsActive())
                        .build())
                .toList();
    }

    private List<TagResponse> loadTagResponses(Long tourId) {
        List<Long> tagIds = tourTagRepository.findByIdTourId(tourId).stream()
                .map(tourTag -> tourTag.getId().getTagId())
                .toList();
        if (tagIds.isEmpty()) {
            return List.of();
        }
        return tagRepository.findAllById(tagIds).stream()
                .filter(tag -> Boolean.TRUE.equals(tag.getIsActive()))
                .map(this::toTagResponse)
                .toList();
    }

    private TagResponse toTagResponse(Tag tag) {
        return TagResponse.builder()
                .id(tag.getId())
                .code(tag.getCode())
                .name(tag.getName())
                .tagGroup(tag.getTagGroup())
                .description(tag.getDescription())
                .build();
    }

    private List<TourSeasonalityResponse> loadSeasonalityResponses(Long tourId) {
        return tourSeasonalityRepository.findByTourId(tourId).stream()
                .filter(season -> season.getDeletedAt() == null)
                .sorted(Comparator.comparing(TourSeasonality::getSeasonName))
                .map(season -> TourSeasonalityResponse.builder()
                        .id(season.getId())
                        .seasonName(season.getSeasonName())
                        .monthFrom(season.getMonthFrom())
                        .monthTo(season.getMonthTo())
                        .recommendationScore(season.getRecommendationScore())
                        .notes(season.getNotes())
                        .build())
                .toList();
    }

    private List<TourItineraryDayResponse> loadItineraryDayResponses(Long tourId) {
        return tourItineraryDayRepository.findByTourIdOrderByDayNumber(tourId).stream()
                .filter(day -> day.getDeletedAt() == null)
                .map(day -> TourItineraryDayResponse.builder()
                        .id(day.getId())
                        .dayNumber(day.getDayNumber())
                        .title(day.getTitle())
                        .description(day.getDescription())
                        .overnightDestinationId(day.getOvernightDestinationId())
                        .items(itineraryItemRepository.findByItineraryDayIdOrderBySequenceNo(day.getId()).stream()
                                .filter(item -> item.getDeletedAt() == null)
                                .map(item -> ItineraryItemResponse.builder()
                                        .id(item.getId())
                                        .sequenceNo(item.getSequenceNo())
                                        .itemType(item.getItemType())
                                        .title(item.getTitle())
                                        .description(item.getDescription())
                                        .destinationId(item.getDestinationId())
                                        .locationName(item.getLocationName())
                                        .address(item.getAddress())
                                        .latitude(item.getLatitude())
                                        .longitude(item.getLongitude())
                                        .googleMapUrl(item.getGoogleMapUrl())
                                        .startTime(item.getStartTime())
                                        .endTime(item.getEndTime())
                                        .travelMinutesEstimated(item.getTravelMinutesEstimated())
                                        .build())
                                .toList())
                        .build())
                .toList();
    }

    private List<TourChecklistItemResponse> loadChecklistResponses(Long tourId) {
        return tourChecklistItemRepository.findByTourId(tourId).stream()
                .filter(item -> item.getDeletedAt() == null)
                .sorted(Comparator
                        .comparing((TourChecklistItem item) -> item.getItemGroup() == null ? "" : item.getItemGroup())
                        .thenComparing(TourChecklistItem::getItemName))
                .map(item -> TourChecklistItemResponse.builder()
                        .id(item.getId())
                        .itemName(item.getItemName())
                        .itemGroup(item.getItemGroup())
                        .isRequired(item.getIsRequired())
                        .build())
                .toList();
    }

    private CancellationPolicyResponse loadCancellationPolicyResponse(Long cancellationPolicyId) {
        if (cancellationPolicyId == null) {
            return null;
        }
        CancellationPolicy policy = cancellationPolicyRepository.findById(cancellationPolicyId)
                .orElse(null);
        if (policy == null) {
            return null;
        }
        return CancellationPolicyResponse.builder()
                .id(policy.getId())
                .name(policy.getName())
                .description(policy.getDescription())
                .voucherBonusPercent(policy.getVoucherBonusPercent())
                .isDefault(policy.getIsDefault())
                .isActive(policy.getIsActive())
                .rules(cancellationPolicyRuleRepository.findByPolicyIdOrderByMinHoursBeforeDesc(cancellationPolicyId).stream()
                        .map(this::toCancellationPolicyRuleResponse)
                        .toList())
                .build();
    }

    private CancellationPolicyRuleResponse toCancellationPolicyRuleResponse(CancellationPolicyRule rule) {
        return CancellationPolicyRuleResponse.builder()
                .id(rule.getId())
                .minHoursBefore(rule.getMinHoursBefore())
                .maxHoursBefore(rule.getMaxHoursBefore())
                .refundPercent(rule.getRefundPercent())
                .voucherPercent(rule.getVoucherPercent())
                .feePercent(rule.getFeePercent())
                .allowReschedule(rule.getAllowReschedule())
                .notes(rule.getNotes())
                .build();
    }

    private Map<Long, Guide> loadGuideMap(Collection<Long> guideIds) {
        if (guideIds == null || guideIds.isEmpty()) {
            return new java.util.HashMap<>();
        }
        List<Long> safeIds = guideIds.stream().filter(java.util.Objects::nonNull).toList();
        if (safeIds.isEmpty()) {
            return new java.util.HashMap<>();
        }
        return guideRepository.findByIdIn(safeIds).stream()
                .filter(g -> g != null && g.getId() != null)
                .collect(java.util.stream.Collectors.toMap(Guide::getId, guide -> guide, (left, right) -> left));
    }

    private Map<Long, GuideTranslation> loadGuideTranslations(Collection<Long> guideIds, String locale) {
        if (guideIds == null || guideIds.isEmpty()) {
            return Map.of();
        }
        List<GuideTranslation> list = guideTranslationRepository.findByGuide_IdInAndLocale(guideIds, locale);
        Map<Long, GuideTranslation> map = new HashMap<>();
        for (GuideTranslation t : list) {
            Long id = t.getGuide() != null ? t.getGuide().getId() : null;
            if (id != null) {
                map.putIfAbsent(id, t);
            }
        }
        return map;
    }

    private static String resolveGuideFullName(Guide guide, GuideTranslation tr) {
        if (guide == null) {
            return null;
        }
        if (tr != null && StringUtils.hasText(tr.getFullName())) {
            return tr.getFullName();
        }
        return guide.getFullName();
    }
}

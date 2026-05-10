package com.wedservice.backend.module.tours.service;

import com.wedservice.backend.common.exception.BadRequestException;
import com.wedservice.backend.common.exception.ResourceNotFoundException;
import com.wedservice.backend.common.i18n.LocaleTagUtil;
import com.wedservice.backend.module.tours.dto.request.UpsertTourTranslationRequest;
import com.wedservice.backend.module.tours.dto.response.TourTranslationResponse;
import com.wedservice.backend.module.tours.entity.Tour;
import com.wedservice.backend.module.tours.entity.TourTranslation;
import com.wedservice.backend.module.tours.repository.TourRepository;
import com.wedservice.backend.module.tours.repository.TourTranslationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class TourTranslationAdminService {

    private final TourRepository tourRepository;
    private final TourTranslationRepository tourTranslationRepository;

    @Transactional(readOnly = true)
    public List<TourTranslationResponse> listByTourId(Long tourId) {
        ensureTourExists(tourId);
        return tourTranslationRepository.findByTour_IdOrderByLocaleAsc(tourId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public TourTranslationResponse upsert(Long tourId, String localeTag, UpsertTourTranslationRequest request) {
        if (!hasAnyTranslatableContent(request)) {
            throw BadRequestException.i18n("api.error.tour.translationOneOfProvided");
        }

        Tour tour = ensureTourExists(tourId);
        String lang = normalizeSupportedLocale(localeTag);

        TourTranslation entity = tourTranslationRepository
                .findByTour_IdAndLocale(tourId, lang)
                .orElseGet(() -> TourTranslation.builder()
                        .tour(tour)
                        .locale(lang)
                        .build());

        if (StringUtils.hasText(request.getName())) {
            entity.setName(request.getName().trim());
        }
        if (request.getShortDescription() != null) {
            entity.setShortDescription(blankToNull(request.getShortDescription()));
        }
        if (request.getDescription() != null) {
            entity.setDescription(blankToNull(request.getDescription()));
        }
        if (request.getHighlights() != null) {
            entity.setHighlights(blankToNull(request.getHighlights()));
        }
        if (request.getInclusions() != null) {
            entity.setInclusions(blankToNull(request.getInclusions()));
        }
        if (request.getExclusions() != null) {
            entity.setExclusions(blankToNull(request.getExclusions()));
        }
        if (request.getNotes() != null) {
            entity.setNotes(blankToNull(request.getNotes()));
        }
        if (request.getItinerarySummary() != null) {
            entity.setItinerarySummary(blankToNull(request.getItinerarySummary()));
        }

        return toResponse(tourTranslationRepository.save(entity));
    }

    @Transactional
    public void delete(Long tourId, String localeTag) {
        ensureTourExists(tourId);
        String lang = normalizeSupportedLocale(localeTag);
        TourTranslation entity = tourTranslationRepository.findByTour_IdAndLocale(tourId, lang)
                .orElseThrow(() -> BadRequestException.i18n("api.error.tour.translation_not_found", lang));
        tourTranslationRepository.delete(entity);
    }

    private static boolean hasAnyTranslatableContent(UpsertTourTranslationRequest request) {
        return StringUtils.hasText(request.getName())
                || StringUtils.hasText(request.getShortDescription())
                || StringUtils.hasText(request.getDescription())
                || StringUtils.hasText(request.getHighlights())
                || StringUtils.hasText(request.getInclusions())
                || StringUtils.hasText(request.getExclusions())
                || StringUtils.hasText(request.getNotes())
                || StringUtils.hasText(request.getItinerarySummary());
    }

    private static String blankToNull(String s) {
        return StringUtils.hasText(s) ? s.trim() : null;
    }

    private Tour ensureTourExists(Long tourId) {
        return tourRepository.findById(tourId)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + tourId));
    }

    private static String normalizeSupportedLocale(String localeTag) {
        if (!StringUtils.hasText(localeTag)) {
            throw BadRequestException.i18n("api.error.tour.localeRequired");
        }
        String lang = LocaleTagUtil.normalizeLanguageTag(Locale.forLanguageTag(localeTag.trim()));
        if (!"en".equals(lang) && !"vi".equals(lang)) {
            throw BadRequestException.i18n("api.error.tour.localeUnsupported", localeTag);
        }
        return lang;
    }

    private TourTranslationResponse toResponse(TourTranslation t) {
        return TourTranslationResponse.builder()
                .id(t.getId())
                .locale(t.getLocale())
                .name(t.getName())
                .shortDescription(t.getShortDescription())
                .description(t.getDescription())
                .highlights(t.getHighlights())
                .inclusions(t.getInclusions())
                .exclusions(t.getExclusions())
                .notes(t.getNotes())
                .itinerarySummary(t.getItinerarySummary())
                .build();
    }
}

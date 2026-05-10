package com.wedservice.backend.module.tours.service;

import com.wedservice.backend.common.exception.BadRequestException;
import com.wedservice.backend.common.exception.ResourceNotFoundException;
import com.wedservice.backend.common.i18n.LocaleTagUtil;
import com.wedservice.backend.module.tours.dto.request.UpsertGuideTranslationRequest;
import com.wedservice.backend.module.tours.dto.response.GuideTranslationResponse;
import com.wedservice.backend.module.tours.entity.Guide;
import com.wedservice.backend.module.tours.entity.GuideTranslation;
import com.wedservice.backend.module.tours.repository.GuideRepository;
import com.wedservice.backend.module.tours.repository.GuideTranslationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class GuideTranslationAdminService {

    private final GuideRepository guideRepository;
    private final GuideTranslationRepository guideTranslationRepository;

    @Transactional(readOnly = true)
    public List<GuideTranslationResponse> listByGuideId(Long guideId) {
        ensureGuideExists(guideId);
        return guideTranslationRepository.findByGuide_IdOrderByLocaleAsc(guideId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public GuideTranslationResponse upsert(Long guideId, String localeTag, UpsertGuideTranslationRequest request) {
        if (!StringUtils.hasText(request.getFullName()) && !StringUtils.hasText(request.getBio())) {
            throw BadRequestException.i18n("api.error.guide.translationOneOfProvided");
        }

        Guide guide = ensureGuideExists(guideId);
        String lang = normalizeSupportedLocale(localeTag);

        GuideTranslation entity = guideTranslationRepository
                .findByGuide_IdAndLocale(guideId, lang)
                .orElseGet(() -> GuideTranslation.builder()
                        .guide(guide)
                        .locale(lang)
                        .build());

        if (StringUtils.hasText(request.getFullName())) {
            entity.setFullName(request.getFullName().trim());
        }
        if (request.getBio() != null) {
            entity.setBio(StringUtils.hasText(request.getBio()) ? request.getBio().trim() : null);
        }

        return toResponse(guideTranslationRepository.save(entity));
    }

    private Guide ensureGuideExists(Long guideId) {
        return guideRepository.findById(guideId)
                .orElseThrow(() -> new ResourceNotFoundException("Guide not found with id: " + guideId));
    }

    private static String normalizeSupportedLocale(String localeTag) {
        if (!StringUtils.hasText(localeTag)) {
            throw BadRequestException.i18n("api.error.guide.localeRequired");
        }
        String lang = LocaleTagUtil.normalizeLanguageTag(Locale.forLanguageTag(localeTag.trim()));
        if (!"en".equals(lang) && !"vi".equals(lang)) {
            throw BadRequestException.i18n("api.error.guide.localeUnsupported", localeTag);
        }
        return lang;
    }

    private GuideTranslationResponse toResponse(GuideTranslation t) {
        return GuideTranslationResponse.builder()
                .id(t.getId())
                .locale(t.getLocale())
                .fullName(t.getFullName())
                .bio(t.getBio())
                .build();
    }
}

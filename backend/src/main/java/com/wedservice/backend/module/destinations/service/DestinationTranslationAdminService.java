package com.wedservice.backend.module.destinations.service;

import com.wedservice.backend.common.exception.BadRequestException;
import com.wedservice.backend.common.exception.ResourceNotFoundException;
import com.wedservice.backend.common.i18n.LocaleTagUtil;
import com.wedservice.backend.module.destinations.dto.request.UpsertDestinationTranslationRequest;
import com.wedservice.backend.module.destinations.dto.response.DestinationTranslationResponse;
import com.wedservice.backend.module.destinations.entity.Destination;
import com.wedservice.backend.module.destinations.entity.DestinationTranslation;
import com.wedservice.backend.module.destinations.repository.DestinationRepository;
import com.wedservice.backend.module.destinations.repository.DestinationTranslationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DestinationTranslationAdminService {

    private final DestinationRepository destinationRepository;
    private final DestinationTranslationRepository destinationTranslationRepository;

    @Transactional(readOnly = true)
    public List<DestinationTranslationResponse> listByDestinationUuid(UUID destinationUuid) {
        Destination destination = destinationRepository.findByUuid(destinationUuid)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with uuid: " + destinationUuid));
        return destinationTranslationRepository.findByDestination_IdOrderByLocaleAsc(destination.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public DestinationTranslationResponse upsert(UUID destinationUuid, String localeTag, UpsertDestinationTranslationRequest request) {
        if (!StringUtils.hasText(request.getName())
                && !StringUtils.hasText(request.getShortDescription())
                && !StringUtils.hasText(request.getDescription())) {
            throw BadRequestException.i18n("api.error.destination.translation.oneOfProvided");
        }

        Destination destination = destinationRepository.findByUuid(destinationUuid)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with uuid: " + destinationUuid));

        String lang = normalizeSupportedLocale(localeTag);
        DestinationTranslation entity = destinationTranslationRepository
                .findByDestination_IdAndLocale(destination.getId(), lang)
                .orElseGet(() -> DestinationTranslation.builder()
                        .destination(destination)
                        .locale(lang)
                        .build());

        if (StringUtils.hasText(request.getName())) {
            entity.setName(request.getName().trim());
        }
        if (request.getShortDescription() != null) {
            entity.setShortDescription(StringUtils.hasText(request.getShortDescription())
                    ? request.getShortDescription().trim()
                    : null);
        }
        if (request.getDescription() != null) {
            entity.setDescription(StringUtils.hasText(request.getDescription())
                    ? request.getDescription().trim()
                    : null);
        }

        return toResponse(destinationTranslationRepository.save(entity));
    }

    private static String normalizeSupportedLocale(String localeTag) {
        if (!StringUtils.hasText(localeTag)) {
            throw BadRequestException.i18n("api.error.destination.localeRequired");
        }
        String lang = LocaleTagUtil.normalizeLanguageTag(Locale.forLanguageTag(localeTag.trim()));
        if (!"en".equals(lang) && !"vi".equals(lang)) {
            throw BadRequestException.i18n("api.error.destination.localeUnsupported", localeTag);
        }
        return lang;
    }

    private DestinationTranslationResponse toResponse(DestinationTranslation t) {
        return DestinationTranslationResponse.builder()
                .id(t.getId())
                .locale(t.getLocale())
                .name(t.getName())
                .shortDescription(t.getShortDescription())
                .description(t.getDescription())
                .build();
    }
}

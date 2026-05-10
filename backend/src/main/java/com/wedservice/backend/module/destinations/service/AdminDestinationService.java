package com.wedservice.backend.module.destinations.service;

import com.querydsl.core.BooleanBuilder;
import com.wedservice.backend.module.destinations.entity.QDestination;
import com.wedservice.backend.common.exception.BadRequestException;
import com.wedservice.backend.common.exception.ResourceNotFoundException;
import com.wedservice.backend.common.response.PageResponse;
import com.wedservice.backend.module.destinations.dto.request.DestinationRequest;
import com.wedservice.backend.module.destinations.dto.request.DestinationSearchRequest;
import com.wedservice.backend.module.destinations.dto.request.RejectProposalRequest;
import com.wedservice.backend.module.destinations.dto.response.DestinationDetailResponse;
import com.wedservice.backend.module.destinations.dto.response.DestinationResponse;
import com.wedservice.backend.module.destinations.entity.Destination;
import com.wedservice.backend.module.destinations.entity.DestinationStatus;
import com.wedservice.backend.module.destinations.mapper.DestinationMapper;
import com.wedservice.backend.module.destinations.dto.response.DestinationTranslationResponse;
import com.wedservice.backend.module.destinations.entity.DestinationTranslation;
import com.wedservice.backend.module.destinations.repository.DestinationRepository;
import com.wedservice.backend.module.destinations.repository.DestinationTranslationRepository;
import com.wedservice.backend.module.destinations.service.command.AdminDestinationCommandService;
import com.wedservice.backend.module.destinations.service.query.AdminDestinationQueryService;
import com.wedservice.backend.common.security.AuthenticatedUserProvider;
import com.wedservice.backend.common.util.DataNormalizer;
import com.wedservice.backend.common.util.SlugUtils;


import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.util.StringUtils;

import com.wedservice.backend.common.service.BaseService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminDestinationService extends BaseService<Destination, Long>
        implements AdminDestinationCommandService, AdminDestinationQueryService {

    private final DestinationRepository destinationRepository;
    private final DestinationTranslationRepository destinationTranslationRepository;
    private final DestinationMapper destinationMapper;

    @Override
    protected JpaRepository<Destination, Long> getRepository() {
        return destinationRepository;
    }

    @Override
    protected String getEntityName() {
        return "Destination";
    }
    private final AuthenticatedUserProvider authenticatedUserProvider;

    @Transactional(readOnly = true)
    public PageResponse<DestinationResponse> searchDestinations(DestinationSearchRequest request) {
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

        if (request.getIsActive() != null) {
            if (Boolean.TRUE.equals(request.getIsActive())) {
                builder.and(qDestination.deletedAt.isNull());
            } else {
                builder.and(qDestination.deletedAt.isNotNull());
            }
        }

        if (request.getStatus() != null) {
            builder.and(qDestination.status.eq(request.getStatus()));
        }

        if (request.getIsOfficial() != null) {
            builder.and(qDestination.isOfficial.eq(request.getIsOfficial()));
        }

        Page<Destination> page = destinationRepository.findAll(builder, pageable);

        return PageResponse.of(page.map(destinationMapper::toDto));
    }

    @Transactional(readOnly = true)
    public DestinationDetailResponse getDestinationByUuid(UUID uuid) {
        return toDetailWithTranslations(findDestinationByUuid(uuid));
    }

    @Transactional
    public DestinationDetailResponse createDestination(DestinationRequest request) {
        if (destinationRepository.existsByCodeIgnoreCase(request.getCode())) {
            throw BadRequestException.i18n("api.error.destination.codeExists", request.getCode());
        }
        if (destinationRepository.existsBySlugIgnoreCase(request.getSlug())) {
            throw BadRequestException.i18n("api.error.destination.slugExists", request.getSlug());
        }

        Destination destination = destinationMapper.toEntity(request);
        return toDetailWithTranslations(destinationRepository.save(destination));
    }

    @Transactional
    public DestinationDetailResponse updateDestination(UUID uuid, DestinationRequest request) {
        Destination destination = findDestinationByUuid(uuid);

        if (destination.getStatus() != DestinationStatus.APPROVED) {
            throw BadRequestException.i18n("api.error.destination.onlyApprovedUpdatable");
        }

        String normalizedCode = DataNormalizer.normalize(request.getCode());
        String normalizedSlug = StringUtils.hasText(request.getSlug()) 
                ? DataNormalizer.normalize(request.getSlug()) 
                : SlugUtils.toSlug(DataNormalizer.normalize(request.getName()));

        validateUniqueDestination(normalizedCode, normalizedSlug, destination.getId());

        destinationMapper.applyAdminUpdate(destination, request, normalizedCode, normalizedSlug);
        return toDetailWithTranslations(destinationRepository.save(destination));
    }

    private Destination findDestinationByUuid(UUID uuid) {
        return destinationRepository.findByUuid(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with uuid: " + uuid));
    }

    private void validateUniqueDestination(String code, String slug, Long currentId) {
        if (StringUtils.hasText(code) && destinationRepository.existsByCodeIgnoreCaseAndIdNot(code, currentId)) {
            throw BadRequestException.i18n("api.error.destination.codeExists", code);
        }
        if (StringUtils.hasText(slug) && destinationRepository.existsBySlugIgnoreCaseAndIdNot(slug, currentId)) {
            throw BadRequestException.i18n("api.error.destination.slugExists", slug);
        }
    }

    @Transactional
    public void deleteDestination(UUID uuid) {
        Destination destination = findDestinationByUuid(uuid);
        destination.setDeletedAt(java.time.LocalDateTime.now());
        destinationRepository.save(destination);
    }

    @Transactional
    public DestinationDetailResponse approveProposal(UUID uuid) {
        Destination destination = destinationRepository.findByUuid(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with uuid: " + uuid));

        if (destination.getStatus() != DestinationStatus.PENDING) {
            throw BadRequestException.i18n("api.error.destination.onlyPendingApprove");
        }

        destination.setStatus(DestinationStatus.APPROVED);
        destination.setIsOfficial(true);
        destination.setRejectionReason(null);
        destination.setVerifiedBy(authenticatedUserProvider.getRequiredCurrentUserId());
        return toDetailWithTranslations(destinationRepository.save(destination));
    }

    @Transactional
    public DestinationDetailResponse rejectProposal(UUID uuid, RejectProposalRequest request) {
        Destination destination = destinationRepository.findByUuid(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with uuid: " + uuid));

        if (destination.getStatus() != DestinationStatus.PENDING) {
            throw BadRequestException.i18n("api.error.destination.onlyPendingReject");
        }

        destination.setStatus(DestinationStatus.REJECTED);
        destination.setIsOfficial(false);
        destination.setRejectionReason(request.getReason());
        destination.setVerifiedBy(authenticatedUserProvider.getRequiredCurrentUserId());
        return toDetailWithTranslations(destinationRepository.save(destination));
    }

    private DestinationDetailResponse toDetailWithTranslations(Destination destination) {
        DestinationDetailResponse response = destinationMapper.toDetailResponse(destination);
        List<DestinationTranslationResponse> translations = destinationTranslationRepository
                .findByDestination_IdOrderByLocaleAsc(destination.getId())
                .stream()
                .map(this::toTranslationResponse)
                .toList();
        response.setTranslations(translations);
        return response;
    }

    private DestinationTranslationResponse toTranslationResponse(DestinationTranslation t) {
        return DestinationTranslationResponse.builder()
                .id(t.getId())
                .locale(t.getLocale())
                .name(t.getName())
                .shortDescription(t.getShortDescription())
                .description(t.getDescription())
                .build();
    }
}

package com.wedservice.backend.module.destinations.validator;

import com.wedservice.backend.common.exception.BadRequestException;
import com.wedservice.backend.module.destinations.dto.request.DestinationRequest;
import com.wedservice.backend.module.destinations.dto.request.ProposeDestinationRequest;
import com.wedservice.backend.module.destinations.entity.Destination;
import com.wedservice.backend.module.destinations.entity.DestinationStatus;
import com.wedservice.backend.module.destinations.repository.DestinationRepository;
import com.wedservice.backend.common.util.DataNormalizer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DestinationValidator {

    private final DestinationRepository destinationRepository;

    /**
     * {@code selfId} null khi tạo mới.
     */
    public void validateParentAssignment(Long selfId, Long parentId) {
        if (parentId == null) {
            return;
        }
        if (selfId != null && selfId.equals(parentId)) {
            throw BadRequestException.i18n("api.error.destination.parentSelf");
        }
        Destination parent = destinationRepository.findById(parentId)
                .orElseThrow(() -> BadRequestException.i18n("api.error.destination.parentNotFound"));
        if (parent.getDeletedAt() != null) {
            throw BadRequestException.i18n("api.error.destination.parentNotFound");
        }
        Long walk = parentId;
        int guard = 0;
        while (walk != null && guard++ < 256) {
            if (selfId != null && walk.equals(selfId)) {
                throw BadRequestException.i18n("api.error.destination.parentCycle");
            }
            Destination node = destinationRepository.findById(walk)
                    .orElseThrow(() -> BadRequestException.i18n("api.error.destination.parentNotFound"));
            walk = node.getParent() != null ? node.getParent().getId() : null;
        }
        if (selfId != null) {
            Destination self = destinationRepository.findById(selfId).orElse(null);
            if (self != null && StringUtils.hasText(self.getPath()) && StringUtils.hasText(parent.getPath())
                    && parent.getPath().startsWith(self.getPath())) {
                throw BadRequestException.i18n("api.error.destination.parentCycle");
            }
        }
    }

    public void validatePropose(DestinationRequest request) {
        if (request == null) return;
        if (request.getCode() != null && destinationRepository.existsByCodeIgnoreCase(request.getCode())) {
            throw BadRequestException.i18n("api.error.destination.codeExists", request.getCode());
        }
        if (request.getSlug() != null && destinationRepository.existsBySlugIgnoreCase(request.getSlug())) {
            throw BadRequestException.i18n("api.error.destination.slugExists", request.getSlug());
        }
    }

    public void validatePropose(ProposeDestinationRequest request) {
        if (request == null) {
            return;
        }

        String normalizedName = DataNormalizer.normalize(request.getName());
        String normalizedProvince = DataNormalizer.normalize(request.getProvince());

        if (!StringUtils.hasText(normalizedName) || !StringUtils.hasText(normalizedProvince)) {
            return;
        }

        boolean alreadySubmitted = destinationRepository.existsByNameIgnoreCaseAndProvinceIgnoreCaseAndStatusIn(
                normalizedName,
                normalizedProvince,
                List.of(DestinationStatus.PENDING, DestinationStatus.APPROVED)
        );

        if (alreadySubmitted) {
            throw BadRequestException.i18n("api.error.destination.proposeDuplicate");
        }
    }
}

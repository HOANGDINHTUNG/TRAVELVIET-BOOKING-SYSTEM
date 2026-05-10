package com.wedservice.backend.module.destinations.controller;

import com.wedservice.backend.common.i18n.Translator;
import com.wedservice.backend.common.response.ApiResponse;
import com.wedservice.backend.module.destinations.dto.request.UpsertDestinationTranslationRequest;
import com.wedservice.backend.module.destinations.dto.response.DestinationTranslationResponse;
import com.wedservice.backend.module.destinations.service.DestinationTranslationAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin/destinations/{destinationUuid}/translations")
@RequiredArgsConstructor
public class AdminDestinationTranslationController {

    private final DestinationTranslationAdminService destinationTranslationAdminService;

    @GetMapping
    @PreAuthorize("hasAuthority('destination.view')")
    public ApiResponse<List<DestinationTranslationResponse>> list(@PathVariable UUID destinationUuid) {
        return ApiResponse.success(destinationTranslationAdminService.listByDestinationUuid(destinationUuid));
    }

    @PutMapping("/{locale}")
    @PreAuthorize("hasAuthority('destination.update')")
    public ApiResponse<DestinationTranslationResponse> upsert(
            @PathVariable UUID destinationUuid,
            @PathVariable String locale,
            @Valid @RequestBody UpsertDestinationTranslationRequest request
    ) {
        return ApiResponse.success(
                destinationTranslationAdminService.upsert(destinationUuid, locale, request),
                Translator.toLocale("api.admin.translation.saved")
        );
    }
}

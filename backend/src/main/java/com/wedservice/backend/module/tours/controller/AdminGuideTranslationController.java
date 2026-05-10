package com.wedservice.backend.module.tours.controller;

import com.wedservice.backend.common.i18n.Translator;
import com.wedservice.backend.common.response.ApiResponse;
import com.wedservice.backend.module.tours.dto.request.UpsertGuideTranslationRequest;
import com.wedservice.backend.module.tours.dto.response.GuideTranslationResponse;
import com.wedservice.backend.module.tours.service.GuideTranslationAdminService;
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

@RestController
@RequestMapping("/admin/guides/{guideId}/translations")
@RequiredArgsConstructor
public class AdminGuideTranslationController {

    private final GuideTranslationAdminService guideTranslationAdminService;

    @GetMapping
    @PreAuthorize("hasAuthority('tour.update')")
    public ApiResponse<List<GuideTranslationResponse>> list(@PathVariable Long guideId) {
        return ApiResponse.success(guideTranslationAdminService.listByGuideId(guideId));
    }

    @PutMapping("/{locale}")
    @PreAuthorize("hasAuthority('tour.update')")
    public ApiResponse<GuideTranslationResponse> upsert(
            @PathVariable Long guideId,
            @PathVariable String locale,
            @Valid @RequestBody UpsertGuideTranslationRequest request
    ) {
        return ApiResponse.success(
                guideTranslationAdminService.upsert(guideId, locale, request),
                Translator.toLocale("api.admin.translation.saved")
        );
    }
}

package com.wedservice.backend.module.tours.controller;

import com.wedservice.backend.common.i18n.Translator;
import com.wedservice.backend.common.response.ApiResponse;
import com.wedservice.backend.module.tours.dto.request.UpsertTourTranslationRequest;
import com.wedservice.backend.module.tours.dto.response.TourTranslationResponse;
import com.wedservice.backend.module.tours.facade.TourFacade;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin/tours/{tourId}/translations")
@RequiredArgsConstructor
public class AdminTourTranslationController {

    private final TourFacade tourFacade;

    @GetMapping
    @PreAuthorize("hasAuthority('tour.update')")
    public ApiResponse<List<TourTranslationResponse>> list(@PathVariable Long tourId) {
        return ApiResponse.success(tourFacade.listTourTranslations(tourId));
    }

    @PutMapping("/{locale}")
    @PreAuthorize("hasAuthority('tour.update')")
    public ApiResponse<TourTranslationResponse> upsert(
            @PathVariable Long tourId,
            @PathVariable String locale,
            @Valid @RequestBody UpsertTourTranslationRequest request
    ) {
        return ApiResponse.success(
                tourFacade.upsertTourTranslation(tourId, locale, request),
                Translator.toLocale("api.admin.translation.saved")
        );
    }

    @DeleteMapping("/{locale}")
    @PreAuthorize("hasAuthority('tour.update')")
    public ApiResponse<Void> delete(@PathVariable Long tourId, @PathVariable String locale) {
        tourFacade.deleteTourTranslation(tourId, locale);
        return ApiResponse.success(null, Translator.toLocale("api.admin.translation.saved"));
    }
}

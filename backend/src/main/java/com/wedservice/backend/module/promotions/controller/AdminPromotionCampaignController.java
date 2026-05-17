package com.wedservice.backend.module.promotions.controller;

import com.wedservice.backend.common.response.ApiResponse;
import com.wedservice.backend.common.response.PageResponse;
import com.wedservice.backend.module.promotions.dto.request.PromotionCampaignRequest;
import com.wedservice.backend.module.promotions.dto.request.PromotionCampaignSearchRequest;
import com.wedservice.backend.module.promotions.dto.request.UpdatePromotionCampaignStatusRequest;
import com.wedservice.backend.module.promotions.dto.response.PromotionCampaignResponse;
import com.wedservice.backend.module.promotions.facade.AdminPromotionCampaignFacade;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/promotion-campaigns")
@RequiredArgsConstructor
public class AdminPromotionCampaignController {

    private final AdminPromotionCampaignFacade adminPromotionCampaignFacade;

    @GetMapping("/public")
    @PreAuthorize("permitAll()")
    public ApiResponse<PageResponse<PromotionCampaignResponse>> getPublicPromotionCampaigns() {
        PromotionCampaignSearchRequest request = new PromotionCampaignSearchRequest();
        request.setPage(0);
        request.setSize(12);
        request.setIsActive(true);
        request.setSortBy("sortOrder");
        request.setSortDir("asc");

        return ApiResponse.<PageResponse<PromotionCampaignResponse>>builder()
                .success(true)
                .message("Public promotion campaign list fetched successfully")
                .data(adminPromotionCampaignFacade.getPromotionCampaigns(request))
                .build();
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('promotion.campaign.view','voucher.view')")
    public ApiResponse<PageResponse<PromotionCampaignResponse>> getPromotionCampaigns(
            @Valid @ModelAttribute PromotionCampaignSearchRequest request
    ) {
        return ApiResponse.<PageResponse<PromotionCampaignResponse>>builder()
                .success(true)
                .message("Promotion campaign list fetched successfully")
                .data(adminPromotionCampaignFacade.getPromotionCampaigns(request))
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('promotion.campaign.view','voucher.view')")
    public ApiResponse<PromotionCampaignResponse> getPromotionCampaign(@PathVariable Long id) {
        return ApiResponse.<PromotionCampaignResponse>builder()
                .success(true)
                .message("Promotion campaign fetched successfully")
                .data(adminPromotionCampaignFacade.getPromotionCampaign(id))
                .build();
    }

    @PostMapping
    @PreAuthorize("hasAuthority('promotion.campaign.create')")
    public ApiResponse<PromotionCampaignResponse> createPromotionCampaign(@Valid @RequestBody PromotionCampaignRequest request) {
        return ApiResponse.<PromotionCampaignResponse>builder()
                .success(true)
                .message("Promotion campaign created successfully")
                .data(adminPromotionCampaignFacade.createPromotionCampaign(request))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('promotion.campaign.update')")
    public ApiResponse<PromotionCampaignResponse> updatePromotionCampaign(
            @PathVariable Long id,
            @Valid @RequestBody PromotionCampaignRequest request
    ) {
        return ApiResponse.<PromotionCampaignResponse>builder()
                .success(true)
                .message("Promotion campaign updated successfully")
                .data(adminPromotionCampaignFacade.updatePromotionCampaign(id, request))
                .build();
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('promotion.campaign.publish')")
    public ApiResponse<PromotionCampaignResponse> updatePromotionCampaignStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePromotionCampaignStatusRequest request
    ) {
        return ApiResponse.<PromotionCampaignResponse>builder()
                .success(true)
                .message("Promotion campaign status updated successfully")
                .data(adminPromotionCampaignFacade.updatePromotionCampaignStatus(id, request.getIsActive()))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('promotion.campaign.delete')")
    public ApiResponse<Void> deletePromotionCampaign(@PathVariable Long id) {
        adminPromotionCampaignFacade.deletePromotionCampaign(id);
        return ApiResponse.<Void>builder()
                .success(true)
                .message("Promotion campaign deleted successfully")
                .build();
    }
}

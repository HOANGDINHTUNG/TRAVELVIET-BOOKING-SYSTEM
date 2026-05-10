package com.wedservice.backend.module.dashboard.controller;

import com.wedservice.backend.common.response.ApiResponse;
import com.wedservice.backend.module.dashboard.dto.response.AdminDashboardStatisticsResponse;
import com.wedservice.backend.module.dashboard.service.AdminDashboardStatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final AdminDashboardStatisticsService adminDashboardStatisticsService;

    @GetMapping("/statistics")
    @PreAuthorize("hasAuthority('dashboard.view')")
    public ApiResponse<AdminDashboardStatisticsResponse> getStatistics() {
        AdminDashboardStatisticsResponse data = adminDashboardStatisticsService.getStatistics();
        return ApiResponse.success(data, "Dashboard statistics loaded");
    }
}

package com.wedservice.backend.module.commerce.facade;

import com.wedservice.backend.common.response.PageResponse;
import com.wedservice.backend.module.commerce.dto.request.ComboPackageSearchRequest;
import com.wedservice.backend.module.commerce.dto.response.ComboPackageResponse;
import com.wedservice.backend.module.commerce.service.AdminComboPackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ComboCatalogFacade {
    private final AdminComboPackageService adminComboPackageService;

    public PageResponse<ComboPackageResponse> searchPublicCombos(ComboPackageSearchRequest request) {
        request.setIsActive(true);
        return adminComboPackageService.getComboPackages(request);
    }

    public ComboPackageResponse getComboById(Long id) {
        return adminComboPackageService.getComboPackage(id);
    }
}


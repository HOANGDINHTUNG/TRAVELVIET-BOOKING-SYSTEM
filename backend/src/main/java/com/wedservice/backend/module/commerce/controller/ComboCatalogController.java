package com.wedservice.backend.module.commerce.controller;

import com.wedservice.backend.common.response.ApiResponse;
import com.wedservice.backend.common.response.PageResponse;
import com.wedservice.backend.module.commerce.dto.request.ComboPackageSearchRequest;
import com.wedservice.backend.module.commerce.dto.response.ComboPackageResponse;
import com.wedservice.backend.module.commerce.facade.ComboCatalogFacade;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/combos")
@RequiredArgsConstructor
public class ComboCatalogController {

    private final ComboCatalogFacade comboCatalogFacade;

    @GetMapping
    public ApiResponse<PageResponse<ComboPackageResponse>> search(@Valid @ModelAttribute ComboPackageSearchRequest request) {
        return ApiResponse.success(comboCatalogFacade.searchPublicCombos(request));
    }

    @GetMapping("/{id}")
    public ApiResponse<ComboPackageResponse> getById(@PathVariable Long id) {
        return ApiResponse.success(comboCatalogFacade.getComboById(id));
    }
}


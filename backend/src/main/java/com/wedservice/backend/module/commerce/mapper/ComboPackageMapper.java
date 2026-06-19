package com.wedservice.backend.module.commerce.mapper;

import com.wedservice.backend.module.commerce.dto.request.ComboPackageItemRequest;
import com.wedservice.backend.module.commerce.dto.request.ComboPackageRequest;
import com.wedservice.backend.module.commerce.dto.response.ComboPackageItemResponse;
import com.wedservice.backend.module.commerce.dto.response.ComboPackageResponse;
import com.wedservice.backend.module.commerce.entity.ComboPackage;
import com.wedservice.backend.module.commerce.entity.ComboPackageItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ComboPackageMapper {

    @Mapping(target = "finalPrice", expression = "java(entity.getBasePrice().subtract(entity.getDiscountAmount()).max(java.math.BigDecimal.ZERO))")
    ComboPackageResponse toResponse(ComboPackage entity);

    ComboPackageItemResponse toResponse(ComboPackageItem item);

    ComboPackage toEntity(ComboPackageRequest request);

    ComboPackageItem toEntity(ComboPackageItemRequest request);
}


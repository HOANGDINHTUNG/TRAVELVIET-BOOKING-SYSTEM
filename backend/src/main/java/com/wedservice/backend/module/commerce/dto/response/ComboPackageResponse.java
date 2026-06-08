package com.wedservice.backend.module.commerce.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ComboPackageResponse {
    private Long id;
    private String code;
    private String name;
    private String description;
    private Long destinationId;
    private String comboType;
    private BigDecimal basePrice;
    private String discountType;
    private BigDecimal discountValue;
    private BigDecimal discountAmount;
    private String pricingRuleJson;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private BigDecimal finalPrice;
    private Boolean isActive;
    private List<ComboPackageItemResponse> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

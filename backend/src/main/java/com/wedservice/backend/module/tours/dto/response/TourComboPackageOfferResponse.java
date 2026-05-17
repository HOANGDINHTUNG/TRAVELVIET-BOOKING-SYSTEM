package com.wedservice.backend.module.tours.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TourComboPackageOfferResponse {
    private Long comboId;
    private String code;
    private String name;
    private String description;
    private BigDecimal basePrice;
    private BigDecimal discountAmount;
    private BigDecimal finalPrice;
    private String packageRole;
    private Boolean isDefault;
    private Integer sortOrder;
}

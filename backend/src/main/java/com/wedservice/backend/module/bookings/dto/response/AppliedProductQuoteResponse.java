package com.wedservice.backend.module.bookings.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppliedProductQuoteResponse {

    private Long productId;
    private String sku;
    private String name;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal lineTotal;
}

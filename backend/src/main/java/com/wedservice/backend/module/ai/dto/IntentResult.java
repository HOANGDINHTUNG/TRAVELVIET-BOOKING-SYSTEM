package com.wedservice.backend.module.ai.dto;

import com.wedservice.backend.module.ai.enums.ChatIntent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IntentResult {
    @Builder.Default
    private ChatIntent intent = ChatIntent.UNKNOWN;
    private String keyword;
    private String location;
    private Long id;
    private String trackingCode;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String duration;
    @Builder.Default
    private Map<String, Object> filters = new HashMap<>();
}

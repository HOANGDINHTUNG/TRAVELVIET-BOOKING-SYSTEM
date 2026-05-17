package com.wedservice.backend.module.tours.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TourDepartureHubResponse {
    private String cityCode;
    private String cityNameVi;
    private String cityNameEn;
    private Boolean isPrimary;
    private Integer sortOrder;
}

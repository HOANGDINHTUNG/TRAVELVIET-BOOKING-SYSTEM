package com.wedservice.backend.module.tours.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TourInclusionFlagsResponse {
    private Boolean hasFlight;
    private Boolean hasHotel;
    private Boolean hasMeals;
    private Boolean hasTickets;
    private Boolean hasGuide;
    private Boolean hasInsurance;
    private Boolean hasTransport;
    private Integer hotelStars;
    private String flightType;
    private String notes;
}

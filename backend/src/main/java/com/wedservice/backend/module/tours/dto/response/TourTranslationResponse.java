package com.wedservice.backend.module.tours.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TourTranslationResponse {

    private Long id;
    private String locale;
    private String name;
    private String shortDescription;
    private String description;
    private String highlights;
    private String inclusions;
    private String exclusions;
    private String notes;
    private String itinerarySummary;
}

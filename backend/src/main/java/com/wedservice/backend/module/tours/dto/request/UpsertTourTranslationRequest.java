package com.wedservice.backend.module.tours.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/**
 * Admin upsert body for {@code tour_translations}. At least one textual field must be non-blank
 * (enforced in service).
 */
@Getter
@Setter
public class UpsertTourTranslationRequest {

    @Size(max = 255)
    private String name;

    private String shortDescription;

    private String description;

    private String highlights;

    private String inclusions;

    private String exclusions;

    private String notes;

    private String itinerarySummary;
}

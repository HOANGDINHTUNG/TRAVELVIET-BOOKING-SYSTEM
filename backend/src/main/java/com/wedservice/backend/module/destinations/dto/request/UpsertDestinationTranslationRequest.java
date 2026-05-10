package com.wedservice.backend.module.destinations.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpsertDestinationTranslationRequest {

    @Size(max = 200)
    private String name;

    private String shortDescription;
    private String description;
}

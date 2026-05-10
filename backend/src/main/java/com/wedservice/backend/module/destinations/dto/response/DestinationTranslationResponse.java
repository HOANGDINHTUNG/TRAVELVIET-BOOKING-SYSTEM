package com.wedservice.backend.module.destinations.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DestinationTranslationResponse {

    private Long id;
    private String locale;
    private String name;
    private String shortDescription;
    private String description;
}

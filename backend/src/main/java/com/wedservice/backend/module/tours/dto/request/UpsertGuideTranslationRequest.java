package com.wedservice.backend.module.tours.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpsertGuideTranslationRequest {

    @Size(max = 150)
    private String fullName;

    private String bio;
}

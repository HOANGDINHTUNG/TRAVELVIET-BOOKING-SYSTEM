package com.wedservice.backend.module.destinations.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DestinationBreadcrumbItem {
    private UUID uuid;
    private String name;
    private String slug;
    /** Slug thân thiện URL chương trình: {@code slug-pid-id}. */
    private String programSlug;
}

package com.wedservice.backend.module.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiRelatedItem {
    private String type;
    private String id;
    private String title;
    private String subtitle;
    private String description;
    private String imageUrl;
    private String detailUrl;
    private String meta;
}

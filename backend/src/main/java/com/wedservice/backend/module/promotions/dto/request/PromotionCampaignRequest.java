package com.wedservice.backend.module.promotions.dto.request;

import com.wedservice.backend.module.users.entity.MemberLevel;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tools.jackson.databind.JsonNode;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PromotionCampaignRequest {

    @NotBlank(message = "code is required")
    @Size(max = 40, message = "code must not exceed 40 characters")
    private String code;

    @NotBlank(message = "name is required")
    @Size(max = 200, message = "name must not exceed 200 characters")
    private String name;

    private String description;

    private String imageUrl;

    @Size(max = 180, message = "imageAlt must not exceed 180 characters")
    private String imageAlt;

    @Size(max = 160, message = "displayTitle must not exceed 160 characters")
    private String displayTitle;

    @Size(max = 255, message = "displaySubtitle must not exceed 255 characters")
    private String displaySubtitle;

    @Size(max = 80, message = "badgeText must not exceed 80 characters")
    private String badgeText;

    @Size(max = 80, message = "ctaLabel must not exceed 80 characters")
    private String ctaLabel;

    @Size(max = 255, message = "ctaUrl must not exceed 255 characters")
    private String ctaUrl;

    @Min(value = 0, message = "sortOrder must be >= 0")
    private Integer sortOrder;

    private Boolean isFeatured;

    @NotNull(message = "startAt is required")
    private LocalDateTime startAt;

    @NotNull(message = "endAt is required")
    private LocalDateTime endAt;

    private MemberLevel targetMemberLevel;

    private JsonNode conditionsJson;

    private JsonNode rewardJson;

    private Boolean isActive;
}

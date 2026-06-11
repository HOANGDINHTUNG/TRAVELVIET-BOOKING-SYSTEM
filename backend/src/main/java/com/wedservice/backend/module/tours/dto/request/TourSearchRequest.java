package com.wedservice.backend.module.tours.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TourSearchRequest {
    private List<Long> destinationIds;

    /**
     * Khi {@code destinationIds} được set: {@code true} (mặc định) — gồm tour của mọi điểm đến con theo {@code destination_path}.
     */
    @Builder.Default
    private Boolean destinationSubtree = Boolean.TRUE;

    /**
     * ISO 3166-1 alpha-2 country code of the tour's primary destination (e.g. VN, KR).
     */
    @Size(min = 2, max = 2, message = "destinationCountryCode must be a 2-letter ISO code")
    @Pattern(
            regexp = "[A-Za-z]{2}",
            message = "destinationCountryCode must be a 2-letter ISO code"
    )
    private String destinationCountryCode;

    /** When true, only tours whose destination {@code country_code} is {@code VN}. */
    private Boolean domesticOnly;

    /** When true, only tours whose destination {@code country_code} is not {@code VN}. */
    private Boolean internationalOnly;

    @Size(max = 100, message = "keyword must not exceed 100 characters")
    private String keyword;

    private List<Long> tagIds;

    /** Tag {@code code} values (e.g. BIEN); resolved to tag ids with active tags only. */
    private List<String> tagCodes;

    @DecimalMin(value = "0.0", inclusive = true, message = "minPrice must be greater than or equal to 0")
    private BigDecimal minPrice;

    @DecimalMin(value = "0.0", inclusive = true, message = "maxPrice must be greater than or equal to 0")
    private BigDecimal maxPrice;

    @Min(value = 1, message = "travelMonth must be between 1 and 12")
    @Max(value = 12, message = "travelMonth must be between 1 and 12")
    private Integer travelMonth;

    private Boolean featuredOnly;

    /** When true, only tours with {@code esg_score >= 80}. */
    private Boolean esgOnly;

    @Min(value = 0, message = "esgMin must be between 0 and 100")
    @Max(value = 100, message = "esgMin must be between 0 and 100")
    private Integer esgMin;

    private Boolean studentFriendlyOnly;

    private Boolean familyFriendlyOnly;

    private Boolean seniorFriendlyOnly;

    @Min(value = 1, message = "difficultyLevel must be between 1 and 5")
    @Max(value = 5, message = "difficultyLevel must be between 1 and 5")
    private Integer difficultyLevel;

    @Min(value = 1, message = "activityLevel must be between 1 and 5")
    @Max(value = 5, message = "activityLevel must be between 1 and 5")
    private Integer activityLevel;

    @Min(value = 1, message = "minDurationDays must be greater than or equal to 1")
    private Integer minDurationDays;

    @Min(value = 1, message = "maxDurationDays must be greater than or equal to 1")
    private Integer maxDurationDays;

    @Min(value = 0, message = "travellerAge must be greater than or equal to 0")
    private Integer travellerAge;

    @Min(value = 1, message = "groupSize must be greater than or equal to 1")
    private Integer groupSize;

    @Size(max = 120, message = "transportType must not exceed 120 characters")
    private String transportType;

    @Pattern(
            regexp = "group|private|shared",
            flags = Pattern.Flag.CASE_INSENSITIVE,
            message = "tripMode must be one of group, private, shared"
    )
    private String tripMode;

    @Pattern(
            regexp = "draft|active|inactive|archived",
            flags = Pattern.Flag.CASE_INSENSITIVE,
            message = "status must be one of draft, active, inactive, archived"
    )
    private String status;

    @DecimalMin(value = "0.0", inclusive = true, message = "minRating must be greater than or equal to 0")
    @jakarta.validation.constraints.DecimalMax(value = "5.0", inclusive = true, message = "minRating must be less than or equal to 5")
    private BigDecimal minRating;

    @Pattern(
            regexp = "name|basePrice|durationDays|averageRating|totalBookings|isFeatured|createdAt",
            message = "sortBy is invalid"
    )
    @Builder.Default
    private String sortBy = "createdAt";

    @Pattern(
            regexp = "asc|desc",
            flags = Pattern.Flag.CASE_INSENSITIVE,
            message = "sortDir must be asc or desc"
    )
    @Builder.Default
    private String sortDir = "desc";

    @Min(value = 0, message = "page must be greater than or equal to 0")
    @Builder.Default
    private Integer page = 0;

    @Min(value = 1, message = "size must be greater than or equal to 1")
    @Max(value = 100, message = "size must be less than or equal to 100")
    @Builder.Default
    private Integer size = 10;
}

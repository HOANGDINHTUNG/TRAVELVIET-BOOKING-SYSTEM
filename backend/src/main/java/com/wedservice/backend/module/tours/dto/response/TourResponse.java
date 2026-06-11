package com.wedservice.backend.module.tours.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TourResponse {
    private Long id;
    private String code;
    private String name;
    private String slug;
    private List<TourDestinationSummaryResponse> destinations;
    private Long cancellationPolicyId;
    private BigDecimal basePrice;
    private Integer esgScore;
    private Integer leiScore;
    private BigDecimal listPrice;
    private String currency;
    private Integer durationDays;
    private Integer durationNights;
    private String shortDescription;
    private String description;
    private String transportType;
    private String tripMode;
    private String highlights;
    private String inclusions;
    private String exclusions;
    private String notes;
    private Boolean isFeatured;
    private String status;
    private BigDecimal averageRating;
    private Integer totalReviews;
    private Integer totalBookings;
    private List<TagResponse> tags;
    private List<TourMediaResponse> media;
    private List<TourSeasonalityResponse> seasonality;
    private List<TourItineraryDayResponse> itineraryDays;
    private List<TourChecklistItemResponse> checklistItems;
    private CancellationPolicyResponse cancellationPolicy;
    private String translationKey;
    /** Localized itinerary narrative from tour_translations (public merge); structured days stay in itineraryDays. */
    private String itinerarySummary;

    /** Nearest open schedule with seats — for list cards / flash sale. */
    private TourNextScheduleSummaryResponse nextOpenSchedule;

    /** Primary departure city (vi) from tour_departure_hubs. */
    private String primaryDepartureCity;

    private TourInclusionFlagsResponse inclusionFlags;

    /** Departure cities for this tour (detail API). */
    private List<TourDepartureHubResponse> departureHubs;

    /** Linked combo add-ons (detail API). */
    private List<TourComboPackageOfferResponse> comboPackages;
}

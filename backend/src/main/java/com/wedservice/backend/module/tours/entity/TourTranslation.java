package com.wedservice.backend.module.tours.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
        name = "tour_translations",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_tour_translations_tour_locale",
                columnNames = {"tour_id", "locale"}
        )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TourTranslation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tour_id", nullable = false)
    private Tour tour;

    @Column(name = "locale", nullable = false, length = 10)
    private String locale;

    @Column(name = "name", length = 255)
    private String name;

    @Column(name = "short_description", columnDefinition = "TEXT")
    private String shortDescription;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "highlights", columnDefinition = "TEXT")
    private String highlights;

    @Column(name = "inclusions", columnDefinition = "TEXT")
    private String inclusions;

    @Column(name = "exclusions", columnDefinition = "TEXT")
    private String exclusions;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    /** Optional localized narrative for the itinerary section (structured days stay on relational tables). */
    @Column(name = "itinerary_summary", columnDefinition = "TEXT")
    private String itinerarySummary;
}

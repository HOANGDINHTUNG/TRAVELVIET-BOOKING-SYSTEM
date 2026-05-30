package com.wedservice.backend.module.reviews.entity;

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
        name = "customer_testimonial_translations",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_customer_testimonial_translations_testimonial_locale",
                columnNames = {"testimonial_id", "locale"}
        )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerTestimonialTranslation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "testimonial_id", nullable = false)
    private CustomerTestimonial testimonial;

    @Column(name = "locale", nullable = false, length = 10)
    private String locale;

    @Column(name = "customer_name", length = 120)
    private String customerName;

    @Column(name = "customer_title", length = 180)
    private String customerTitle;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;
}

package com.wedservice.backend.module.hotels.entity;

import com.wedservice.backend.common.entity.AuditableEntity;
import com.wedservice.backend.module.destinations.entity.Destination;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "hotels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hotel extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "supplier_id")
    private Long supplierId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_id")
    private Destination destination;

    @Column(name = "code", length = 40, unique = true)
    private String code;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "slug", length = 220, unique = true)
    private String slug;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "star_rating", precision = 2, scale = 1)
    private BigDecimal starRating;

    @Column(name = "review_score", precision = 3, scale = 2)
    private BigDecimal reviewScore;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "email", length = 150)
    private String email;

    @Column(name = "province", length = 120)
    private String province;

    @Column(name = "district", length = 120)
    private String district;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "latitude", precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(name = "longitude", precision = 10, scale = 7)
    private BigDecimal longitude;

    @Column(name = "checkin_time")
    private java.time.LocalTime checkinTime;

    @Column(name = "checkout_time")
    private java.time.LocalTime checkoutTime;

    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private String status = "active";
}


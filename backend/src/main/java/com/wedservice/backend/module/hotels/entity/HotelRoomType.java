package com.wedservice.backend.module.hotels.entity;

import com.wedservice.backend.common.entity.AuditableEntity;
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
@Table(name = "hotel_room_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HotelRoomType extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id", nullable = false)
    private Hotel hotel;

    @Column(name = "code", nullable = false, length = 40)
    private String code;

    @Column(name = "name", nullable = false, length = 180)
    private String name;

    @Column(name = "bed_type", length = 80)
    private String bedType;

    @Column(name = "max_adults", nullable = false)
    @Builder.Default
    private Integer maxAdults = 2;

    @Column(name = "max_children", nullable = false)
    @Builder.Default
    private Integer maxChildren = 0;

    @Column(name = "max_occupancy", nullable = false)
    @Builder.Default
    private Integer maxOccupancy = 2;

    @Column(name = "base_price", precision = 14, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal basePrice = BigDecimal.ZERO;

    @Column(name = "extra_bed_fee", precision = 14, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal extraBedFee = BigDecimal.ZERO;

    @Column(name = "child_surcharge_rules", columnDefinition = "JSON")
    private String childSurchargeRules;

    @Column(name = "currency", nullable = false, length = 3)
    @Builder.Default
    private String currency = "VND";

    @Column(name = "inventory_total", nullable = false)
    @Builder.Default
    private Integer inventoryTotal = 0;

    @Column(name = "is_refundable", nullable = false)
    @Builder.Default
    private Boolean isRefundable = true;

    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private String status = "active";
}


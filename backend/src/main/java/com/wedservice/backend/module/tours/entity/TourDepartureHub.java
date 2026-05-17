package com.wedservice.backend.module.tours.entity;

import com.wedservice.backend.common.entity.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tour_departure_hubs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TourDepartureHub extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tour_id", nullable = false)
    private Long tourId;

    @Column(name = "city_code", nullable = false, length = 10)
    private String cityCode;

    @Column(name = "city_name_vi", nullable = false, length = 120)
    private String cityNameVi;

    @Column(name = "city_name_en", length = 120)
    private String cityNameEn;

    @Column(name = "is_primary", nullable = false)
    @Builder.Default
    private Boolean isPrimary = false;

    @Column(name = "sort_order", nullable = false)
    @Builder.Default
    private Integer sortOrder = 0;
}

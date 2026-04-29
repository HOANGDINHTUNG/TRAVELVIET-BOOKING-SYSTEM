package com.wedservice.backend.module.destinations.entity;

import com.wedservice.backend.common.entity.AuditableEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import com.wedservice.backend.module.destinations.entity.converter.MediaTypeConverter;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "destination_media")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DestinationMedia extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_id", nullable = false)
    private Destination destination;

    @Convert(converter = MediaTypeConverter.class)
    @Column(name = "media_type", nullable = false)
    @Builder.Default
    private MediaType mediaType = MediaType.IMAGE;

    @Column(name = "media_url", columnDefinition = "TEXT", nullable = false)
    private String mediaUrl;

    @Column(name = "alt_text", length = 255)
    private String altText;

    @Column(name = "sort_order", nullable = false)
    @Builder.Default
    private Integer sortOrder = 0;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}

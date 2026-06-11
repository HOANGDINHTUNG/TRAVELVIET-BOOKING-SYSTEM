package com.wedservice.backend.module.destinations.repository;

import com.wedservice.backend.module.destinations.entity.Destination;
import com.wedservice.backend.module.destinations.entity.DestinationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DestinationRepository extends JpaRepository<Destination, Long>, QuerydslPredicateExecutor<Destination> {

    Optional<Destination> findByUuid(UUID uuid);

    boolean existsByCodeIgnoreCase(String code);

    boolean existsByCodeIgnoreCaseAndIdNot(String code, Long id);

    boolean existsBySlugIgnoreCase(String slug);

    boolean existsBySlugIgnoreCaseAndIdNot(String slug, Long id);

    boolean existsByNameIgnoreCaseAndProvinceIgnoreCaseAndStatusIn(
            String name,
            String province,
            Collection<DestinationStatus> statuses
    );

    java.util.List<Destination> findByParentIsNullAndDeletedAtIsNullAndIsActiveTrueAndStatusOrderByNameAsc(
            DestinationStatus status);

    java.util.List<Destination> findByParent_IdAndDeletedAtIsNullAndIsActiveTrueAndStatusOrderByNameAsc(
            Long parentId,
            DestinationStatus status);

    java.util.List<Destination> findByParent_IdAndDeletedAtIsNullOrderByNameAsc(Long parentId);

    @org.springframework.data.jpa.repository.Query("SELECT m FROM DestinationMedia m WHERE m.destination.id IN :destinationIds AND m.isActive = true ORDER BY m.sortOrder ASC")
    java.util.List<com.wedservice.backend.module.destinations.entity.DestinationMedia> findActiveMediaByDestinationIds(
            @org.springframework.data.repository.query.Param("destinationIds") Collection<Long> destinationIds);

    @org.springframework.data.jpa.repository.Query("SELECT MIN(d.uuid) FROM Destination d WHERE d.id = :id")
    Optional<UUID> findUuidById(@org.springframework.data.repository.query.Param("id") Long id);
}

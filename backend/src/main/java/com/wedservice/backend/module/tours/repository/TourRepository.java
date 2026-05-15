package com.wedservice.backend.module.tours.repository;

import com.wedservice.backend.module.tours.entity.Tour;
import com.querydsl.core.types.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TourRepository extends JpaRepository<Tour, Long>, QuerydslPredicateExecutor<Tour> {

    @EntityGraph(attributePaths = "destination")
    @Override
    Page<Tour> findAll(Predicate predicate, Pageable pageable);

    boolean existsByCode(String code);

    boolean existsBySlug(String slug);

    long countByDestinationIdAndStatusAndDeletedAtIsNull(Long destinationId, com.wedservice.backend.module.tours.entity.TourStatus status);

    @Query("""
            SELECT COUNT(t) FROM Tour t
            JOIN t.destination d
            WHERE t.deletedAt IS NULL
              AND t.status = :status
              AND (d.id = :rootId OR d.path = :pathPrefix OR d.path LIKE CONCAT(:pathPrefix, '%'))
            """)
    long countActiveToursInDestinationSubtree(
            @Param("rootId") Long rootId,
            @Param("pathPrefix") String pathPrefix,
            @Param("status") com.wedservice.backend.module.tours.entity.TourStatus status
    );
}

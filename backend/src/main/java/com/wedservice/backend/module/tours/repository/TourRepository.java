package com.wedservice.backend.module.tours.repository;

import com.wedservice.backend.module.tours.entity.Tour;
import com.querydsl.core.types.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

public interface TourRepository extends JpaRepository<Tour, Long>, QuerydslPredicateExecutor<Tour> {

    @EntityGraph(attributePaths = "destination")
    @Override
    Page<Tour> findAll(Predicate predicate, Pageable pageable);

    boolean existsByCode(String code);

    boolean existsBySlug(String slug);

    long countByDestinationIdAndStatusAndDeletedAtIsNull(Long destinationId, com.wedservice.backend.module.tours.entity.TourStatus status);
}

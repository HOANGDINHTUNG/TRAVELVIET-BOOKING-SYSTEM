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

import java.util.Collection;
import java.util.List;

public interface TourRepository extends JpaRepository<Tour, Long>, QuerydslPredicateExecutor<Tour> {

    @Override
    Page<Tour> findAll(Predicate predicate, Pageable pageable);

    @Query("SELECT t.id, d FROM Tour t JOIN t.destinations d WHERE t.id IN :tourIds")
    List<Object[]> findDestinationsByTourIds(@Param("tourIds") Collection<Long> tourIds);

    boolean existsByCode(String code);

    boolean existsBySlug(String slug);

    long countByDestinationsIdAndStatusAndDeletedAtIsNull(Long destinationId, com.wedservice.backend.module.tours.entity.TourStatus status);

    @Query("""
            SELECT COUNT(t) FROM Tour t
            JOIN t.destinations d
            WHERE t.deletedAt IS NULL
              AND t.status = :status
              AND (d.id = :rootId OR d.path = :pathPrefix OR d.path LIKE CONCAT(:pathPrefix, '%'))
            """)
    long countActiveToursInDestinationSubtree(
            @Param("rootId") Long rootId,
            @Param("pathPrefix") String pathPrefix,
            @Param("status") com.wedservice.backend.module.tours.entity.TourStatus status
    );

    /**
     * Batch variant of subtree active-tour counts (one round-trip for many destination roots).
     */
    @Query(value = """
            SELECT d_root.id AS root_id, COUNT(t.id) AS cnt
            FROM destinations d_root
            INNER JOIN destinations d
                ON d.deleted_at IS NULL
               AND (
                    d.id = d_root.id
                    OR d.destination_path = d_root.destination_path
                    OR d.destination_path LIKE CONCAT(d_root.destination_path, '%')
               )
            INNER JOIN tour_destinations td ON td.destination_id = d.id
            INNER JOIN tours t
                ON t.id = td.tour_id
               AND t.deleted_at IS NULL
               AND t.status = :status
            WHERE d_root.id IN (:rootIds)
            GROUP BY d_root.id
            """, nativeQuery = true)
    List<Object[]> countActiveToursByDestinationRootIds(
            @Param("rootIds") Collection<Long> rootIds,
            @Param("status") String status
    );
}

package com.wedservice.backend.module.tours.repository;

import com.wedservice.backend.module.tours.entity.TourComboPackageLink;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TourComboPackageLinkRepository extends JpaRepository<TourComboPackageLink, Long> {

    List<TourComboPackageLink> findByTourIdOrderBySortOrderAsc(Long tourId);

    @Query("""
            SELECT link, combo FROM TourComboPackageLink link
            INNER JOIN ComboPackage combo ON combo.id = link.comboId
            WHERE link.tourId = :tourId
              AND combo.isActive = true
            ORDER BY link.sortOrder ASC
            """)
    List<Object[]> findActiveComboLinksWithPackageByTourId(@Param("tourId") Long tourId);
}

package com.wedservice.backend.module.tours.repository;

import com.wedservice.backend.module.tours.entity.TourComboPackageLink;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TourComboPackageLinkRepository extends JpaRepository<TourComboPackageLink, Long> {

    List<TourComboPackageLink> findByTourIdOrderBySortOrderAsc(Long tourId);
}

package com.wedservice.backend.module.tours.repository;

import com.wedservice.backend.module.tours.entity.TourDepartureHub;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface TourDepartureHubRepository extends JpaRepository<TourDepartureHub, Long> {

    List<TourDepartureHub> findByTourIdInAndDeletedAtIsNullOrderByTourIdAscSortOrderAsc(
            Collection<Long> tourIds);

    List<TourDepartureHub> findByTourIdAndDeletedAtIsNullOrderBySortOrderAsc(Long tourId);
}

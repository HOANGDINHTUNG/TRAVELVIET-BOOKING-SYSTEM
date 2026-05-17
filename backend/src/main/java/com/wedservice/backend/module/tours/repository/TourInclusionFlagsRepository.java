package com.wedservice.backend.module.tours.repository;

import com.wedservice.backend.module.tours.entity.TourInclusionFlags;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface TourInclusionFlagsRepository extends JpaRepository<TourInclusionFlags, Long> {

    List<TourInclusionFlags> findByTourIdIn(Collection<Long> tourIds);
}

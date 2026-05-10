package com.wedservice.backend.module.tours.repository;

import com.wedservice.backend.module.tours.entity.TourTranslation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface TourTranslationRepository extends JpaRepository<TourTranslation, Long> {

    List<TourTranslation> findByTour_IdInAndLocale(Collection<Long> tourIds, String locale);

    List<TourTranslation> findByTour_IdOrderByLocaleAsc(Long tourId);

    Optional<TourTranslation> findByTour_IdAndLocale(Long tourId, String locale);
}

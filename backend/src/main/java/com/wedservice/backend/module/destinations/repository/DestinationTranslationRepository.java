package com.wedservice.backend.module.destinations.repository;

import com.wedservice.backend.module.destinations.entity.DestinationTranslation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface DestinationTranslationRepository extends JpaRepository<DestinationTranslation, Long> {

    List<DestinationTranslation> findByDestination_IdInAndLocale(Collection<Long> destinationIds, String locale);

    List<DestinationTranslation> findByDestination_IdOrderByLocaleAsc(Long destinationId);

    Optional<DestinationTranslation> findByDestination_IdAndLocale(Long destinationId, String locale);
}

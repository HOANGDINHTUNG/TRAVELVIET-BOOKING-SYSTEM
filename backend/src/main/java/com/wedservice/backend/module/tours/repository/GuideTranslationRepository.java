package com.wedservice.backend.module.tours.repository;

import com.wedservice.backend.module.tours.entity.GuideTranslation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface GuideTranslationRepository extends JpaRepository<GuideTranslation, Long> {

    List<GuideTranslation> findByGuide_IdInAndLocale(Collection<Long> guideIds, String locale);

    List<GuideTranslation> findByGuide_IdOrderByLocaleAsc(Long guideId);

    Optional<GuideTranslation> findByGuide_IdAndLocale(Long guideId, String locale);
}

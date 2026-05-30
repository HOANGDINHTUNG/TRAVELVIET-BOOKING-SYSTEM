package com.wedservice.backend.module.reviews.repository;

import com.wedservice.backend.module.reviews.entity.CustomerTestimonialTranslation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface CustomerTestimonialTranslationRepository extends JpaRepository<CustomerTestimonialTranslation, Long> {
    List<CustomerTestimonialTranslation> findByTestimonialIdInAndLocale(Collection<Long> testimonialIds, String locale);
}

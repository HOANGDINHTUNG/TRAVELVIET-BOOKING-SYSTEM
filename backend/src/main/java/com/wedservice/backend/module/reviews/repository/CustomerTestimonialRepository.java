package com.wedservice.backend.module.reviews.repository;

import com.wedservice.backend.module.reviews.entity.CustomerTestimonial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerTestimonialRepository extends JpaRepository<CustomerTestimonial, Long> {
    List<CustomerTestimonial> findTop8ByIsActiveTrueOrderBySortOrderAscCreatedAtDesc();
}

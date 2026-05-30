package com.wedservice.backend.module.bookings.repository;

import com.wedservice.backend.module.bookings.entity.ComboBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

public interface ComboBookingRepository extends JpaRepository<ComboBooking, Long>, QuerydslPredicateExecutor<ComboBooking> {
}


package com.wedservice.backend.module.bookings.repository;

import com.wedservice.backend.module.bookings.entity.HotelBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

public interface HotelBookingRepository extends JpaRepository<HotelBooking, Long>, QuerydslPredicateExecutor<HotelBooking> {
}


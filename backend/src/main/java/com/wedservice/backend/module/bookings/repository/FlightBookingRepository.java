package com.wedservice.backend.module.bookings.repository;

import com.wedservice.backend.module.bookings.entity.FlightBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

public interface FlightBookingRepository extends JpaRepository<FlightBooking, Long>, QuerydslPredicateExecutor<FlightBooking> {
}


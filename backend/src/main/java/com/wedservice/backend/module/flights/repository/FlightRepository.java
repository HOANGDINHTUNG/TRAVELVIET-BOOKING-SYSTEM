package com.wedservice.backend.module.flights.repository;

import com.wedservice.backend.module.flights.entity.Flight;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import java.util.Optional;

public interface FlightRepository extends JpaRepository<Flight, Long>, QuerydslPredicateExecutor<Flight> {
    @EntityGraph(attributePaths = {"airline", "originAirport", "destinationAirport"})
    Optional<Flight> findWithGraphById(Long id);
}


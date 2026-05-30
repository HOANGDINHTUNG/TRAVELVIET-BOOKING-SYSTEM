package com.wedservice.backend.module.flights.repository;

import com.wedservice.backend.module.flights.entity.Airport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import java.util.Optional;

public interface AirportRepository extends JpaRepository<Airport, Long>, QuerydslPredicateExecutor<Airport> {
    Optional<Airport> findByCodeIataIgnoreCase(String codeIata);
}


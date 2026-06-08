package com.wedservice.backend.module.flights.repository;

import com.wedservice.backend.module.flights.entity.Airline;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AirlineRepository extends JpaRepository<Airline, Long> {
    Optional<Airline> findByCodeIataIgnoreCase(String codeIata);
}


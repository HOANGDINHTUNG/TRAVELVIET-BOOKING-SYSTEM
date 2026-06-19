package com.wedservice.backend.module.flights.repository;

import com.wedservice.backend.module.flights.entity.FlightClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FlightClassRepository extends JpaRepository<FlightClass, Long> {
    List<FlightClass> findByFlightId(Long flightId);
    List<FlightClass> findByFlightIdIn(List<Long> flightIds);

    @Modifying
    @Query("UPDATE FlightClass f SET f.seatAvailable = f.seatAvailable - :seats WHERE f.id = :flightClassId AND f.seatAvailable >= :seats")
    int decrementSeatAvailable(@Param("flightClassId") Long flightClassId, @Param("seats") int seats);
}


package com.wedservice.backend.module.hotels.repository;

import com.wedservice.backend.module.hotels.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

public interface HotelRepository extends JpaRepository<Hotel, Long>, QuerydslPredicateExecutor<Hotel> {
    boolean existsByCodeIgnoreCase(String code);
    boolean existsBySlugIgnoreCase(String slug);

    @org.springframework.data.jpa.repository.Query(
        value = "SELECT ha.name FROM hotel_amenities ha JOIN hotel_amenity_mappings ham ON ha.id = ham.amenity_id WHERE ham.hotel_id = :hotelId AND ha.is_active = true",
        nativeQuery = true
    )
    java.util.List<String> findAmenityNamesByHotelId(@org.springframework.data.repository.query.Param("hotelId") Long hotelId);
}


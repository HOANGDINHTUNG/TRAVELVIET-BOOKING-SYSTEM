package com.wedservice.backend.module.hotels.repository;

import com.wedservice.backend.module.hotels.entity.HotelRoomInventory;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface HotelRoomInventoryRepository extends JpaRepository<HotelRoomInventory, Long> {
    Optional<HotelRoomInventory> findByRoomTypeIdAndStayDate(Long roomTypeId, LocalDate stayDate);
    List<HotelRoomInventory> findByRoomTypeIdAndStayDateBetween(Long roomTypeId, LocalDate from, LocalDate to);

    @Modifying
    @Query("UPDATE HotelRoomInventory h SET h.availableQty = h.availableQty - :rooms WHERE h.roomType.id = :roomTypeId AND h.stayDate = :stayDate AND h.availableQty >= :rooms")
    int decrementInventory(@Param("roomTypeId") Long roomTypeId, @Param("stayDate") LocalDate stayDate, @Param("rooms") int rooms);
}


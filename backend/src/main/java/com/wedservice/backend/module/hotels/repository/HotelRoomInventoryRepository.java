package com.wedservice.backend.module.hotels.repository;

import com.wedservice.backend.module.hotels.entity.HotelRoomInventory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface HotelRoomInventoryRepository extends JpaRepository<HotelRoomInventory, Long> {
    Optional<HotelRoomInventory> findByRoomTypeIdAndStayDate(Long roomTypeId, LocalDate stayDate);
    List<HotelRoomInventory> findByRoomTypeIdAndStayDateBetween(Long roomTypeId, LocalDate from, LocalDate to);
}


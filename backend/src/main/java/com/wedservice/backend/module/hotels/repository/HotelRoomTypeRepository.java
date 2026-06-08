package com.wedservice.backend.module.hotels.repository;

import com.wedservice.backend.module.hotels.entity.HotelRoomType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HotelRoomTypeRepository extends JpaRepository<HotelRoomType, Long> {
    List<HotelRoomType> findByHotelIdAndDeletedAtIsNull(Long hotelId);
}


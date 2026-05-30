package com.wedservice.backend.module.hotels.repository;

import com.wedservice.backend.module.hotels.entity.HotelImage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HotelImageRepository extends JpaRepository<HotelImage, Long> {
    List<HotelImage> findByHotelIdAndIsActiveTrueOrderBySortOrderAsc(Long hotelId);
}

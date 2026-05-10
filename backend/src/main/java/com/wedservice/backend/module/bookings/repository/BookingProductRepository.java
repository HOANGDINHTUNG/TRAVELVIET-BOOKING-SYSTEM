package com.wedservice.backend.module.bookings.repository;

import com.wedservice.backend.module.bookings.entity.BookingProduct;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingProductRepository extends JpaRepository<BookingProduct, Long> {
}

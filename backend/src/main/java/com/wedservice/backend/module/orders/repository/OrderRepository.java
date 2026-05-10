package com.wedservice.backend.module.orders.repository;

import com.wedservice.backend.module.orders.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}

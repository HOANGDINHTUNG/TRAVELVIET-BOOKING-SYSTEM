package com.wedservice.backend.module.orders.repository;

import com.wedservice.backend.module.orders.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}

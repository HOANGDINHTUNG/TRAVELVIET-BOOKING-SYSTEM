package com.wedservice.backend.module.commerce.repository;

import com.wedservice.backend.module.commerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    Optional<Product> findBySkuIgnoreCase(String sku);

    boolean existsBySkuIgnoreCaseAndIdNot(String sku, Long id);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update Product p set p.stockQty = p.stockQty - :qty where p.id = :id and p.stockQty >= :qty")
    int decrementStockIfEnough(@Param("id") Long id, @Param("qty") int qty);
}

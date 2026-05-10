package com.wedservice.backend.module.payments.repository;

import com.wedservice.backend.module.payments.entity.Payment;
import com.wedservice.backend.module.payments.entity.PaymentStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    boolean existsByBookingIdAndStatus(Long bookingId, PaymentStatus status);

    Optional<Payment> findByTransactionRef(String transactionRef);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Payment p where p.transactionRef = :ref")
    Optional<Payment> findByTransactionRefForUpdate(@Param("ref") String ref);
}

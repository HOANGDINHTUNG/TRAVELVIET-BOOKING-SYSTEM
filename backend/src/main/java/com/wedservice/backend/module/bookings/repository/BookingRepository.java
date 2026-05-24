package com.wedservice.backend.module.bookings.repository;

import com.wedservice.backend.module.bookings.entity.Booking;
import com.wedservice.backend.module.bookings.entity.BookingStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, Long>, JpaSpecificationExecutor<Booking> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select b from Booking b where b.id = :id")
    Optional<Booking> findByIdForUpdate(@Param("id") Long id);

    List<Booking> findByUserIdOrderByCreatedAtDesc(UUID userId);

    @Query("""
            SELECT b FROM Booking b
            WHERE b.deletedAt IS NULL
              AND b.userId = :userId
              AND (
                    :cursorCreatedAt IS NULL
                    OR b.createdAt < :cursorCreatedAt
                    OR (b.createdAt = :cursorCreatedAt AND b.id < :cursorId)
              )
            ORDER BY b.createdAt DESC, b.id DESC
            """)
    List<Booking> findMyBookingsKeyset(
            @Param("userId") UUID userId,
            @Param("cursorCreatedAt") LocalDateTime cursorCreatedAt,
            @Param("cursorId") Long cursorId,
            Pageable pageable
    );

    @Query("""
            select coalesce(sum(b.adults + b.children + b.seniors), 0)
            from Booking b
            where b.scheduleId = :scheduleId
              and b.status in :statuses
            """)
    Long sumSeatOccupancyByScheduleIdAndStatusIn(
            @Param("scheduleId") Long scheduleId,
            @Param("statuses") Collection<BookingStatus> statuses
    );

    long countByTourIdAndStatusIn(Long tourId, Collection<BookingStatus> statuses);

    boolean existsByScheduleIdAndUserIdAndStatusIn(
            Long scheduleId,
            UUID userId,
            Collection<BookingStatus> statuses
    );

    @Query("""
            select distinct b.userId
            from Booking b
            where b.scheduleId = :scheduleId
              and b.status in :statuses
            """)
    List<UUID> findDistinctUserIdsByScheduleIdAndStatusIn(
            @Param("scheduleId") Long scheduleId,
            @Param("statuses") Collection<BookingStatus> statuses
    );
}

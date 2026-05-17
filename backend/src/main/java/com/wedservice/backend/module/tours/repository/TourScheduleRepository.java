package com.wedservice.backend.module.tours.repository;

import com.wedservice.backend.module.tours.entity.TourSchedule;
import com.wedservice.backend.module.tours.entity.TourScheduleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface TourScheduleRepository extends JpaRepository<TourSchedule, Long> {

    List<TourSchedule> findByTourId(Long tourId);

    Optional<TourSchedule> findByIdAndTourId(Long id, Long tourId);

    @Query(
            """
            SELECT s FROM TourSchedule s
            WHERE s.deletedAt IS NULL
              AND s.tourId IN :tourIds
              AND s.status = :status
              AND s.departureAt > :now
              AND (s.capacityTotal - s.bookedSeats) > 0
            ORDER BY s.tourId ASC, s.departureAt ASC
            """)
    List<TourSchedule> findBookableUpcomingByTourIds(
            @Param("tourIds") Collection<Long> tourIds,
            @Param("status") TourScheduleStatus status,
            @Param("now") LocalDateTime now);
}

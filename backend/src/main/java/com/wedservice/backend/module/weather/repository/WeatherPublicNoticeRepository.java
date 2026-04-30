package com.wedservice.backend.module.weather.repository;

import com.wedservice.backend.module.weather.entity.WeatherNoticeStatus;
import com.wedservice.backend.module.weather.entity.WeatherPublicNotice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface WeatherPublicNoticeRepository extends JpaRepository<WeatherPublicNotice, Long> {

    List<WeatherPublicNotice> findByDestinationIdOrderByDisplayFromDesc(Long destinationId);

    List<WeatherPublicNotice> findByDestinationIdAndStatusAndDisplayFromLessThanEqualAndDisplayToGreaterThanEqualOrderByPinnedDescDisplayFromDesc(
            Long destinationId,
            WeatherNoticeStatus status,
            LocalDateTime displayFrom,
            LocalDateTime displayTo
    );

    Optional<WeatherPublicNotice> findByIdAndDestinationId(Long id, Long destinationId);
}

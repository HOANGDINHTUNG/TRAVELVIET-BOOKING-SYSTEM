package com.wedservice.backend.module.weather.repository;

import com.wedservice.backend.module.weather.entity.WeatherDisplayPolicy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WeatherDisplayPolicyRepository extends JpaRepository<WeatherDisplayPolicy, Long> {

    Optional<WeatherDisplayPolicy> findByDestinationId(Long destinationId);
}

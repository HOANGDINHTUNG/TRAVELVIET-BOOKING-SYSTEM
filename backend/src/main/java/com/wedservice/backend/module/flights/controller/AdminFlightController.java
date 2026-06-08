package com.wedservice.backend.module.flights.controller;

import com.wedservice.backend.common.response.ApiResponse;
import com.wedservice.backend.module.flights.dto.request.FlightRequest;
import com.wedservice.backend.module.flights.dto.response.FlightResponse;
import com.wedservice.backend.module.flights.facade.FlightFacade;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/flights")
@RequiredArgsConstructor
public class AdminFlightController {

    private final FlightFacade flightFacade;

    @PostMapping
    @PreAuthorize("hasAuthority('tour.create')")
    public ApiResponse<FlightResponse> create(@Valid @RequestBody FlightRequest request) {
        return ApiResponse.success(flightFacade.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('tour.update')")
    public ApiResponse<FlightResponse> update(@PathVariable Long id, @Valid @RequestBody FlightRequest request) {
        return ApiResponse.success(flightFacade.update(id, request));
    }
}


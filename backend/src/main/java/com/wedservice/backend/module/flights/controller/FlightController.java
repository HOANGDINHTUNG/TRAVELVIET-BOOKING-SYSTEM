package com.wedservice.backend.module.flights.controller;

import com.wedservice.backend.common.response.ApiResponse;
import com.wedservice.backend.common.response.PageResponse;
import com.wedservice.backend.module.flights.dto.request.FlightSearchRequest;
import com.wedservice.backend.module.flights.dto.response.FlightResponse;
import com.wedservice.backend.module.flights.facade.FlightFacade;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/flights")
@RequiredArgsConstructor
public class FlightController {

    private final FlightFacade flightFacade;

    @GetMapping
    public ApiResponse<PageResponse<FlightResponse>> searchFlights(@Valid @ModelAttribute FlightSearchRequest request) {
        return ApiResponse.success(flightFacade.search(request));
    }

    @GetMapping("/{id}")
    public ApiResponse<FlightResponse> getFlight(@PathVariable Long id) {
        return ApiResponse.success(flightFacade.getById(id));
    }
}


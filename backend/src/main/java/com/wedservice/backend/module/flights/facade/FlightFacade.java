package com.wedservice.backend.module.flights.facade;

import com.wedservice.backend.common.response.PageResponse;
import com.wedservice.backend.module.flights.dto.request.FlightRequest;
import com.wedservice.backend.module.flights.dto.request.FlightSearchRequest;
import com.wedservice.backend.module.flights.dto.response.FlightResponse;
import com.wedservice.backend.module.flights.service.FlightService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FlightFacade {
    private final FlightService flightService;

    public PageResponse<FlightResponse> search(FlightSearchRequest request) {
        return flightService.search(request);
    }

    public FlightResponse getById(Long id) {
        return flightService.getById(id);
    }

    public FlightResponse create(FlightRequest request) {
        return flightService.create(request);
    }

    public FlightResponse update(Long id, FlightRequest request) {
        return flightService.update(id, request);
    }
}


package com.wedservice.backend.module.flights.service;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import com.wedservice.backend.common.exception.ResourceNotFoundException;
import com.wedservice.backend.common.response.PageResponse;
import com.wedservice.backend.module.flights.dto.request.FlightRequest;
import com.wedservice.backend.module.flights.dto.request.FlightSearchRequest;
import com.wedservice.backend.module.flights.dto.response.FlightResponse;
import com.wedservice.backend.module.flights.entity.Airline;
import com.wedservice.backend.module.flights.entity.Airport;
import com.wedservice.backend.module.flights.entity.Flight;
import com.wedservice.backend.module.flights.entity.FlightClass;
import com.wedservice.backend.module.flights.entity.QFlight;
import com.wedservice.backend.module.flights.mapper.FlightMapper;
import com.wedservice.backend.module.flights.repository.AirlineRepository;
import com.wedservice.backend.module.flights.repository.AirportRepository;
import com.wedservice.backend.module.flights.repository.FlightClassRepository;
import com.wedservice.backend.module.flights.repository.FlightRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FlightService {

    private final FlightRepository flightRepository;
    private final FlightClassRepository flightClassRepository;
    private final AirlineRepository airlineRepository;
    private final AirportRepository airportRepository;
    private final FlightMapper flightMapper;

    @Transactional(readOnly = true)
    public PageResponse<FlightResponse> search(FlightSearchRequest request) {
        Predicate predicate = buildPredicate(request);
        Page<Flight> page = flightRepository.findAll(
                predicate,
                PageRequest.of(request.getPage(), request.getSize(), Sort.by(Sort.Direction.ASC, "departureTimeLocal"))
        );
        
        List<Flight> flights = page.getContent();
        List<Long> flightIds = flights.stream().map(Flight::getId).toList();
        
        List<FlightClass> allClasses = flightIds.isEmpty() ? Collections.emptyList() : flightClassRepository.findByFlightIdIn(flightIds);
        Map<Long, List<FlightClass>> classMap = allClasses.stream()
                .collect(Collectors.groupingBy(fc -> fc.getFlight().getId()));

        List<FlightResponse> content = flights.stream()
                .map(f -> enrichWithClasses(f, classMap.getOrDefault(f.getId(), Collections.emptyList())))
                .toList();

        return PageResponse.<FlightResponse>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public FlightResponse getById(Long id) {
        Flight flight = flightRepository.findWithGraphById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with id: " + id));
        return enrich(flight);
    }

    @Transactional
    public FlightResponse create(FlightRequest request) {
        Flight entity = flightMapper.toEntity(request);
        wireReferences(entity, request);
        if (!StringUtils.hasText(entity.getStatus())) {
            entity.setStatus("scheduled");
        }
        return enrich(flightRepository.save(entity));
    }

    @Transactional
    public FlightResponse update(Long id, FlightRequest request) {
        Flight entity = flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with id: " + id));
        flightMapper.update(entity, request);
        wireReferences(entity, request);
        if (!StringUtils.hasText(entity.getStatus())) {
            entity.setStatus("scheduled");
        }
        return enrich(flightRepository.save(entity));
    }

    /**
     * Tinh gia goi y va so ghe con trong theo cac hang ghe dang active.
     * Gia toi thieu va seat availability duoc dung cho man hinh search tong quan.
     */
    private FlightResponse enrich(Flight flight) {
        List<FlightClass> classes = flightClassRepository.findByFlightId(flight.getId());
        return enrichWithClasses(flight, classes);
    }
    
    private FlightResponse enrichWithClasses(Flight flight, List<FlightClass> classes) {
        FlightResponse base = flightMapper.toResponse(flight);
        BigDecimal minPrice = classes.stream()
                .map(fc -> fc.getBasePrice().add(fc.getTaxAmount()))
                .min(Comparator.naturalOrder())
                .orElse(BigDecimal.ZERO);
        int available = classes.stream()
                .map(FlightClass::getSeatAvailable)
                .filter(v -> v != null)
                .max(Integer::compareTo)
                .orElse(0);
        String cabin = classes.stream()
                .filter(fc -> Boolean.TRUE.equals(fc.getIsActive()))
                .map(FlightClass::getCabinClass)
                .findFirst()
                .orElse("economy");
        return FlightResponse.builder()
                .id(base.getId())
                .flightNo(base.getFlightNo())
                .status(base.getStatus())
                .airlineId(base.getAirlineId())
                .airlineCode(base.getAirlineCode())
                .airlineName(base.getAirlineName())
                .originAirportId(base.getOriginAirportId())
                .originAirportCode(base.getOriginAirportCode())
                .originAirportName(base.getOriginAirportName())
                .destinationAirportId(base.getDestinationAirportId())
                .destinationAirportCode(base.getDestinationAirportCode())
                .destinationAirportName(base.getDestinationAirportName())
                .departureTimeLocal(base.getDepartureTimeLocal())
                .arrivalTimeLocal(base.getArrivalTimeLocal())
                .durationMinutes(base.getDurationMinutes())
                .recommendedCabinClass(cabin)
                .minPrice(minPrice)
                .availableSeats(available)
                .createdAt(base.getCreatedAt())
                .updatedAt(base.getUpdatedAt())
                .build();
    }

    private void wireReferences(Flight entity, FlightRequest request) {
        Airline airline = airlineRepository.findById(request.getAirlineId())
                .orElseThrow(() -> new ResourceNotFoundException("Airline not found with id: " + request.getAirlineId()));
        Airport origin = airportRepository.findById(request.getOriginAirportId())
                .orElseThrow(() -> new ResourceNotFoundException("Origin airport not found with id: " + request.getOriginAirportId()));
        Airport destination = airportRepository.findById(request.getDestinationAirportId())
                .orElseThrow(() -> new ResourceNotFoundException("Destination airport not found with id: " + request.getDestinationAirportId()));
        entity.setAirline(airline);
        entity.setOriginAirport(origin);
        entity.setDestinationAirport(destination);
    }

    private Predicate buildPredicate(FlightSearchRequest request) {
        QFlight flight = QFlight.flight;
        BooleanBuilder builder = new BooleanBuilder();
        if (request.getOriginDestinationId() != null) {
            builder.and(flight.originAirport.destination.id.eq(request.getOriginDestinationId()));
        }
        if (request.getDestinationId() != null) {
            builder.and(flight.destinationAirport.destination.id.eq(request.getDestinationId()));
        }
        if (StringUtils.hasText(request.getOriginCode())) {
            builder.and(flight.originAirport.codeIata.equalsIgnoreCase(request.getOriginCode()));
        }
        if (StringUtils.hasText(request.getDestinationCode())) {
            builder.and(flight.destinationAirport.codeIata.equalsIgnoreCase(request.getDestinationCode()));
        }
        if (request.getDepartureDate() != null) {
            builder.and(flight.departureTimeLocal.goe(request.getDepartureDate().atStartOfDay()));
            builder.and(flight.departureTimeLocal.lt(request.getDepartureDate().plusDays(1).atStartOfDay()));
        }
        if (StringUtils.hasText(request.getCabinClass())) {
            // Cabin class filtering can be moved to join-based query in next iteration.
        }
        return builder;
    }
}


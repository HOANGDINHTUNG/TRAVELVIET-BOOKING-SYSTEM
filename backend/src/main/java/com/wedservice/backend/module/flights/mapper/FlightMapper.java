package com.wedservice.backend.module.flights.mapper;

import com.wedservice.backend.module.flights.dto.request.FlightRequest;
import com.wedservice.backend.module.flights.dto.response.FlightResponse;
import com.wedservice.backend.module.flights.entity.Flight;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface FlightMapper {

    @Mapping(target = "airlineId", source = "airline.id")
    @Mapping(target = "airlineCode", source = "airline.codeIata")
    @Mapping(target = "airlineName", source = "airline.name")
    @Mapping(target = "originAirportId", source = "originAirport.id")
    @Mapping(target = "originAirportCode", source = "originAirport.codeIata")
    @Mapping(target = "originAirportName", source = "originAirport.name")
    @Mapping(target = "destinationAirportId", source = "destinationAirport.id")
    @Mapping(target = "destinationAirportCode", source = "destinationAirport.codeIata")
    @Mapping(target = "destinationAirportName", source = "destinationAirport.name")
    FlightResponse toResponse(Flight entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "airline", ignore = true)
    @Mapping(target = "originAirport", ignore = true)
    @Mapping(target = "destinationAirport", ignore = true)
    Flight toEntity(FlightRequest request);

    @Mapping(target = "airline", ignore = true)
    @Mapping(target = "originAirport", ignore = true)
    @Mapping(target = "destinationAirport", ignore = true)
    void update(@MappingTarget Flight target, FlightRequest request);
}


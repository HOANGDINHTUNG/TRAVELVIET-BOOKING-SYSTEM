package com.wedservice.backend.module.hotels.mapper;

import com.wedservice.backend.module.hotels.dto.request.HotelRequest;
import com.wedservice.backend.module.hotels.dto.response.HotelResponse;
import com.wedservice.backend.module.hotels.entity.Hotel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface HotelMapper {

    @Mapping(target = "destinationId", source = "destination.id")
    @Mapping(target = "destinationName", source = "destination.name")
    HotelResponse toResponse(Hotel entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "destination", ignore = true)
    @Mapping(target = "supplierId", ignore = true)
    Hotel toEntity(HotelRequest request);

    @Mapping(target = "destination", ignore = true)
    @Mapping(target = "supplierId", ignore = true)
    void update(@MappingTarget Hotel target, HotelRequest request);
}


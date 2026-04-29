package com.wedservice.backend.module.destinations.entity.converter;

import com.wedservice.backend.module.destinations.entity.DestinationStatus;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class DestinationStatusConverter implements AttributeConverter<DestinationStatus, String> {

    @Override
    public String convertToDatabaseColumn(DestinationStatus attribute) {
        return attribute == null ? null : attribute.getValue();
    }

    @Override
    public DestinationStatus convertToEntityAttribute(String dbData) {
        return dbData == null ? null : DestinationStatus.fromValue(dbData);
    }
}

package com.wedservice.backend.module.destinations.entity.converter;

import com.wedservice.backend.module.destinations.entity.MediaType;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class MediaTypeConverter implements AttributeConverter<MediaType, String> {

    @Override
    public String convertToDatabaseColumn(MediaType attribute) {
        return attribute == null ? null : attribute.getValue();
    }

    @Override
    public MediaType convertToEntityAttribute(String dbData) {
        return dbData == null ? null : MediaType.fromValue(dbData);
    }
}

package com.wedservice.backend.module.destinations.entity.converter;

import com.wedservice.backend.module.destinations.entity.CrowdLevel;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class CrowdLevelConverter implements AttributeConverter<CrowdLevel, String> {

    @Override
    public String convertToDatabaseColumn(CrowdLevel attribute) {
        return attribute == null ? null : attribute.getValue();
    }

    @Override
    public CrowdLevel convertToEntityAttribute(String dbData) {
        return dbData == null ? null : CrowdLevel.fromValue(dbData);
    }
}

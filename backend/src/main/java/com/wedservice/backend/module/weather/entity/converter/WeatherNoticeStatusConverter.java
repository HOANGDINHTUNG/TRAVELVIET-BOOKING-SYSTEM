package com.wedservice.backend.module.weather.entity.converter;

import com.wedservice.backend.module.weather.entity.WeatherNoticeStatus;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class WeatherNoticeStatusConverter implements AttributeConverter<WeatherNoticeStatus, String> {

    @Override
    public String convertToDatabaseColumn(WeatherNoticeStatus attribute) {
        return attribute == null ? null : attribute.getValue();
    }

    @Override
    public WeatherNoticeStatus convertToEntityAttribute(String dbData) {
        return dbData == null ? null : WeatherNoticeStatus.fromValue(dbData);
    }
}

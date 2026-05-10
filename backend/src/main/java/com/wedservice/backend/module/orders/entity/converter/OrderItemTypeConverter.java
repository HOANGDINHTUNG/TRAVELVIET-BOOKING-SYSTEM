package com.wedservice.backend.module.orders.entity.converter;

import com.wedservice.backend.module.orders.entity.OrderItemType;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class OrderItemTypeConverter implements AttributeConverter<OrderItemType, String> {

    @Override
    public String convertToDatabaseColumn(OrderItemType attribute) {
        return attribute == null ? null : attribute.getValue();
    }

    @Override
    public OrderItemType convertToEntityAttribute(String dbData) {
        return dbData == null ? null : OrderItemType.fromValue(dbData);
    }
}

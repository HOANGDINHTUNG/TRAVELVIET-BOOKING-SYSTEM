package com.wedservice.backend.module.tours.rules;

import com.wedservice.backend.common.exception.BusinessException;
import com.wedservice.backend.common.rules.BusinessRuleValidator;
import com.wedservice.backend.module.destinations.entity.Destination;
import com.wedservice.backend.module.tours.entity.Tour;
import org.springframework.stereotype.Component;

/**
 * Xử lý khoảng cách và phân loại địa lý (Geo-Transport Rule)
 * Ví dụ đối với Tour Quốc tế bắt buộc phải sử dụng Máy bay.
 */
@Component
public class GeoTransportRule implements BusinessRuleValidator<Tour> {

    @Override
    public void validate(Tour tour) {
        if (tour == null) return;

        Destination destination = tour.getDestination();
        if (destination == null || destination.getCountryCode() == null) {
            return;
        }

        String countryCode = destination.getCountryCode().trim().toUpperCase();
        boolean isInternational = !countryCode.equals("VN") && !countryCode.equals("VIETNAM");

        if (isInternational) {
            String transportType = tour.getTransportType();
            
            // Nếu không phải là FLIGHT mà ra nước ngoài thì văng lỗi (không cho phép đi xe khách vv)
            if (transportType != null && !transportType.toUpperCase().contains("FLIGHT") && !transportType.toUpperCase().contains("MAY BAY")) {
                throw new BusinessException("Tour đi nước ngoài (" + destination.getCountryCode() + ") bắt buộc phương tiện (TransportType) phải là Máy bay (Flight), không thể là " + transportType);
            }
        }
    }
}

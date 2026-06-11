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

        boolean isInternational = false;
        String firstIntlCountryCode = "";
        if (tour.getDestinations() != null) {
            for (Destination dest : tour.getDestinations()) {
                if (dest != null && dest.getCountryCode() != null) {
                    String code = dest.getCountryCode().trim().toUpperCase();
                    if (!code.equals("VN") && !code.equals("VIETNAM")) {
                        isInternational = true;
                        firstIntlCountryCode = code;
                        break;
                    }
                }
            }
        }

        if (isInternational) {
            String transportType = tour.getTransportType();
            
            // Nếu không phải là FLIGHT mà ra nước ngoài thì văng lỗi (không cho phép đi xe khách vv)
            if (transportType != null && !transportType.toUpperCase().contains("FLIGHT") && !transportType.toUpperCase().contains("MAY BAY")) {
                throw new BusinessException("Tour đi nước ngoài (" + firstIntlCountryCode + ") bắt buộc phương tiện (TransportType) phải là Máy bay (Flight), không thể là " + transportType);
            }
        }
    }
}

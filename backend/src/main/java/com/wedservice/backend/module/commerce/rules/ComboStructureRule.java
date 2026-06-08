package com.wedservice.backend.module.commerce.rules;

import com.wedservice.backend.common.exception.BadRequestException;
import com.wedservice.backend.common.rules.BusinessRuleValidator;
import com.wedservice.backend.module.commerce.entity.ComboPackage;
import com.wedservice.backend.module.commerce.entity.ComboPackageItem;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Cấu trúc cứng gốc của Combo (Combo Blueprint Rule)
 * Đảm bảo một Combo phải có ít nhất 1 phương tiện di chuyển và 1 dịch vụ lưu trú.
 */
@Component
public class ComboStructureRule implements BusinessRuleValidator<ComboPackage> {

    @Override
    public void validate(ComboPackage comboPackage) {
        if (comboPackage == null) {
            throw new BadRequestException("ComboPackage không thể null");
        }
        
        List<ComboPackageItem> items = comboPackage.getItems();
        if (items == null || items.isEmpty()) {
            throw new BadRequestException("Combo phải có chứa các item cấu thành");
        }

        boolean hasTransport = false;
        boolean hasAccommodation = false;

        for (ComboPackageItem item : items) {
            if (item.getItemType() == null) continue;
            
            String itemType = item.getItemType().toLowerCase();
            if (itemType.contains("flight") || itemType.contains("bus") || itemType.contains("transport")) {
                hasTransport = true;
            }
            if (itemType.contains("hotel") || itemType.contains("resort") || itemType.contains("accommodation")) {
                hasAccommodation = true;
            }
        }

        if (!hasTransport) {
            throw new BadRequestException("Combo bắt buộc phải bao gồm phương tiện di chuyển (Vé máy bay hoặc Xe khách)!");
        }

        if (!hasAccommodation) {
            throw new BadRequestException("Combo bắt buộc phải bao gồm dịch vụ lưu trú (Khách sạn hoặc Resort)!");
        }

        // TODO: Chèn logic Geo-matching: destinationAirport của Flight (Transport) phải khớp với Destination của Hotel
    }
}

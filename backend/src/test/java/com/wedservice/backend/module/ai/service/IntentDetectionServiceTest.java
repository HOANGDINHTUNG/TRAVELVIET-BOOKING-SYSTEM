package com.wedservice.backend.module.ai.service;

import com.wedservice.backend.module.ai.enums.ChatIntent;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

class IntentDetectionServiceTest {
    private final IntentDetectionService service = new IntentDetectionService();

    @Test
    void detectsTourSearchWithLocationAndDuration() {
        var result = service.detect("Tôi muốn đi Đà Lạt 3 ngày 2 đêm");

        assertThat(result.getIntent()).isEqualTo(ChatIntent.TOUR_SEARCH);
        assertThat(result.getLocation()).isEqualTo("Đà Lạt");
        assertThat(result.getDuration()).isEqualTo("3 ngày 2 đêm");
        assertThat(result.getFilters()).containsEntry("durationDays", 3);
    }

    @Test
    void detectsPriceAdviceWithBudget() {
        var result = service.detect("Tôi có 5 triệu nên đi đâu?");

        assertThat(result.getIntent()).isEqualTo(ChatIntent.PRICE_ADVICE);
        assertThat(result.getMaxPrice()).isEqualByComparingTo(BigDecimal.valueOf(5_000_000));
    }

    @Test
    void detectsDestinationSearch() {
        var result = service.detect("Có địa điểm nào đẹp ở miền Trung không?");

        assertThat(result.getIntent()).isEqualTo(ChatIntent.DESTINATION_SEARCH);
        assertThat(result.getLocation()).isEqualTo("Miền Trung");
    }

    @Test
    void detectsSensorQuestionBeforeSmartBoxStatus() {
        var result = service.detect("Hộp hàng SBX123 có bị va đập không?");

        assertThat(result.getIntent()).isEqualTo(ChatIntent.SENSOR_STATUS);
        assertThat(result.getTrackingCode()).isEqualTo("SBX123");
    }

    @Test
    void detectsOrderTrackingCode() {
        var result = service.detect("Đơn hàng SBX123 đang ở đâu?");

        assertThat(result.getIntent()).isEqualTo(ChatIntent.ORDER_TRACKING);
        assertThat(result.getTrackingCode()).isEqualTo("SBX123");
    }
}

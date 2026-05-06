package com.wedservice.backend.module.ai.service;

import com.wedservice.backend.module.ai.dto.IntentResult;
import com.wedservice.backend.module.ai.enums.ChatIntent;
import com.wedservice.backend.common.response.PageResponse;
import com.wedservice.backend.module.bookings.service.query.BookingQueryService;
import com.wedservice.backend.module.destinations.dto.request.DestinationSearchRequest;
import com.wedservice.backend.module.destinations.dto.response.DestinationPublicResponse;
import com.wedservice.backend.module.destinations.service.query.DestinationQueryService;
import com.wedservice.backend.module.tours.dto.request.TourSearchRequest;
import com.wedservice.backend.module.tours.dto.response.TourMediaResponse;
import com.wedservice.backend.module.tours.dto.response.TourResponse;
import com.wedservice.backend.module.tours.service.query.TourQueryService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.domain.PageImpl;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

class AiDataProviderTest {
    private final TourQueryService tourQueryService = mock(TourQueryService.class);
    private final DestinationQueryService destinationQueryService = mock(DestinationQueryService.class);
    private final BookingQueryService bookingQueryService = mock(BookingQueryService.class);
    private final AiDataProvider provider = new AiDataProvider(
            tourQueryService,
            destinationQueryService,
            bookingQueryService
    );

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void returnsNoDataForUnsupportedSensorIntent() {
        var result = provider.getData(
                IntentResult.builder()
                        .intent(ChatIntent.SENSOR_STATUS)
                        .trackingCode("SBX123")
                        .build(),
                "Hộp hàng SBX123 có bị va đập không?"
        );

        assertThat(result.isDataFound()).isFalse();
        assertThat(result.getFallbackAnswer()).contains("chưa có thông tin phù hợp");
        verifyNoInteractions(tourQueryService, destinationQueryService, bookingQueryService);
    }

    @Test
    void bookingLookupRequiresAuthenticatedUser() {
        var result = provider.getData(
                IntentResult.builder()
                        .intent(ChatIntent.BOOKING_LOOKUP)
                        .trackingCode("BK123")
                        .build(),
                "Booking BK123 của tôi thế nào?"
        );

        assertThat(result.isDataFound()).isFalse();
        assertThat(result.getFallbackAnswer()).contains("đăng nhập");
        verifyNoInteractions(bookingQueryService);
    }

    @Test
    void tourSearchFormatsContextFromTourServiceData() {
        when(tourQueryService.searchTours(any(TourSearchRequest.class))).thenReturn(new PageImpl<>(List.of(
                TourResponse.builder()
                        .id(10L)
                        .code("DL3N2D")
                        .name("Tour Đà Lạt 3 ngày 2 đêm")
                        .basePrice(new BigDecimal("4500000"))
                        .currency("VND")
                        .durationDays(3)
                        .durationNights(2)
                        .shortDescription("Khám phá Đà Lạt theo dữ liệu hệ thống.")
                        .status("active")
                        .media(List.of(TourMediaResponse.builder()
                                .mediaType("cover")
                                .mediaUrl("tour-images/dalat.jpg")
                                .isActive(true)
                                .sortOrder(1)
                                .build()))
                        .build()
        )));

        var result = provider.getData(
                IntentResult.builder()
                        .intent(ChatIntent.TOUR_SEARCH)
                        .keyword("Đà Lạt")
                        .location("Đà Lạt")
                        .maxPrice(new BigDecimal("5000000"))
                        .filters(Map.of("durationDays", 3))
                        .build(),
                "Tôi muốn đi Đà Lạt 3 ngày 2 đêm giá dưới 5 triệu"
        );

        ArgumentCaptor<TourSearchRequest> requestCaptor = ArgumentCaptor.forClass(TourSearchRequest.class);
        verify(tourQueryService).searchTours(requestCaptor.capture());

        assertThat(result.isDataFound()).isTrue();
        assertThat(result.getContext()).contains("DL3N2D", "Tour Đà Lạt 3 ngày 2 đêm", "4.500.000 VND");
        assertThat(result.getFallbackAnswer()).contains("Gợi ý nổi bật", "Tour Đà Lạt 3 ngày 2 đêm");
        assertThat(result.getRelatedItems()).hasSize(1);
        assertThat(result.getRelatedItems().get(0).getDetailUrl()).isEqualTo("/tours/10");
        assertThat(result.getRelatedItems().get(0).getImageUrl()).isEqualTo("tour-images/dalat.jpg");
        assertThat(requestCaptor.getValue().getKeyword()).isEqualTo("Đà Lạt");
        assertThat(requestCaptor.getValue().getMaxPrice()).isEqualByComparingTo(new BigDecimal("5000000"));
        assertThat(requestCaptor.getValue().getMinDurationDays()).isEqualTo(3);
        assertThat(requestCaptor.getValue().getMaxDurationDays()).isEqualTo(3);
    }

    @Test
    void destinationSearchFormatsContextFromDestinationServiceData() {
        when(destinationQueryService.searchApprovedDestinations(any(DestinationSearchRequest.class))).thenReturn(
                PageResponse.<DestinationPublicResponse>builder()
                        .content(List.of(DestinationPublicResponse.builder()
                                .uuid(UUID.fromString("11111111-1111-1111-1111-111111111111"))
                                .name("Hội An")
                                .province("Quảng Nam")
                                .region("Miền Trung")
                                .shortDescription("Phố cổ trong dữ liệu hệ thống.")
                                .coverImageUrl("destination-images/hoi-an.jpg")
                                .bestTimeFromMonth(2)
                                .bestTimeToMonth(8)
                                .isFeatured(true)
                                .activeTourCount(4L)
                                .build()))
                        .page(0)
                        .size(5)
                        .totalElements(1)
                        .totalPages(1)
                        .last(true)
                        .build()
        );

        var result = provider.getData(
                IntentResult.builder()
                        .intent(ChatIntent.DESTINATION_SEARCH)
                        .location("Miền Trung")
                        .keyword("Miền Trung")
                        .build(),
                "Có địa điểm nào đẹp ở miền Trung không?"
        );

        ArgumentCaptor<DestinationSearchRequest> requestCaptor = ArgumentCaptor.forClass(DestinationSearchRequest.class);
        verify(destinationQueryService).searchApprovedDestinations(requestCaptor.capture());

        assertThat(result.isDataFound()).isTrue();
        assertThat(result.getContext()).contains("Hội An", "Quảng Nam", "Miền Trung", "Số tour đang hoạt động: 4");
        assertThat(result.getFallbackAnswer()).contains("Gợi ý đầu tiên", "Hội An");
        assertThat(result.getRelatedItems()).hasSize(1);
        assertThat(result.getRelatedItems().get(0).getDetailUrl()).isEqualTo("/destinations/11111111-1111-1111-1111-111111111111");
        assertThat(result.getRelatedItems().get(0).getImageUrl()).isEqualTo("destination-images/hoi-an.jpg");
        assertThat(requestCaptor.getValue().getKeyword()).isNull();
        assertThat(requestCaptor.getValue().getRegion()).isEqualTo("Miền Trung");
    }
}

package com.wedservice.backend.module.ai.service;

import com.wedservice.backend.common.exception.UnauthorizedException;
import com.wedservice.backend.common.response.PageResponse;
import com.wedservice.backend.module.ai.dto.AiRelatedItem;
import com.wedservice.backend.module.ai.dto.AiDataResult;
import com.wedservice.backend.module.ai.dto.IntentResult;
import com.wedservice.backend.module.ai.enums.ChatIntent;
import com.wedservice.backend.module.bookings.dto.response.BookingResponse;
import com.wedservice.backend.module.bookings.service.query.BookingQueryService;
import com.wedservice.backend.module.destinations.dto.request.DestinationSearchRequest;
import com.wedservice.backend.module.destinations.dto.response.DestinationPublicResponse;
import com.wedservice.backend.module.destinations.service.query.DestinationQueryService;
import com.wedservice.backend.module.tours.dto.request.TourSearchRequest;
import com.wedservice.backend.module.tours.dto.response.TourMediaResponse;
import com.wedservice.backend.module.tours.dto.response.TourResponse;
import com.wedservice.backend.module.tours.service.query.TourQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiDataProvider {
    private static final int AI_RESULT_LIMIT = 5;
    private static final int AI_CARD_LIMIT = 3;

    private final TourQueryService tourQueryService;
    private final DestinationQueryService destinationQueryService;
    private final BookingQueryService bookingQueryService;

    public AiDataResult getData(IntentResult intentResult, String message) {
        ChatIntent intent = intentResult.getIntent();
        return switch (intent) {
            case TOUR_SEARCH, PRICE_ADVICE -> tourAiData(intentResult);
            case DESTINATION_SEARCH -> destinationAiData(intentResult);
            case BOOKING_LOOKUP -> bookingAiData(intentResult);
            case ORDER_TRACKING, SHIPMENT_TRACKING, SMARTBOX_STATUS, SENSOR_STATUS -> unsupportedPersonalData();
            case SUPPORT_REQUEST -> supportData();
            case GENERAL_FAQ, UNKNOWN -> AiDataResult.noData(suggestionsFor(intent));
        };
    }

    private AiDataResult tourAiData(IntentResult intentResult) {
        try {
            TourSearchRequest request = TourSearchRequest.builder()
                    .keyword(intentResult.getKeyword())
                    .minPrice(intentResult.getMinPrice())
                    .maxPrice(intentResult.getMaxPrice())
                    .size(AI_RESULT_LIMIT)
                    .page(0)
                    .sortBy(intentResult.getMaxPrice() != null ? "basePrice" : "createdAt")
                    .sortDir(intentResult.getMaxPrice() != null ? "asc" : "desc")
                    .build();

            Integer durationDays = durationDays(intentResult);
            if (durationDays != null) {
                request.setMinDurationDays(durationDays);
                request.setMaxDurationDays(durationDays);
            }

            Page<TourResponse> page = tourQueryService.searchTours(request);
            List<TourResponse> tours = page.getContent().stream()
                    .filter(Objects::nonNull)
                    .limit(AI_RESULT_LIMIT)
                    .toList();

            if (tours.isEmpty()) {
                return AiDataResult.noData(
                        "Hiện chưa có thông tin tour phù hợp với câu hỏi này.",
                        suggestionsFor(intentResult.getIntent())
                );
            }

            String context = tours.stream()
                    .map(this::formatTour)
                    .reduce((left, right) -> left + "\n-------------------------\n" + right)
                    .orElse("");
            return AiDataResult.found(
                    context,
                    suggestionsFor(intentResult.getIntent()),
                    tours.stream().limit(AI_CARD_LIMIT).map(this::tourRelatedItem).toList(),
                    tourFallback(tours)
            );
        } catch (Exception e) {
            log.warn("Could not load tour AI data: {}", e.getMessage());
            return AiDataResult.noData(
                    "Hiện chưa có thông tin tour phù hợp với câu hỏi này.",
                    suggestionsFor(intentResult.getIntent())
            );
        }
    }

    private AiDataResult destinationAiData(IntentResult intentResult) {
        try {
            DestinationSearchRequest request = DestinationSearchRequest.builder()
                    .keyword(resolveDestinationKeyword(intentResult))
                    .region(resolveRegion(intentResult.getLocation()))
                    .page(0)
                    .size(AI_RESULT_LIMIT)
                    .sortBy("name")
                    .sortDir("asc")
                    .build();

            PageResponse<DestinationPublicResponse> page = destinationQueryService.searchApprovedDestinations(request);
            List<DestinationPublicResponse> destinations = page.getContent().stream()
                    .filter(Objects::nonNull)
                    .limit(AI_RESULT_LIMIT)
                    .toList();

            if (destinations.isEmpty()) {
                return AiDataResult.noData(
                        "Hiện chưa có thông tin điểm đến phù hợp với câu hỏi này.",
                        suggestionsFor(ChatIntent.DESTINATION_SEARCH)
                );
            }

            String context = destinations.stream()
                    .map(this::formatDestination)
                    .reduce((left, right) -> left + "\n-------------------------\n" + right)
                    .orElse("");
            return AiDataResult.found(
                    context,
                    suggestionsFor(ChatIntent.DESTINATION_SEARCH),
                    destinations.stream().limit(AI_CARD_LIMIT).map(this::destinationRelatedItem).toList(),
                    destinationFallback(destinations)
            );
        } catch (Exception e) {
            log.warn("Could not load destination AI data: {}", e.getMessage());
            return AiDataResult.noData(
                    "Hiện chưa có thông tin điểm đến phù hợp với câu hỏi này.",
                    suggestionsFor(ChatIntent.DESTINATION_SEARCH)
            );
        }
    }

    private AiDataResult bookingAiData(IntentResult intentResult) {
        if (!isAuthenticated()) {
            return AiDataResult.noData(
                    AiChatMessages.LOGIN_REQUIRED,
                    List.of("Đăng nhập để xem booking", "Tìm tour đang mở bán")
            );
        }

        try {
            List<BookingResponse> bookings;
            if (intentResult.getId() != null) {
                bookings = List.of(bookingQueryService.getBooking(intentResult.getId()));
            } else {
                bookings = bookingQueryService.getMyBookings();
                if (StringUtils.hasText(intentResult.getTrackingCode())) {
                    String code = intentResult.getTrackingCode();
                    bookings = bookings.stream()
                            .filter(booking -> code.equalsIgnoreCase(booking.getBookingCode()))
                            .toList();
                }
            }

            bookings = bookings.stream()
                    .filter(Objects::nonNull)
                    .limit(AI_RESULT_LIMIT)
                    .toList();

            if (bookings.isEmpty()) {
                return AiDataResult.noData(
                        "Hiện chưa có thông tin booking phù hợp với câu hỏi này.",
                        suggestionsFor(ChatIntent.BOOKING_LOOKUP)
                );
            }

            String context = bookings.stream()
                    .map(this::formatBooking)
                    .reduce((left, right) -> left + "\n-------------------------\n" + right)
                    .orElse("");
            return AiDataResult.found(
                    context,
                    suggestionsFor(ChatIntent.BOOKING_LOOKUP),
                    bookings.stream().limit(AI_CARD_LIMIT).map(this::bookingRelatedItem).toList(),
                    bookingFallback(bookings)
            );
        } catch (UnauthorizedException e) {
            return AiDataResult.noData(AiChatMessages.LOGIN_REQUIRED, suggestionsFor(ChatIntent.BOOKING_LOOKUP));
        } catch (Exception e) {
            log.warn("Could not load booking AI data: {}", e.getMessage());
            return AiDataResult.noData(
                    "Hiện chưa có thông tin booking phù hợp với câu hỏi này.",
                    suggestionsFor(ChatIntent.BOOKING_LOOKUP)
            );
        }
    }

    private AiDataResult supportData() {
        String context = """
                Dữ liệu hỗ trợ hệ thống:
                - Người dùng có thể yêu cầu hỗ trợ về đặt tour, thanh toán, hủy lịch, đổi lịch và tư vấn tour.
                - Nếu vấn đề liên quan đến booking cá nhân, người dùng cần đăng nhập để hệ thống kiểm tra đúng dữ liệu.
                - Không có dữ liệu phiên hỗ trợ cụ thể được tìm thấy trong câu hỏi hiện tại.
                """;
        return AiDataResult.found(
                context,
                suggestionsFor(ChatIntent.SUPPORT_REQUEST),
                List.of(),
                "Mình có thể hỗ trợ bạn về đặt tour, thanh toán, hủy hoặc đổi lịch. Nếu vấn đề liên quan đến booking cá nhân, bạn hãy đăng nhập rồi gửi mã booking để mình kiểm tra đúng thông tin."
        );
    }

    private AiDataResult unsupportedPersonalData() {
        return AiDataResult.noData(
                "Hiện chưa có thông tin phù hợp cho yêu cầu này.",
                List.of("Tìm tour phù hợp", "Liên hệ hỗ trợ")
        );
    }

    private AiRelatedItem tourRelatedItem(TourResponse tour) {
        return AiRelatedItem.builder()
                .type("TOUR")
                .id(tour.getId() == null ? null : tour.getId().toString())
                .title(safe(tour.getName()))
                .subtitle(durationText(tour.getDurationDays(), tour.getDurationNights()))
                .description(safe(tour.getShortDescription()))
                .imageUrl(tourImageUrl(tour))
                .detailUrl(tour.getId() == null ? null : "/tours/" + tour.getId())
                .meta(money(tour.getBasePrice(), tour.getCurrency()))
                .build();
    }

    private AiRelatedItem destinationRelatedItem(DestinationPublicResponse destination) {
        String id = destination.getUuid() == null ? null : destination.getUuid().toString();
        return AiRelatedItem.builder()
                .type("DESTINATION")
                .id(id)
                .title(safe(destination.getName()))
                .subtitle(joinNonBlank(destination.getProvince(), destination.getRegion()))
                .description(safe(destination.getShortDescription()))
                .imageUrl(destination.getCoverImageUrl())
                .detailUrl(id == null ? null : "/destinations/" + id)
                .meta(destination.getActiveTourCount() == null
                        ? bestTime(destination.getBestTimeFromMonth(), destination.getBestTimeToMonth())
                        : destination.getActiveTourCount() + " tour đang hoạt động")
                .build();
    }

    private AiRelatedItem bookingRelatedItem(BookingResponse booking) {
        String id = booking.getId() == null ? null : booking.getId().toString();
        return AiRelatedItem.builder()
                .type("BOOKING")
                .id(id)
                .title("Booking " + safe(booking.getBookingCode()))
                .subtitle("Trạng thái: " + safe(booking.getStatus()))
                .description("Thanh toán: " + safe(booking.getPaymentStatus()))
                .detailUrl(id == null ? null : "/bookings/" + id)
                .meta(money(booking.getFinalAmount(), booking.getCurrency()))
                .build();
    }

    private String tourFallback(List<TourResponse> tours) {
        TourResponse first = tours.get(0);
        String opening = tours.size() == 1
                ? "Mình tìm thấy một tour phù hợp với câu hỏi của bạn."
                : "Mình tìm thấy " + tours.size() + " tour phù hợp với câu hỏi của bạn.";
        return opening + " Gợi ý nổi bật là " + safe(first.getName())
                + ", " + durationText(first.getDurationDays(), first.getDurationNights())
                + ", giá " + money(first.getBasePrice(), first.getCurrency())
                + ". Bạn có thể mở thẻ bên dưới để xem ảnh, lịch trình và thông tin chi tiết.";
    }

    private String destinationFallback(List<DestinationPublicResponse> destinations) {
        DestinationPublicResponse first = destinations.get(0);
        String opening = destinations.size() == 1
                ? "Mình tìm thấy một điểm đến phù hợp."
                : "Mình tìm thấy " + destinations.size() + " điểm đến phù hợp.";
        return opening + " Gợi ý đầu tiên là " + safe(first.getName())
                + joinPrefix(", ", joinNonBlank(first.getProvince(), first.getRegion()))
                + ". Bạn có thể mở thẻ bên dưới để xem ảnh và thông tin chi tiết.";
    }

    private String bookingFallback(List<BookingResponse> bookings) {
        BookingResponse first = bookings.get(0);
        String opening = bookings.size() == 1
                ? "Mình tìm thấy booking của bạn."
                : "Mình tìm thấy " + bookings.size() + " booking gần nhất của bạn.";
        return opening + " Booking " + safe(first.getBookingCode())
                + " đang ở trạng thái " + safe(first.getStatus())
                + ", thanh toán " + safe(first.getPaymentStatus())
                + ", tổng tiền " + money(first.getFinalAmount(), first.getCurrency()) + ".";
    }

    private String tourImageUrl(TourResponse tour) {
        if (tour.getMedia() == null) {
            return null;
        }

        return tour.getMedia().stream()
                .filter(Objects::nonNull)
                .filter(media -> media.getIsActive() == null || Boolean.TRUE.equals(media.getIsActive()))
                .filter(media -> StringUtils.hasText(media.getMediaUrl()))
                .filter(media -> !StringUtils.hasText(media.getMediaType())
                        || !"video".equalsIgnoreCase(media.getMediaType()))
                .min(Comparator.comparing(
                        TourMediaResponse::getSortOrder,
                        Comparator.nullsLast(Integer::compareTo)
                ))
                .map(TourMediaResponse::getMediaUrl)
                .orElse(null);
    }

    private String formatTour(TourResponse tour) {
        return """
                Mã tour: %s
                Tên tour: %s
                Thời lượng: %s
                Giá: %s
                Mô tả ngắn: %s
                Phương tiện: %s
                Hình thức: %s
                Trạng thái: %s
                Đánh giá trung bình: %s
                Số lượt đặt: %s
                """.formatted(
                safe(tour.getCode()),
                safe(tour.getName()),
                durationText(tour.getDurationDays(), tour.getDurationNights()),
                money(tour.getBasePrice(), tour.getCurrency()),
                safe(tour.getShortDescription()),
                safe(tour.getTransportType()),
                safe(tour.getTripMode()),
                safe(tour.getStatus()),
                tour.getAverageRating() == null ? AiChatMessages.UNKNOWN_VALUE : tour.getAverageRating(),
                tour.getTotalBookings() == null ? AiChatMessages.UNKNOWN_VALUE : tour.getTotalBookings()
        );
    }

    private String formatDestination(DestinationPublicResponse destination) {
        return """
                Mã địa điểm: %s
                Tên địa điểm: %s
                Tỉnh/thành: %s
                Quận/huyện: %s
                Vùng miền: %s
                Mô tả ngắn: %s
                Thời điểm nên đi: %s
                Mức độ đông mặc định: %s
                Nổi bật: %s
                Số tour đang hoạt động: %s
                """.formatted(
                destination.getUuid(),
                safe(destination.getName()),
                safe(destination.getProvince()),
                safe(destination.getDistrict()),
                safe(destination.getRegion()),
                safe(destination.getShortDescription()),
                bestTime(destination.getBestTimeFromMonth(), destination.getBestTimeToMonth()),
                destination.getCrowdLevelDefault() == null ? AiChatMessages.UNKNOWN_VALUE : destination.getCrowdLevelDefault(),
                Boolean.TRUE.equals(destination.getIsFeatured()) ? "Có" : "Không",
                destination.getActiveTourCount() == null ? AiChatMessages.UNKNOWN_VALUE : destination.getActiveTourCount()
        );
    }

    private String formatBooking(BookingResponse booking) {
        return """
                Mã booking: %s
                Mã tour: %s
                Mã lịch khởi hành: %s
                Trạng thái booking: %s
                Trạng thái thanh toán: %s
                Số khách: %s người lớn, %s trẻ em, %s em bé, %s người cao tuổi
                Tổng tiền cuối cùng: %s
                Ngày tạo: %s
                Cập nhật gần nhất: %s
                """.formatted(
                safe(booking.getBookingCode()),
                booking.getTourId(),
                booking.getScheduleId(),
                safe(booking.getStatus()),
                safe(booking.getPaymentStatus()),
                valueOrZero(booking.getAdults()),
                valueOrZero(booking.getChildren()),
                valueOrZero(booking.getInfants()),
                valueOrZero(booking.getSeniors()),
                money(booking.getFinalAmount(), booking.getCurrency()),
                booking.getCreatedAt() == null ? AiChatMessages.UNKNOWN_VALUE : booking.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
                booking.getUpdatedAt() == null ? AiChatMessages.UNKNOWN_VALUE : booking.getUpdatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
        );
    }

    private List<String> suggestionsFor(ChatIntent intent) {
        return switch (intent) {
            case TOUR_SEARCH -> List.of("Tìm tour Đà Lạt 3 ngày 2 đêm", "Tour giá dưới 5 triệu", "Tour phù hợp cho gia đình");
            case PRICE_ADVICE -> List.of("Tôi có 5 triệu nên đi đâu?", "Tìm tour tiết kiệm", "Tour ngắn ngày giá tốt");
            case DESTINATION_SEARCH -> List.of("Địa điểm đẹp ở miền Trung", "Nên đi đâu vào mùa hè?", "Điểm đến ít đông khách");
            case BOOKING_LOOKUP -> List.of("Xem booking của tôi", "Kiểm tra trạng thái đặt tour", "Tôi muốn đổi lịch booking");
            case SUPPORT_REQUEST -> List.of("Tôi cần hỗ trợ đặt tour", "Tôi muốn gặp tư vấn viên", "Hỗ trợ thanh toán");
            default -> List.of("Tìm tour phù hợp", "Tư vấn địa điểm du lịch", "Hỗ trợ đặt tour");
        };
    }

    private Integer durationDays(IntentResult intentResult) {
        Object value = intentResult.getFilters().get("durationDays");
        return value instanceof Integer days ? days : null;
    }

    private String resolveDestinationKeyword(IntentResult intentResult) {
        String location = intentResult.getLocation();
        if (StringUtils.hasText(location) && location.toLowerCase(Locale.ROOT).startsWith("miền")) {
            return null;
        }
        if (StringUtils.hasText(location)) {
            return location;
        }
        return intentResult.getKeyword();
    }

    private String resolveRegion(String location) {
        if (!StringUtils.hasText(location)) {
            return null;
        }
        return location.toLowerCase(Locale.ROOT).startsWith("miền") ? location : null;
    }

    private boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null
                && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken);
    }

    private String money(BigDecimal amount, String currency) {
        if (amount == null) {
            return AiChatMessages.UNKNOWN_VALUE;
        }
        NumberFormat format = NumberFormat.getNumberInstance(Locale.forLanguageTag("vi-VN"));
        return format.format(amount) + " " + (StringUtils.hasText(currency) ? currency : "VNĐ");
    }

    private String durationText(Integer days, Integer nights) {
        if (days == null && nights == null) {
            return AiChatMessages.UNKNOWN_VALUE;
        }
        if (nights == null) {
            return days + " ngày";
        }
        return days + " ngày " + nights + " đêm";
    }

    private String bestTime(Integer fromMonth, Integer toMonth) {
        if (fromMonth == null && toMonth == null) {
            return AiChatMessages.UNKNOWN_VALUE;
        }
        if (fromMonth != null && toMonth != null) {
            return "Tháng " + fromMonth + " đến tháng " + toMonth;
        }
        return fromMonth != null ? "Từ tháng " + fromMonth : "Đến tháng " + toMonth;
    }

    private String safe(String value) {
        return StringUtils.hasText(value) ? value : AiChatMessages.UNKNOWN_VALUE;
    }

    private String joinNonBlank(String... values) {
        return java.util.Arrays.stream(values)
                .filter(StringUtils::hasText)
                .reduce((left, right) -> left + " - " + right)
                .orElse(AiChatMessages.UNKNOWN_VALUE);
    }

    private String joinPrefix(String prefix, String value) {
        return StringUtils.hasText(value) && !AiChatMessages.UNKNOWN_VALUE.equals(value) ? prefix + value : "";
    }

    private int valueOrZero(Integer value) {
        return value == null ? 0 : value;
    }
}

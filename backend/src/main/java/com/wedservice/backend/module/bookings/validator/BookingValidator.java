package com.wedservice.backend.module.bookings.validator;

import com.wedservice.backend.common.exception.BadRequestException;
import com.wedservice.backend.module.bookings.dto.request.BookingProductLineRequest;
import com.wedservice.backend.module.bookings.dto.request.BookingQuoteRequest;
import com.wedservice.backend.module.bookings.dto.request.CreateBookingRequest;
import com.wedservice.backend.module.bookings.dto.request.CreatePassengerRequest;
import com.wedservice.backend.module.tours.entity.TourSchedule;
import com.wedservice.backend.module.tours.entity.TourScheduleStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.function.ToIntFunction;

@Component
public class BookingValidator {

    private static final Set<String> ALLOWED_PASSENGER_TYPES = Set.of("adult", "child", "infant", "senior");
    private static final Set<String> ALLOWED_PASSENGER_GENDERS = Set.of("male", "female", "other", "unknown");

    public void validateCreateRequest(CreateBookingRequest request) {
        validateTravellerCounts(request.getAdults(), request.getChildren(), request.getInfants(), request.getSeniors());
        validateBookingProductLines(request.getBookingProducts());

        int totalTravellers = request.getAdults() + request.getChildren() + request.getInfants() + request.getSeniors();
        validatePassengerManifest(request, totalTravellers);
    }

    public void validateQuoteRequest(BookingQuoteRequest request) {
        validateTravellerCounts(request.getAdults(), request.getChildren(), request.getInfants(), request.getSeniors());
        validateBookingProductLines(request.getBookingProducts());
    }

    public void validateBookingProductLines(List<BookingProductLineRequest> lines) {
        if (lines == null || lines.isEmpty()) {
            return;
        }
        for (BookingProductLineRequest line : lines) {
            if (line == null) {
                throw BadRequestException.i18n("api.error.booking.invalidProductLine");
            }
            if (line.getProductId() == null) {
                throw BadRequestException.i18n("api.error.booking.invalidProductLine");
            }
            if (line.getQuantity() == null || line.getQuantity() < 1) {
                throw BadRequestException.i18n("api.error.booking.invalidProductLine");
            }
        }
    }

    public void validateScheduleForBooking(CreateBookingRequest request, TourSchedule schedule, LocalDateTime now) {
        if (!schedule.getTourId().equals(request.getTourId())) {
            throw BadRequestException.i18n("api.error.booking.scheduleWrongTour");
        }
        if (schedule.getStatus() != TourScheduleStatus.OPEN) {
            throw BadRequestException.i18n("api.error.booking.scheduleNotOpen");
        }
        if (schedule.getBookingOpenAt() != null && now.isBefore(schedule.getBookingOpenAt())) {
            throw BadRequestException.i18n("api.error.booking.windowNotOpen");
        }
        if (schedule.getBookingCloseAt() != null && now.isAfter(schedule.getBookingCloseAt())) {
            throw BadRequestException.i18n("api.error.booking.windowClosed");
        }

        int requestedSeats = request.getAdults() + request.getChildren() + request.getSeniors();
        int bookedSeats = schedule.getBookedSeats() == null ? 0 : schedule.getBookedSeats();
        int capacityTotal = schedule.getCapacityTotal() == null ? 0 : schedule.getCapacityTotal();

        if (requestedSeats <= 0) {
            throw BadRequestException.i18n("api.error.booking.needsSeatTakingTraveller");
        }
        if (capacityTotal > 0 && bookedSeats + requestedSeats > capacityTotal) {
            throw BadRequestException.i18n("api.error.booking.notEnoughSeats");
        }
    }

    public BigDecimal calculateSubtotal(CreateBookingRequest request, TourSchedule schedule) {
        return calculateSubtotal(request.getAdults(), request.getChildren(), request.getInfants(), request.getSeniors(), schedule);
    }

    public BigDecimal calculateSubtotal(BookingQuoteRequest request, TourSchedule schedule) {
        return calculateSubtotal(request.getAdults(), request.getChildren(), request.getInfants(), request.getSeniors(), schedule);
    }

    public BigDecimal calculateSubtotal(int adults, int children, int infants, int seniors, TourSchedule schedule) {
        return multiply(schedule.getAdultPrice(), adults)
                .add(multiply(schedule.getChildPrice(), children))
                .add(multiply(schedule.getInfantPrice(), infants))
                .add(multiply(schedule.getSeniorPrice(), seniors));
    }

    public int calculateSeatCount(int adults, int children, int seniors) {
        return adults + children + seniors;
    }

    public int calculateTravellerCount(int adults, int children, int infants, int seniors) {
        return adults + children + infants + seniors;
    }

    public String normalizePassengerType(String rawValue) {
        if (!StringUtils.hasText(rawValue)) {
            throw BadRequestException.i18n("api.error.booking.passengerTypeRequired");
        }
        String normalized = rawValue.trim().toLowerCase(Locale.ROOT);
        if (!ALLOWED_PASSENGER_TYPES.contains(normalized)) {
            throw BadRequestException.i18n("api.error.booking.invalidPassengerType", rawValue);
        }
        return normalized;
    }

    public String normalizePassengerGender(String rawValue) {
        if (!StringUtils.hasText(rawValue)) {
            return "unknown";
        }
        String normalized = rawValue.trim().toLowerCase(Locale.ROOT);
        if (!ALLOWED_PASSENGER_GENDERS.contains(normalized)) {
            throw BadRequestException.i18n("api.error.booking.invalidPassengerGender", rawValue);
        }
        return normalized;
    }

    public LocalDate parsePassengerDateOfBirth(String rawValue) {
        if (!StringUtils.hasText(rawValue)) {
            return null;
        }
        try {
            return LocalDate.parse(rawValue.trim());
        } catch (DateTimeParseException ex) {
            throw BadRequestException.i18n("api.error.booking.dateOfBirthFormat");
        }
    }

    private void validatePassengerManifest(CreateBookingRequest request, int totalTravellers) {
        List<CreatePassengerRequest> passengers = request.getPassengers();
        if (passengers == null || passengers.isEmpty()) {
            return;
        }
        if (passengers.size() > totalTravellers) {
            throw BadRequestException.i18n("api.error.booking.passengerListTooLarge");
        }

        validatePassengerTypeCount(passengers, request.getAdults(), "adult");
        validatePassengerTypeCount(passengers, request.getChildren(), "child");
        validatePassengerTypeCount(passengers, request.getInfants(), "infant");
        validatePassengerTypeCount(passengers, request.getSeniors(), "senior");
    }

    private void validateTravellerCounts(int adults, int children, int infants, int seniors) {
        if (children < 0 || infants < 0 || seniors < 0) {
            throw BadRequestException.i18n("api.error.booking.passengerCountsNegative");
        }

        int totalTravellers = calculateTravellerCount(adults, children, infants, seniors);
        if (totalTravellers <= 0) {
            throw BadRequestException.i18n("api.error.booking.needsTraveller");
        }
    }

    private void validatePassengerTypeCount(List<CreatePassengerRequest> passengers, int allowedCount, String passengerType) {
        int actualCount = passengers.stream()
                .filter(passenger -> StringUtils.hasText(passenger.getPassengerType()))
                .map(CreatePassengerRequest::getPassengerType)
                .map(value -> value.trim().toLowerCase(Locale.ROOT))
                .filter(passengerType::equals)
                .mapToInt(alwaysOne())
                .sum();

        if (actualCount > allowedCount) {
            throw BadRequestException.i18n("api.error.booking.tooManyPassengerType", passengerType);
        }
    }

    private ToIntFunction<String> alwaysOne() {
        return ignored -> 1;
    }

    private BigDecimal multiply(BigDecimal price, int quantity) {
        BigDecimal safePrice = price == null ? BigDecimal.ZERO : price;
        return safePrice.multiply(BigDecimal.valueOf(quantity));
    }
}

package com.wedservice.backend.module.bookings.service;

import com.wedservice.backend.common.exception.BadRequestException;
import com.wedservice.backend.common.exception.ResourceNotFoundException;
import com.wedservice.backend.common.security.AuthenticatedUserProvider;
import com.wedservice.backend.common.util.DataNormalizer;
import com.wedservice.backend.module.bookings.dto.request.CreateComboBookingRequest;
import com.wedservice.backend.module.bookings.dto.request.CreateFlightBookingRequest;
import com.wedservice.backend.module.bookings.dto.request.CreateHotelBookingRequest;
import com.wedservice.backend.module.bookings.dto.response.ExtendedBookingResponse;
import com.wedservice.backend.module.bookings.entity.BookingPaymentStatus;
import com.wedservice.backend.module.bookings.entity.BookingStatus;
import com.wedservice.backend.module.bookings.entity.ComboBooking;
import com.wedservice.backend.module.bookings.entity.FlightBooking;
import com.wedservice.backend.module.bookings.entity.HotelBooking;
import com.wedservice.backend.module.bookings.repository.ComboBookingRepository;
import com.wedservice.backend.module.bookings.repository.FlightBookingRepository;
import com.wedservice.backend.module.bookings.repository.HotelBookingRepository;
import com.wedservice.backend.module.commerce.entity.ComboPackage;
import com.wedservice.backend.module.commerce.repository.ComboPackageRepository;
import com.wedservice.backend.module.flights.entity.FlightClass;
import com.wedservice.backend.module.flights.repository.FlightClassRepository;
import com.wedservice.backend.module.hotels.entity.HotelRoomInventory;
import com.wedservice.backend.module.hotels.entity.HotelRoomType;
import com.wedservice.backend.module.hotels.repository.HotelRoomInventoryRepository;
import com.wedservice.backend.module.hotels.repository.HotelRoomTypeRepository;
import com.wedservice.backend.module.orders.entity.Order;
import com.wedservice.backend.module.orders.entity.OrderItem;
import com.wedservice.backend.module.orders.entity.OrderItemType;
import com.wedservice.backend.module.orders.entity.OrderStatus;
import com.wedservice.backend.module.orders.repository.OrderItemRepository;
import com.wedservice.backend.module.orders.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExtendedBookingService {

    private final AuthenticatedUserProvider authenticatedUserProvider;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final HotelBookingRepository hotelBookingRepository;
    private final FlightBookingRepository flightBookingRepository;
    private final ComboBookingRepository comboBookingRepository;
    private final HotelRoomTypeRepository hotelRoomTypeRepository;
    private final HotelRoomInventoryRepository hotelRoomInventoryRepository;
    private final FlightClassRepository flightClassRepository;
    private final ComboPackageRepository comboPackageRepository;

    @Transactional
    public ExtendedBookingResponse createHotelBooking(CreateHotelBookingRequest request) {
        HotelRoomType roomType = hotelRoomTypeRepository.findById(request.getRoomTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Room type not found with id: " + request.getRoomTypeId()));
        validateHotelAvailability(request, roomType);
        BigDecimal subtotal = calculateHotelSubtotal(request, roomType);

        UUID userId = authenticatedUserProvider.getRequiredCurrentUserId();
        Order order = createOrder(userId, subtotal, request.getSpecialRequests());

        HotelBooking booking = HotelBooking.builder()
                .bookingCode("HBK" + System.currentTimeMillis())
                .userId(userId)
                .orderId(order.getId())
                .hotelId(request.getHotelId())
                .roomTypeId(request.getRoomTypeId())
                .checkinDate(request.getCheckinDate())
                .checkoutDate(request.getCheckoutDate())
                .rooms(request.getRooms())
                .adults(request.getAdults())
                .children(request.getChildren())
                .status(BookingStatus.PENDING_PAYMENT)
                .paymentStatus(BookingPaymentStatus.UNPAID)
                .contactName(DataNormalizer.normalize(request.getContactName()))
                .contactPhone(DataNormalizer.normalizePhone(request.getContactPhone()))
                .contactEmail(DataNormalizer.normalizeEmail(request.getContactEmail()))
                .subtotalAmount(subtotal)
                .discountAmount(BigDecimal.ZERO)
                .taxAmount(BigDecimal.ZERO)
                .finalAmount(subtotal)
                .currency(roomType.getCurrency())
                .specialRequests(DataNormalizer.normalize(request.getSpecialRequests()))
                .build();
        booking = hotelBookingRepository.save(booking);

        orderItemRepository.save(OrderItem.builder()
                .orderId(order.getId())
                .itemType(OrderItemType.HOTEL_BOOKING)
                .itemRefId(booking.getId())
                .itemName("Hotel booking #" + booking.getBookingCode())
                .quantity(1)
                .unitPrice(subtotal)
                .discountAmount(BigDecimal.ZERO)
                .lineTotal(subtotal)
                .build());

        return toResponse(order, "hotel_booking", booking.getId(), booking.getBookingCode(), booking.getFinalAmount(), booking.getCurrency());
    }

    @Transactional
    public ExtendedBookingResponse createFlightBooking(CreateFlightBookingRequest request) {
        FlightClass flightClass = flightClassRepository.findById(request.getFlightClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Flight class not found with id: " + request.getFlightClassId()));
        if (flightClass.getSeatAvailable() < request.getPassengerCount()) {
            throw BadRequestException.i18n("api.error.flight.notEnoughSeats");
        }
        BigDecimal subtotal = calculateFlightSubtotal(request, flightClass);

        UUID userId = authenticatedUserProvider.getRequiredCurrentUserId();
        Order order = createOrder(userId, subtotal, request.getSpecialRequests());

        FlightBooking booking = FlightBooking.builder()
                .bookingCode("FBK" + System.currentTimeMillis())
                .userId(userId)
                .orderId(order.getId())
                .flightId(request.getFlightId())
                .flightClassId(request.getFlightClassId())
                .departureDate(request.getDepartureDate())
                .tripType(request.getTripType())
                .returnFlightId(request.getReturnFlightId())
                .returnDepartureDate(request.getReturnDepartureDate())
                .passengerCount(request.getPassengerCount())
                .status(BookingStatus.PENDING_PAYMENT)
                .paymentStatus(BookingPaymentStatus.UNPAID)
                .contactName(DataNormalizer.normalize(request.getContactName()))
                .contactPhone(DataNormalizer.normalizePhone(request.getContactPhone()))
                .contactEmail(DataNormalizer.normalizeEmail(request.getContactEmail()))
                .subtotalAmount(subtotal)
                .discountAmount(BigDecimal.ZERO)
                .taxAmount(BigDecimal.ZERO)
                .finalAmount(subtotal)
                .currency(flightClass.getCurrency())
                .specialRequests(DataNormalizer.normalize(request.getSpecialRequests()))
                .build();
        booking = flightBookingRepository.save(booking);

        orderItemRepository.save(OrderItem.builder()
                .orderId(order.getId())
                .itemType(OrderItemType.FLIGHT_BOOKING)
                .itemRefId(booking.getId())
                .itemName("Flight booking #" + booking.getBookingCode())
                .quantity(1)
                .unitPrice(subtotal)
                .discountAmount(BigDecimal.ZERO)
                .lineTotal(subtotal)
                .build());

        return toResponse(order, "flight_booking", booking.getId(), booking.getBookingCode(), booking.getFinalAmount(), booking.getCurrency());
    }

    @Transactional
    public ExtendedBookingResponse createComboBooking(CreateComboBookingRequest request) {
        ComboPackage comboPackage = comboPackageRepository.findById(request.getComboId())
                .orElseThrow(() -> new ResourceNotFoundException("Combo package not found with id: " + request.getComboId()));
        if (!Boolean.TRUE.equals(comboPackage.getIsActive())) {
            throw BadRequestException.i18n("api.error.bookingPricing.comboInactive");
        }
        BigDecimal subtotal = comboPackage.getBasePrice();
        BigDecimal discount = calculateComboDiscount(comboPackage);
        BigDecimal finalAmount = subtotal.subtract(discount).max(BigDecimal.ZERO);

        UUID userId = authenticatedUserProvider.getRequiredCurrentUserId();
        Order order = createOrder(userId, finalAmount, request.getSpecialRequests());

        ComboBooking booking = ComboBooking.builder()
                .bookingCode("CBK" + System.currentTimeMillis())
                .userId(userId)
                .orderId(order.getId())
                .comboId(request.getComboId())
                .travelStartDate(request.getTravelStartDate())
                .travelEndDate(request.getTravelEndDate())
                .selectionSnapshotJson(request.getSelectionSnapshotJson())
                .status(BookingStatus.PENDING_PAYMENT)
                .paymentStatus(BookingPaymentStatus.UNPAID)
                .contactName(DataNormalizer.normalize(request.getContactName()))
                .contactPhone(DataNormalizer.normalizePhone(request.getContactPhone()))
                .contactEmail(DataNormalizer.normalizeEmail(request.getContactEmail()))
                .subtotalAmount(subtotal)
                .discountAmount(discount)
                .taxAmount(BigDecimal.ZERO)
                .finalAmount(finalAmount)
                .currency("VND")
                .specialRequests(DataNormalizer.normalize(request.getSpecialRequests()))
                .build();
        booking = comboBookingRepository.save(booking);

        orderItemRepository.save(OrderItem.builder()
                .orderId(order.getId())
                .itemType(OrderItemType.COMBO_BOOKING)
                .itemRefId(booking.getId())
                .itemName("Combo booking #" + booking.getBookingCode())
                .quantity(1)
                .unitPrice(subtotal)
                .discountAmount(discount)
                .lineTotal(finalAmount)
                .build());

        return toResponse(order, "combo_booking", booking.getId(), booking.getBookingCode(), booking.getFinalAmount(), booking.getCurrency());
    }

    /**
     * Kiem tra ton kho phong theo tung ngay trong khoang luu tru.
     * Dieu kien hop le: moi ngay [checkin, checkout) deu co available_qty >= so phong dat.
     */
    private void validateHotelAvailability(CreateHotelBookingRequest request, HotelRoomType roomType) {
        LocalDate checkinDate = request.getCheckinDate();
        LocalDate checkoutDate = request.getCheckoutDate();
        if (!checkoutDate.isAfter(checkinDate)) {
            throw BadRequestException.i18n("api.error.hotel.invalidDateRange");
        }
        if (!roomType.getHotel().getId().equals(request.getHotelId())) {
            throw BadRequestException.i18n("api.error.hotel.roomTypeMismatch");
        }
        for (LocalDate d = checkinDate; d.isBefore(checkoutDate); d = d.plusDays(1)) {
            HotelRoomInventory inventory = hotelRoomInventoryRepository.findByRoomTypeIdAndStayDate(roomType.getId(), d)
                    .orElseThrow(() -> BadRequestException.i18n("api.error.hotel.inventoryMissing"));
            if (inventory.getAvailableQty() < request.getRooms()) {
                throw BadRequestException.i18n("api.error.hotel.notEnoughRooms");
            }
        }
    }

    /**
     * Tinh gia hotel = don gia phong * so dem * so phong.
     * So dem = checkout - checkin theo ngay, khong tinh ngay checkout.
     */
    private BigDecimal calculateHotelSubtotal(CreateHotelBookingRequest request, HotelRoomType roomType) {
        long nights = request.getCheckinDate().until(request.getCheckoutDate()).getDays();
        if (nights <= 0) {
            throw BadRequestException.i18n("api.error.hotel.invalidDateRange");
        }
        return roomType.getBasePrice()
                .multiply(BigDecimal.valueOf(nights))
                .multiply(BigDecimal.valueOf(request.getRooms()));
    }

    /**
     * Tinh gia flight = (base_price + tax_amount) * so hanh khach.
     */
    private BigDecimal calculateFlightSubtotal(CreateFlightBookingRequest request, FlightClass flightClass) {
        BigDecimal onePassenger = flightClass.getBasePrice().add(flightClass.getTaxAmount());
        return onePassenger.multiply(BigDecimal.valueOf(request.getPassengerCount()));
    }

    /**
     * Tinh giam gia combo theo loai:
     * - percentage: base_price * discount_value / 100
     * - fixed_amount: discount_value
     * Fallback ve discount_amount neu discount_value chua co.
     */
    private BigDecimal calculateComboDiscount(ComboPackage comboPackage) {
        String type = comboPackage.getDiscountType() == null ? "fixed_amount" : comboPackage.getDiscountType();
        BigDecimal value = comboPackage.getDiscountValue() == null ? comboPackage.getDiscountAmount() : comboPackage.getDiscountValue();
        if (value == null) {
            value = BigDecimal.ZERO;
        }
        BigDecimal discount;
        if ("percentage".equalsIgnoreCase(type)) {
            discount = comboPackage.getBasePrice().multiply(value).divide(BigDecimal.valueOf(100));
        } else {
            discount = value;
        }
        if (discount.compareTo(comboPackage.getBasePrice()) > 0) {
            return comboPackage.getBasePrice();
        }
        return discount.max(BigDecimal.ZERO);
    }

    private Order createOrder(UUID userId, BigDecimal finalAmount, String note) {
        return orderRepository.save(Order.builder()
                .orderCode("ORD" + System.currentTimeMillis())
                .userId(userId)
                .status(OrderStatus.PENDING_PAYMENT)
                .paymentStatus(BookingPaymentStatus.UNPAID)
                .orderSource("app")
                .currency("VND")
                .subtotalAmount(finalAmount)
                .discountAmount(BigDecimal.ZERO)
                .voucherDiscountAmount(BigDecimal.ZERO)
                .loyaltyDiscountAmount(BigDecimal.ZERO)
                .addonAmount(BigDecimal.ZERO)
                .taxAmount(BigDecimal.ZERO)
                .finalAmount(finalAmount)
                .note(DataNormalizer.normalize(note))
                .build());
    }

    private ExtendedBookingResponse toResponse(Order order, String type, Long bookingId, String bookingCode, BigDecimal finalAmount, String currency) {
        return ExtendedBookingResponse.builder()
                .orderId(order.getId())
                .orderCode(order.getOrderCode())
                .bookingType(type)
                .bookingId(bookingId)
                .bookingCode(bookingCode)
                .status(BookingStatus.PENDING_PAYMENT.getValue())
                .paymentStatus(BookingPaymentStatus.UNPAID.getValue())
                .finalAmount(finalAmount)
                .currency(currency)
                .build();
    }
}


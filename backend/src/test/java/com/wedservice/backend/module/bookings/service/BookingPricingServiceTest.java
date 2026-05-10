package com.wedservice.backend.module.bookings.service;

import com.wedservice.backend.common.exception.BadRequestException;
import com.wedservice.backend.common.security.AuthenticatedUserProvider;
import com.wedservice.backend.module.bookings.dto.request.BookingProductLineRequest;
import com.wedservice.backend.module.bookings.dto.request.BookingQuoteRequest;
import com.wedservice.backend.module.bookings.dto.response.BookingQuoteResponse;
import com.wedservice.backend.module.bookings.validator.BookingValidator;
import com.wedservice.backend.module.commerce.entity.ComboPackage;
import com.wedservice.backend.module.commerce.entity.Product;
import com.wedservice.backend.module.commerce.entity.ProductType;
import com.wedservice.backend.module.commerce.repository.ComboPackageRepository;
import com.wedservice.backend.module.commerce.repository.ProductRepository;
import com.wedservice.backend.module.promotions.entity.Voucher;
import com.wedservice.backend.module.promotions.entity.VoucherApplicableScope;
import com.wedservice.backend.module.promotions.entity.VoucherDiscountType;
import com.wedservice.backend.module.promotions.entity.VoucherUserClaim;
import com.wedservice.backend.module.promotions.repository.VoucherRepository;
import com.wedservice.backend.module.promotions.repository.VoucherUserClaimRepository;
import com.wedservice.backend.module.tours.entity.Tour;
import com.wedservice.backend.module.tours.entity.TourSchedule;
import com.wedservice.backend.module.tours.entity.TourScheduleStatus;
import com.wedservice.backend.module.tours.repository.TourRepository;
import com.wedservice.backend.module.tours.repository.TourScheduleRepository;
import com.wedservice.backend.module.users.entity.MemberLevel;
import com.wedservice.backend.module.users.entity.Status;
import com.wedservice.backend.module.users.entity.User;
import com.wedservice.backend.module.users.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingPricingServiceTest {

    @Mock
    private TourScheduleRepository tourScheduleRepository;

    @Mock
    private TourRepository tourRepository;

    @Mock
    private ComboPackageRepository comboPackageRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private VoucherRepository voucherRepository;

    @Mock
    private VoucherUserClaimRepository voucherUserClaimRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuthenticatedUserProvider authenticatedUserProvider;

    private BookingPricingService bookingPricingService;

    @BeforeEach
    void setUp() {
        bookingPricingService = new BookingPricingService(
                tourScheduleRepository,
                tourRepository,
                comboPackageRepository,
                productRepository,
                voucherRepository,
                voucherUserClaimRepository,
                userRepository,
                authenticatedUserProvider,
                new BookingValidator()
        );
    }

    @Test
    void quoteBooking_returnsSubtotalWithoutVoucher() {
        UUID userId = UUID.randomUUID();
        when(authenticatedUserProvider.getRequiredCurrentUserId()).thenReturn(userId);
        when(tourScheduleRepository.findById(22L)).thenReturn(Optional.of(openSchedule()));
        when(tourRepository.findById(10L)).thenReturn(Optional.of(Tour.builder().id(10L).build()));

        BookingQuoteResponse response = bookingPricingService.quoteBooking(BookingQuoteRequest.builder()
                .tourId(10L)
                .scheduleId(22L)
                .adults(2)
                .children(1)
                .infants(1)
                .seniors(1)
                .build());

        assertThat(response.getSubtotalAmount()).isEqualByComparingTo("350.00");
        assertThat(response.getVoucherDiscountAmount()).isEqualByComparingTo("0");
        assertThat(response.getAddonAmount()).isEqualByComparingTo("0");
        assertThat(response.getFinalAmount()).isEqualByComparingTo("350.00");
        assertThat(response.getAppliedVoucher()).isNull();
        assertThat(response.getAppliedCombo()).isNull();
    }

    @Test
    void quoteBooking_appliesPercentageVoucherForClaimedUser() {
        UUID userId = UUID.randomUUID();
        Voucher voucher = Voucher.builder()
                .id(5L)
                .code("SPRING10")
                .name("Spring 10")
                .discountType(VoucherDiscountType.PERCENTAGE)
                .discountValue(BigDecimal.TEN)
                .maxDiscountAmount(new BigDecimal("20"))
                .minOrderValue(new BigDecimal("200"))
                .usageLimitPerUser(2)
                .usedCount(0)
                .applicableScope(VoucherApplicableScope.ALL)
                .startAt(LocalDateTime.now().minusDays(1))
                .endAt(LocalDateTime.now().plusDays(1))
                .isActive(true)
                .build();

        when(authenticatedUserProvider.getRequiredCurrentUserId()).thenReturn(userId);
        when(userRepository.findById(userId)).thenReturn(Optional.of(activeUser(userId)));
        when(tourScheduleRepository.findById(22L)).thenReturn(Optional.of(openSchedule()));
        when(tourRepository.findById(10L)).thenReturn(Optional.of(Tour.builder().id(10L).build()));
        when(voucherRepository.findByCodeIgnoreCase("SPRING10")).thenReturn(Optional.of(voucher));
        when(voucherUserClaimRepository.findByVoucherIdAndUserId(5L, userId))
                .thenReturn(Optional.of(VoucherUserClaim.builder().id(9L).voucherId(5L).userId(userId).usedCount(0).build()));

        BookingQuoteResponse response = bookingPricingService.quoteBooking(BookingQuoteRequest.builder()
                .tourId(10L)
                .scheduleId(22L)
                .adults(2)
                .children(1)
                .infants(1)
                .seniors(1)
                .voucherCode(" spring10 ")
                .build());

        assertThat(response.getVoucherDiscountAmount()).isEqualByComparingTo("20.00");
        assertThat(response.getFinalAmount()).isEqualByComparingTo("330.00");
        assertThat(response.getAppliedVoucher().getVoucherCode()).isEqualTo("SPRING10");
    }

    @Test
    void quoteBooking_rejectsVoucherThatWasNotClaimed() {
        UUID userId = UUID.randomUUID();
        Voucher voucher = Voucher.builder()
                .id(5L)
                .code("SPRING10")
                .name("Spring 10")
                .discountType(VoucherDiscountType.PERCENTAGE)
                .discountValue(BigDecimal.TEN)
                .minOrderValue(BigDecimal.ZERO)
                .usageLimitPerUser(1)
                .usedCount(0)
                .applicableScope(VoucherApplicableScope.ALL)
                .startAt(LocalDateTime.now().minusDays(1))
                .endAt(LocalDateTime.now().plusDays(1))
                .isActive(true)
                .build();

        when(authenticatedUserProvider.getRequiredCurrentUserId()).thenReturn(userId);
        when(userRepository.findById(userId)).thenReturn(Optional.of(activeUser(userId)));
        when(tourScheduleRepository.findById(22L)).thenReturn(Optional.of(openSchedule()));
        when(tourRepository.findById(10L)).thenReturn(Optional.of(Tour.builder().id(10L).build()));
        when(voucherRepository.findByCodeIgnoreCase("SPRING10")).thenReturn(Optional.of(voucher));
        when(voucherUserClaimRepository.findByVoucherIdAndUserId(5L, userId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bookingPricingService.quoteBooking(BookingQuoteRequest.builder()
                .tourId(10L)
                .scheduleId(22L)
                .adults(1)
                .voucherCode("SPRING10")
                .build()))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("api.error.bookingPricing.voucherMustBeClaimed");
    }

    @Test
    void quoteBooking_rejectsCashbackVoucherForPayablePricing() {
        UUID userId = UUID.randomUUID();
        Voucher voucher = Voucher.builder()
                .id(5L)
                .code("CASHBACK50")
                .name("Cashback 50")
                .discountType(VoucherDiscountType.CASHBACK)
                .discountValue(new BigDecimal("50000"))
                .minOrderValue(BigDecimal.ZERO)
                .usageLimitPerUser(1)
                .usedCount(0)
                .applicableScope(VoucherApplicableScope.ALL)
                .startAt(LocalDateTime.now().minusDays(1))
                .endAt(LocalDateTime.now().plusDays(1))
                .isActive(true)
                .build();

        when(authenticatedUserProvider.getRequiredCurrentUserId()).thenReturn(userId);
        when(userRepository.findById(userId)).thenReturn(Optional.of(activeUser(userId)));
        when(tourScheduleRepository.findById(22L)).thenReturn(Optional.of(openSchedule()));
        when(tourRepository.findById(10L)).thenReturn(Optional.of(Tour.builder().id(10L).build()));
        when(voucherRepository.findByCodeIgnoreCase("CASHBACK50")).thenReturn(Optional.of(voucher));
        when(voucherUserClaimRepository.findByVoucherIdAndUserId(5L, userId))
                .thenReturn(Optional.of(VoucherUserClaim.builder().id(9L).voucherId(5L).userId(userId).usedCount(0).build()));

        assertThatThrownBy(() -> bookingPricingService.quoteBooking(BookingQuoteRequest.builder()
                .tourId(10L)
                .scheduleId(22L)
                .adults(1)
                .voucherCode("CASHBACK50")
                .build()))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("api.error.bookingPricing.voucherTypeUnsupported");
    }

    @Test
    void quoteBooking_addsComboAddonAndPreservesSnapshot() {
        UUID userId = UUID.randomUUID();
        ComboPackage comboPackage = ComboPackage.builder()
                .id(6L)
                .code("COMBO-001")
                .name("Adventure Combo")
                .basePrice(new BigDecimal("250.00"))
                .discountAmount(new BigDecimal("50.00"))
                .isActive(true)
                .build();

        when(authenticatedUserProvider.getRequiredCurrentUserId()).thenReturn(userId);
        when(tourScheduleRepository.findById(22L)).thenReturn(Optional.of(openSchedule()));
        when(tourRepository.findById(10L)).thenReturn(Optional.of(Tour.builder().id(10L).build()));
        when(comboPackageRepository.findDetailById(6L)).thenReturn(Optional.of(comboPackage));

        BookingQuoteResponse response = bookingPricingService.quoteBooking(BookingQuoteRequest.builder()
                .tourId(10L)
                .scheduleId(22L)
                .adults(2)
                .children(1)
                .infants(1)
                .seniors(1)
                .comboId(6L)
                .build());

        assertThat(response.getDiscountAmount()).isEqualByComparingTo("50.00");
        assertThat(response.getAddonAmount()).isEqualByComparingTo("200.00");
        assertThat(response.getFinalAmount()).isEqualByComparingTo("550.00");
        assertThat(response.getAppliedCombo()).isNotNull();
        assertThat(response.getAppliedCombo().getComboCode()).isEqualTo("COMBO-001");
        assertThat(response.getAppliedCombo().getFinalPrice()).isEqualByComparingTo("200.00");
    }

    @Test
    void quoteBooking_addsStandaloneProductsAndMergesDuplicateLines() {
        UUID userId = UUID.randomUUID();
        Product product = Product.builder()
                .id(3L)
                .sku("SKU3")
                .name("Travel hat")
                .productType(ProductType.GEAR)
                .unitPrice(new BigDecimal("15.00"))
                .stockQty(10)
                .isActive(true)
                .build();

        when(authenticatedUserProvider.getRequiredCurrentUserId()).thenReturn(userId);
        when(tourScheduleRepository.findById(22L)).thenReturn(Optional.of(openSchedule()));
        when(tourRepository.findById(10L)).thenReturn(Optional.of(Tour.builder().id(10L).build()));
        when(productRepository.findAllById(List.of(3L))).thenReturn(List.of(product));

        BookingQuoteResponse response = bookingPricingService.quoteBooking(BookingQuoteRequest.builder()
                .tourId(10L)
                .scheduleId(22L)
                .adults(1)
                .children(0)
                .infants(0)
                .seniors(0)
                .bookingProducts(List.of(
                        BookingProductLineRequest.builder().productId(3L).quantity(2).build(),
                        BookingProductLineRequest.builder().productId(3L).quantity(1).build()
                ))
                .build());

        assertThat(response.getSubtotalAmount()).isEqualByComparingTo("100.00");
        assertThat(response.getProductsAmount()).isEqualByComparingTo("45.00");
        assertThat(response.getAddonAmount()).isEqualByComparingTo("45.00");
        assertThat(response.getFinalAmount()).isEqualByComparingTo("145.00");
        assertThat(response.getAppliedProducts()).hasSize(1);
        assertThat(response.getAppliedProducts().get(0).getQuantity()).isEqualTo(3);
        assertThat(response.getAppliedProducts().get(0).getLineTotal()).isEqualByComparingTo("45.00");
    }

    private User activeUser(UUID userId) {
        return User.builder()
                .id(userId)
                .fullName("Customer One")
                .email("customer@example.com")
                .phone("0909000000")
                .passwordHash("encoded")
                .status(Status.ACTIVE)
                .memberLevel(MemberLevel.GOLD)
                .build();
    }

    private TourSchedule openSchedule() {
        LocalDateTime now = LocalDateTime.now();
        return TourSchedule.builder()
                .id(22L)
                .tourId(10L)
                .departureAt(now.plusDays(10))
                .returnAt(now.plusDays(12))
                .bookingOpenAt(now.minusDays(5))
                .bookingCloseAt(now.plusDays(5))
                .capacityTotal(30)
                .bookedSeats(4)
                .adultPrice(new BigDecimal("100.00"))
                .childPrice(new BigDecimal("60.00"))
                .infantPrice(new BigDecimal("10.00"))
                .seniorPrice(new BigDecimal("80.00"))
                .status(TourScheduleStatus.OPEN)
                .build();
    }
}

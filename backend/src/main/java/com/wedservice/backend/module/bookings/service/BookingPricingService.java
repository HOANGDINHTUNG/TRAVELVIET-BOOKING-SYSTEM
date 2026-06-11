package com.wedservice.backend.module.bookings.service;

import com.wedservice.backend.common.exception.BadRequestException;
import com.wedservice.backend.common.exception.ResourceNotFoundException;
import com.wedservice.backend.common.exception.UnauthorizedException;
import com.wedservice.backend.common.security.AuthenticatedUserProvider;
import com.wedservice.backend.common.util.DataNormalizer;
import com.wedservice.backend.module.bookings.dto.request.BookingProductLineRequest;
import com.wedservice.backend.module.bookings.dto.request.BookingQuoteRequest;
import com.wedservice.backend.module.bookings.dto.response.AppliedComboQuoteResponse;
import com.wedservice.backend.module.bookings.dto.response.AppliedProductQuoteResponse;
import com.wedservice.backend.module.bookings.dto.response.AppliedVoucherQuoteResponse;
import com.wedservice.backend.module.bookings.dto.response.BookingQuoteResponse;
import com.wedservice.backend.module.bookings.validator.BookingValidator;
import com.wedservice.backend.module.commerce.entity.ComboPackage;
import com.wedservice.backend.module.commerce.entity.Product;
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
import com.wedservice.backend.module.tours.repository.TourRepository;
import com.wedservice.backend.module.tours.repository.TourScheduleRepository;
import com.wedservice.backend.module.users.entity.Status;
import com.wedservice.backend.module.users.entity.User;
import com.wedservice.backend.module.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingPricingService {

    private static final BigDecimal ZERO = BigDecimal.ZERO;
    private static final BigDecimal ONE_HUNDRED = BigDecimal.valueOf(100);

    private final TourScheduleRepository tourScheduleRepository;
    private final TourRepository tourRepository;
    private final ComboPackageRepository comboPackageRepository;
    private final ProductRepository productRepository;
    private final VoucherRepository voucherRepository;
    private final VoucherUserClaimRepository voucherUserClaimRepository;
    private final UserRepository userRepository;
    private final AuthenticatedUserProvider authenticatedUserProvider;
    private final BookingValidator bookingValidator;

    @Transactional(readOnly = true)
    public BookingQuoteResponse quoteBooking(BookingQuoteRequest request) {
        return quoteBookingForUser(authenticatedUserProvider.getRequiredCurrentUserId(), request);
    }

    @Transactional(readOnly = true)
    public BookingQuoteResponse quoteBookingForUser(UUID userId, BookingQuoteRequest request) {
        bookingValidator.validateQuoteRequest(request);

        TourSchedule schedule = tourScheduleRepository.findById(request.getScheduleId())
                .orElseThrow(() -> BadRequestException.i18n("api.error.bookingPricing.scheduleNotFound"));
        bookingValidator.validateScheduleForBooking(toCreateLikeRequest(request), schedule, LocalDateTime.now());
        Tour tour = tourRepository.findById(request.getTourId())
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + request.getTourId()));

        BigDecimal subtotalAmount = bookingValidator.calculateSubtotal(request, schedule);
        ComboQuote comboQuote = resolveComboQuote(request.getComboId());
        ProductsQuote productsQuote = resolveProductsQuote(request.getBookingProducts());
        VoucherQuote voucherQuote = resolveVoucherQuote(request.getVoucherCode(), userId, tour, subtotalAmount);
        BigDecimal addonAmount = comboQuote.finalPrice().add(productsQuote.productsAmount());
        BigDecimal finalAmount = subtotalAmount
                .subtract(voucherQuote.voucherDiscountAmount())
                .add(comboQuote.finalPrice())
                .add(productsQuote.productsAmount());

        return BookingQuoteResponse.builder()
                .tourId(request.getTourId())
                .scheduleId(request.getScheduleId())
                .adults(request.getAdults())
                .children(request.getChildren())
                .infants(request.getInfants())
                .seniors(request.getSeniors())
                .seatCount(bookingValidator.calculateSeatCount(request.getAdults(), request.getChildren(), request.getSeniors()))
                .travellerCount(bookingValidator.calculateTravellerCount(
                        request.getAdults(),
                        request.getChildren(),
                        request.getInfants(),
                        request.getSeniors()
                ))
                .subtotalAmount(subtotalAmount)
                .discountAmount(voucherQuote.voucherDiscountAmount().add(comboQuote.discountAmount()))
                .voucherDiscountAmount(voucherQuote.voucherDiscountAmount())
                .loyaltyDiscountAmount(ZERO)
                .addonAmount(addonAmount)
                .productsAmount(productsQuote.productsAmount())
                .taxAmount(ZERO)
                .finalAmount(finalAmount.max(ZERO))
                .currency("VND")
                .appliedVoucher(voucherQuote.appliedVoucher())
                .appliedCombo(comboQuote.appliedCombo())
                .appliedProducts(productsQuote.appliedProducts())
                .build();
    }

    private ProductsQuote resolveProductsQuote(List<BookingProductLineRequest> rawLines) {
        if (rawLines == null || rawLines.isEmpty()) {
            return new ProductsQuote(ZERO, List.of());
        }

        Map<Long, Integer> merged = new LinkedHashMap<>();
        for (BookingProductLineRequest line : rawLines) {
            merged.merge(line.getProductId(), line.getQuantity(), Integer::sum);
        }

        List<Long> ids = new ArrayList<>(merged.keySet());
        List<Product> loaded = productRepository.findAllById(ids);
        if (loaded.size() != ids.size()) {
            throw new ResourceNotFoundException("One or more products were not found");
        }

        Map<Long, Product> byId = new LinkedHashMap<>();
        for (Product p : loaded) {
            byId.put(p.getId(), p);
        }

        List<AppliedProductQuoteResponse> applied = new ArrayList<>();
        BigDecimal productsAmount = ZERO;

        for (Map.Entry<Long, Integer> e : merged.entrySet()) {
            Long productId = e.getKey();
            int qty = e.getValue();
            Product product = byId.get(productId);
            if (product == null) {
                throw new ResourceNotFoundException("Product not found with id: " + productId);
            }
            if (!Boolean.TRUE.equals(product.getIsActive())) {
                throw BadRequestException.i18n("api.error.product.inactive");
            }
            int stock = product.getStockQty() == null ? 0 : product.getStockQty();
            if (stock < qty) {
                throw BadRequestException.i18n("api.error.product.out_of_stock");
            }

            BigDecimal unitPrice = product.getUnitPrice() == null ? ZERO : product.getUnitPrice();
            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(qty)).setScale(2, RoundingMode.HALF_UP);
            productsAmount = productsAmount.add(lineTotal);

            applied.add(AppliedProductQuoteResponse.builder()
                    .productId(product.getId())
                    .sku(product.getSku())
                    .name(product.getName())
                    .quantity(qty)
                    .unitPrice(unitPrice)
                    .lineTotal(lineTotal)
                    .build());
        }

        return new ProductsQuote(productsAmount, applied);
    }

    private ComboQuote resolveComboQuote(Long comboId) {
        if (comboId == null) {
            return new ComboQuote(ZERO, ZERO, null);
        }

        ComboPackage comboPackage = comboPackageRepository.findDetailById(comboId)
                .orElseThrow(() -> new ResourceNotFoundException("Combo package not found with id: " + comboId));

        if (!Boolean.TRUE.equals(comboPackage.getIsActive())) {
            throw BadRequestException.i18n("api.error.bookingPricing.comboInactive");
        }

        BigDecimal computedDiscount = computeComboDiscount(comboPackage);
        BigDecimal finalPrice = comboPackage.getBasePrice().subtract(computedDiscount).max(ZERO);
        AppliedComboQuoteResponse appliedCombo = AppliedComboQuoteResponse.builder()
                .comboId(comboPackage.getId())
                .comboCode(comboPackage.getCode())
                .comboName(comboPackage.getName())
                .unitPrice(comboPackage.getBasePrice())
                .discountAmount(computedDiscount)
                .finalPrice(finalPrice)
                .build();

        return new ComboQuote(computedDiscount, finalPrice, appliedCombo);
    }

    /**
     * Tinh giam gia cho combo theo cau hinh moi:
     * - fixed_amount: giam truc tiep theo discount_value (fallback discount_amount neu null)
     * - percentage: giam theo phan tram tren base_price
     * Sau cung luon chot trong khoang [0, base_price] de tranh am tien.
     */
    private BigDecimal computeComboDiscount(ComboPackage comboPackage) {
        String discountType = comboPackage.getDiscountType() == null ? "fixed_amount" : comboPackage.getDiscountType();
        BigDecimal discountValue = comboPackage.getDiscountValue() == null ? comboPackage.getDiscountAmount() : comboPackage.getDiscountValue();
        if (discountValue == null) {
            discountValue = ZERO;
        }
        BigDecimal discount;
        if ("percentage".equalsIgnoreCase(discountType)) {
            discount = comboPackage.getBasePrice()
                    .multiply(discountValue)
                    .divide(ONE_HUNDRED, 2, RoundingMode.HALF_UP);
        } else {
            discount = discountValue;
        }
        if (discount.compareTo(comboPackage.getBasePrice()) > 0) {
            return comboPackage.getBasePrice();
        }
        return discount.max(ZERO);
    }

    private VoucherQuote resolveVoucherQuote(String rawVoucherCode, UUID userId, Tour tour, BigDecimal subtotalAmount) {
        if (!StringUtils.hasText(rawVoucherCode)) {
            return new VoucherQuote(ZERO, null);
        }

        User user = findActiveUser(userId);
        String voucherCode = normalizeVoucherCode(rawVoucherCode);
        Voucher voucher = voucherRepository.findByCodeIgnoreCase(voucherCode)
                .orElseThrow(() -> new ResourceNotFoundException("Voucher not found with code: " + voucherCode));

        VoucherUserClaim claim = voucherUserClaimRepository.findByVoucherIdAndUserId(voucher.getId(), user.getId())
                .orElseThrow(() -> BadRequestException.i18n("api.error.bookingPricing.voucherMustBeClaimed"));

        validateVoucherForQuote(voucher, claim, user, tour, subtotalAmount);

        BigDecimal discountAmount = calculateVoucherDiscount(voucher, subtotalAmount);
        AppliedVoucherQuoteResponse appliedVoucher = AppliedVoucherQuoteResponse.builder()
                .claimId(claim.getId())
                .voucherId(voucher.getId())
                .voucherCode(voucher.getCode())
                .voucherName(voucher.getName())
                .discountType(voucher.getDiscountType())
                .discountValue(voucher.getDiscountValue())
                .maxDiscountAmount(voucher.getMaxDiscountAmount())
                .build();

        return new VoucherQuote(discountAmount, appliedVoucher);
    }

    private void validateVoucherForQuote(Voucher voucher, VoucherUserClaim claim, User user, Tour tour, BigDecimal subtotalAmount) {
        LocalDateTime now = LocalDateTime.now();

        if (!Boolean.TRUE.equals(voucher.getIsActive())) {
            throw BadRequestException.i18n("api.error.bookingPricing.voucherInactive");
        }
        if (now.isBefore(voucher.getStartAt()) || now.isAfter(voucher.getEndAt())) {
            throw BadRequestException.i18n("api.error.bookingPricing.voucherNotApplicableNow");
        }
        if (voucher.getApplicableMemberLevel() != null && voucher.getApplicableMemberLevel() != user.getMemberLevel()) {
            throw BadRequestException.i18n("api.error.bookingPricing.voucherMemberLevel");
        }
        if (voucher.getUsageLimitTotal() != null && safeInteger(voucher.getUsedCount()) >= voucher.getUsageLimitTotal()) {
            throw BadRequestException.i18n("api.error.bookingPricing.voucherTotalLimit");
        }
        if (voucher.getUsageLimitPerUser() != null && safeInteger(claim.getUsedCount()) >= voucher.getUsageLimitPerUser()) {
            throw BadRequestException.i18n("api.error.bookingPricing.voucherPerUserLimit");
        }
        if (voucher.getMinOrderValue() != null && subtotalAmount.compareTo(voucher.getMinOrderValue()) < 0) {
            throw BadRequestException.i18n("api.error.bookingPricing.voucherMinOrderNotMet");
        }
        if (voucher.getDiscountType() != VoucherDiscountType.PERCENTAGE && voucher.getDiscountType() != VoucherDiscountType.FIXED_AMOUNT) {
            throw BadRequestException.i18n("api.error.bookingPricing.voucherTypeUnsupported");
        }

        if (voucher.getApplicableScope() == VoucherApplicableScope.TOUR) {
            if (!tour.getId().equals(voucher.getApplicableTourId())) {
                throw BadRequestException.i18n("api.error.bookingPricing.voucherNotTour");
            }
        } else if (voucher.getApplicableScope() == VoucherApplicableScope.DESTINATION) {
            boolean valid = false;
            if (tour.getDestinations() != null) {
                valid = tour.getDestinations().stream()
                        .anyMatch(d -> d.getId().equals(voucher.getApplicableDestinationId()));
            }
            if (!valid) {
                throw BadRequestException.i18n("api.error.bookingPricing.voucherNotDestination");
            }
        }
    }

    private BigDecimal calculateVoucherDiscount(Voucher voucher, BigDecimal subtotalAmount) {
        BigDecimal discountAmount;

        if (voucher.getDiscountType() == VoucherDiscountType.PERCENTAGE) {
            discountAmount = subtotalAmount
                    .multiply(voucher.getDiscountValue())
                    .divide(ONE_HUNDRED, 2, java.math.RoundingMode.HALF_UP);
            if (voucher.getMaxDiscountAmount() != null && discountAmount.compareTo(voucher.getMaxDiscountAmount()) > 0) {
                discountAmount = voucher.getMaxDiscountAmount();
            }
        } else {
            discountAmount = voucher.getDiscountValue();
        }

        if (discountAmount.compareTo(subtotalAmount) > 0) {
            return subtotalAmount;
        }

        return discountAmount.max(ZERO);
    }

    private User findActiveUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (user.getStatus() != Status.ACTIVE) {
            throw new UnauthorizedException("Your account is " + user.getStatus().getValue() + ". Please contact support.");
        }

        return user;
    }

    private String normalizeVoucherCode(String rawValue) {
        String normalized = DataNormalizer.normalize(rawValue);
        if (!StringUtils.hasText(normalized)) {
            throw BadRequestException.i18n("api.error.bookingPricing.voucherCodeRequired");
        }
        return normalized.toUpperCase(Locale.ROOT);
    }

    private int safeInteger(Integer value) {
        return value == null ? 0 : value;
    }

    private com.wedservice.backend.module.bookings.dto.request.CreateBookingRequest toCreateLikeRequest(BookingQuoteRequest request) {
        return com.wedservice.backend.module.bookings.dto.request.CreateBookingRequest.builder()
                .tourId(request.getTourId())
                .scheduleId(request.getScheduleId())
                .contactName("quote")
                .contactPhone("0000000000")
                .adults(request.getAdults())
                .children(request.getChildren())
                .infants(request.getInfants())
                .seniors(request.getSeniors())
                .comboId(request.getComboId())
                .bookingProducts(request.getBookingProducts())
                .build();
    }

    private record VoucherQuote(BigDecimal voucherDiscountAmount, AppliedVoucherQuoteResponse appliedVoucher) {
    }

    private record ComboQuote(BigDecimal discountAmount, BigDecimal finalPrice, AppliedComboQuoteResponse appliedCombo) {
    }

    private record ProductsQuote(BigDecimal productsAmount, List<AppliedProductQuoteResponse> appliedProducts) {
    }
}

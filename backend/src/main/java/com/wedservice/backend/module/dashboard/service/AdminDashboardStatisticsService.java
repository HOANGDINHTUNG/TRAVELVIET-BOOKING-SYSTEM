package com.wedservice.backend.module.dashboard.service;

import com.wedservice.backend.module.dashboard.dto.response.AdminDashboardStatisticsResponse;
import com.wedservice.backend.module.dashboard.dto.response.DailyRevenuePointResponse;
import com.wedservice.backend.module.dashboard.dto.response.TopDestinationBookingsResponse;
import com.wedservice.backend.module.dashboard.repository.AdminDashboardStatisticsRepository;
import com.wedservice.backend.module.dashboard.repository.AdminDashboardStatisticsRepository.TopDestinationRow;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminDashboardStatisticsService {

    private static final ZoneId REPORT_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

    private final AdminDashboardStatisticsRepository adminDashboardStatisticsRepository;

    @Transactional(readOnly = true)
    public AdminDashboardStatisticsResponse getStatistics() {
        ZonedDateTime nowZ = ZonedDateTime.now(REPORT_ZONE);
        LocalDate today = nowZ.toLocalDate();
        YearMonth currentYm = YearMonth.from(today);
        YearMonth previousYm = currentYm.minusMonths(1);

        LocalDateTime currentMonthStart = currentYm.atDay(1).atStartOfDay(REPORT_ZONE).toLocalDateTime();
        LocalDateTime currentMonthEndExclusive = currentYm.plusMonths(1).atDay(1).atStartOfDay(REPORT_ZONE).toLocalDateTime();
        LocalDateTime previousMonthStart = previousYm.atDay(1).atStartOfDay(REPORT_ZONE).toLocalDateTime();
        LocalDateTime previousMonthEndExclusive = currentMonthStart;

        long[] counts = adminDashboardStatisticsRepository.countBookingsCreatedInMonthWindows(
                currentMonthStart,
                currentMonthEndExclusive,
                previousMonthStart,
                previousMonthEndExclusive
        );
        long cur = counts[0];
        long prev = counts[1];

        BigDecimal totalPaid = adminDashboardStatisticsRepository.sumFinalAmountForPaidBookings();

        LocalDate sevenDayEnd = today;
        LocalDate sevenDayStart = today.minusDays(6);
        LocalDateTime revenueRangeStart = sevenDayStart.atStartOfDay(REPORT_ZONE).toLocalDateTime();
        LocalDateTime revenueRangeEndExclusive = sevenDayEnd.plusDays(1).atStartOfDay(REPORT_ZONE).toLocalDateTime();
        Map<LocalDate, BigDecimal> revenueByDay = adminDashboardStatisticsRepository.sumPaidPaymentAmountByDay(
                revenueRangeStart,
                revenueRangeEndExclusive
        );

        List<DailyRevenuePointResponse> lastSevenDays = new ArrayList<>(7);
        for (LocalDate d = sevenDayStart; !d.isAfter(sevenDayEnd); d = d.plusDays(1)) {
            lastSevenDays.add(DailyRevenuePointResponse.builder()
                    .date(d)
                    .amount(revenueByDay.getOrDefault(d, BigDecimal.ZERO))
                    .build());
        }

        List<TopDestinationRow> topRows = adminDashboardStatisticsRepository.topDestinationsByBookingCountInCreatedRange(
                currentMonthStart,
                currentMonthEndExclusive,
                5
        );
        List<TopDestinationBookingsResponse> topDestinations = topRows.stream()
                .map(r -> TopDestinationBookingsResponse.builder()
                        .destinationId(r.destinationId())
                        .destinationName(r.destinationName())
                        .destinationCode(r.destinationCode())
                        .bookingCount(r.bookingCount())
                        .build())
                .toList();

        return AdminDashboardStatisticsResponse.builder()
                .bookingsCurrentMonthCount(cur)
                .bookingsPreviousMonthCount(prev)
                .bookingsMonthOverMonthPercentChange(monthOverMonthPercent(cur, prev))
                .totalPaidRevenue(totalPaid)
                .revenueLastSevenDays(lastSevenDays)
                .topDestinationsThisMonth(topDestinations)
                .build();
    }

    private static BigDecimal monthOverMonthPercent(long current, long previous) {
        if (previous == 0L) {
            return current > 0 ? null : BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        }
        return BigDecimal.valueOf(current - previous)
                .multiply(BigDecimal.valueOf(100))
                .divide(BigDecimal.valueOf(previous), 2, RoundingMode.HALF_UP);
    }
}

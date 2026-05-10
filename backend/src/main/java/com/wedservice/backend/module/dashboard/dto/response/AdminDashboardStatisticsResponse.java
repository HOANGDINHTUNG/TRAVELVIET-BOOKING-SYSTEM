package com.wedservice.backend.module.dashboard.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardStatisticsResponse {

    private long bookingsCurrentMonthCount;
    private long bookingsPreviousMonthCount;
    /**
     * Percent change vs previous month: {@code (current - previous) / previous * 100}.
     * {@code null} when previous month count is zero (undefined MoM).
     */
    private BigDecimal bookingsMonthOverMonthPercentChange;

    /** Sum of {@code final_amount} for all non-deleted bookings with {@code payment_status = paid}. */
    private BigDecimal totalPaidRevenue;

    /** Seven calendar days ending today (inclusive), ordered ascending by date. */
    private List<DailyRevenuePointResponse> revenueLastSevenDays;

    /** Up to five destinations with most bookings created in the current month (by {@code bookings.created_at}). */
    private List<TopDestinationBookingsResponse> topDestinationsThisMonth;
}

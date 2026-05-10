package com.wedservice.backend.module.dashboard.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Read-only native aggregates for admin dashboard (MySQL). Batched queries, no N+1.
 */
@Repository
@RequiredArgsConstructor
public class AdminDashboardStatisticsRepository {

    private final EntityManager entityManager;

    /**
     * @return long[0] = current month count, long[1] = previous month count (by {@code bookings.created_at})
     */
    public long[] countBookingsCreatedInMonthWindows(
            LocalDateTime currentMonthStart,
            LocalDateTime currentMonthEndExclusive,
            LocalDateTime previousMonthStart,
            LocalDateTime previousMonthEndExclusive
    ) {
        String sql = """
                SELECT
                    COALESCE(SUM(CASE WHEN b.created_at >= :curStart AND b.created_at < :curEnd THEN 1 ELSE 0 END), 0),
                    COALESCE(SUM(CASE WHEN b.created_at >= :prevStart AND b.created_at < :prevEnd THEN 1 ELSE 0 END), 0)
                FROM bookings b
                WHERE b.deleted_at IS NULL
                """;
        Query query = entityManager.createNativeQuery(sql)
                .setParameter("curStart", Timestamp.valueOf(currentMonthStart))
                .setParameter("curEnd", Timestamp.valueOf(currentMonthEndExclusive))
                .setParameter("prevStart", Timestamp.valueOf(previousMonthStart))
                .setParameter("prevEnd", Timestamp.valueOf(previousMonthEndExclusive));
        Object[] row = (Object[]) query.getSingleResult();
        return new long[]{toLong(row[0]), toLong(row[1])};
    }

    public BigDecimal sumFinalAmountForPaidBookings() {
        String sql = """
                SELECT COALESCE(SUM(b.final_amount), 0)
                FROM bookings b
                WHERE b.deleted_at IS NULL
                  AND b.payment_status = 'paid'
                """;
        Object single = entityManager.createNativeQuery(sql).getSingleResult();
        return toBigDecimal(single);
    }

    /**
     * Paid cash-in by calendar day (payment row). Uses {@code COALESCE(p.paid_at, p.updated_at)} for the day bucket.
     */
    public Map<LocalDate, BigDecimal> sumPaidPaymentAmountByDay(
            LocalDateTime rangeStartInclusive,
            LocalDateTime rangeEndExclusive
    ) {
        String sql = """
                SELECT DATE(COALESCE(p.paid_at, p.updated_at)) AS revenue_day,
                       COALESCE(SUM(p.amount), 0) AS revenue
                FROM payments p
                INNER JOIN bookings b ON b.id = p.booking_id
                    AND b.deleted_at IS NULL
                    AND b.payment_status = 'paid'
                WHERE p.deleted_at IS NULL
                  AND p.status = 'paid'
                  AND COALESCE(p.paid_at, p.updated_at) >= :start
                  AND COALESCE(p.paid_at, p.updated_at) < :endExclusive
                GROUP BY revenue_day
                ORDER BY revenue_day ASC
                """;
        @SuppressWarnings("unchecked")
        List<Object[]> rows = entityManager.createNativeQuery(sql)
                .setParameter("start", Timestamp.valueOf(rangeStartInclusive))
                .setParameter("endExclusive", Timestamp.valueOf(rangeEndExclusive))
                .getResultList();

        Map<LocalDate, BigDecimal> map = new LinkedHashMap<>();
        for (Object[] r : rows) {
            LocalDate day = ((Date) r[0]).toLocalDate();
            map.put(day, toBigDecimal(r[1]));
        }
        return map;
    }

    public List<TopDestinationRow> topDestinationsByBookingCountInCreatedRange(
            LocalDateTime monthStartInclusive,
            LocalDateTime monthEndExclusive,
            int limit
    ) {
        String sql = """
                SELECT d.id, d.name, d.code, COUNT(b.id) AS booking_count
                FROM bookings b
                INNER JOIN tours t ON t.id = b.tour_id AND t.deleted_at IS NULL
                INNER JOIN destinations d ON d.id = t.destination_id AND d.deleted_at IS NULL
                WHERE b.deleted_at IS NULL
                  AND b.created_at >= :monthStart
                  AND b.created_at < :monthEndExclusive
                GROUP BY d.id, d.name, d.code
                ORDER BY booking_count DESC
                LIMIT :lim
                """;
        @SuppressWarnings("unchecked")
        List<Object[]> rows = entityManager.createNativeQuery(sql)
                .setParameter("monthStart", Timestamp.valueOf(monthStartInclusive))
                .setParameter("monthEndExclusive", Timestamp.valueOf(monthEndExclusive))
                .setParameter("lim", limit)
                .getResultList();

        List<TopDestinationRow> out = new ArrayList<>(rows.size());
        for (Object[] r : rows) {
            out.add(new TopDestinationRow(
                    toLong(r[0]),
                    r[1] != null ? r[1].toString() : null,
                    r[2] != null ? r[2].toString() : null,
                    toLong(r[3])
            ));
        }
        return out;
    }

    private static long toLong(Object o) {
        if (o == null) {
            return 0L;
        }
        if (o instanceof Number n) {
            return n.longValue();
        }
        return Long.parseLong(o.toString());
    }

    private static BigDecimal toBigDecimal(Object o) {
        if (o == null) {
            return BigDecimal.ZERO;
        }
        if (o instanceof BigDecimal bd) {
            return bd;
        }
        if (o instanceof Number n) {
            return BigDecimal.valueOf(n.doubleValue());
        }
        return new BigDecimal(o.toString());
    }

    public record TopDestinationRow(long destinationId, String destinationName, String destinationCode, long bookingCount) {
    }
}

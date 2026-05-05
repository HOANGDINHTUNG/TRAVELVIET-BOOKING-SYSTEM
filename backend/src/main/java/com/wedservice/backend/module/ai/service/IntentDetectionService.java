package com.wedservice.backend.module.ai.service;

import com.wedservice.backend.module.ai.dto.IntentResult;
import com.wedservice.backend.module.ai.enums.ChatIntent;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class IntentDetectionService {
    private static final Pattern CODE_PATTERN = Pattern.compile("\\b[A-Z]{2,8}\\d{3,}\\b");
    private static final Pattern ID_PATTERN = Pattern.compile("\\b(?:id|ma|mã)\\s*[:#-]?\\s*(\\d{1,12})\\b", Pattern.CASE_INSENSITIVE);
    private static final Pattern DURATION_PATTERN = Pattern.compile("(\\d{1,2})\\s*ngay(?:\\s*(\\d{1,2})\\s*dem)?");
    private static final Pattern PRICE_RANGE_PATTERN = Pattern.compile("(?:tu|khoang tu)\\s*(\\d+(?:[\\.,]\\d+)?)\\s*(trieu|tr|k|nghin|ngan)?\\s*(?:den|toi|-)\\s*(\\d+(?:[\\.,]\\d+)?)\\s*(trieu|tr|k|nghin|ngan)?");
    private static final Pattern MAX_PRICE_PATTERN = Pattern.compile("(?:duoi|khong qua|toi da|nho hon|<=)\\s*(\\d+(?:[\\.,]\\d+)?)\\s*(trieu|tr|k|nghin|ngan)?");
    private static final Pattern MIN_PRICE_PATTERN = Pattern.compile("(?:tren|it nhat|>=)\\s*(\\d+(?:[\\.,]\\d+)?)\\s*(trieu|tr|k|nghin|ngan)?");
    private static final Pattern BUDGET_PRICE_PATTERN = Pattern.compile("\\b(\\d+(?:[\\.,]\\d+)?)\\s*(trieu|tr|k|nghin|ngan)\\b");

    private static final Map<String, String> KNOWN_LOCATIONS = new LinkedHashMap<>();

    static {
        KNOWN_LOCATIONS.put("da lat", "Đà Lạt");
        KNOWN_LOCATIONS.put("nha trang", "Nha Trang");
        KNOWN_LOCATIONS.put("da nang", "Đà Nẵng");
        KNOWN_LOCATIONS.put("hoi an", "Hội An");
        KNOWN_LOCATIONS.put("hue", "Huế");
        KNOWN_LOCATIONS.put("ha noi", "Hà Nội");
        KNOWN_LOCATIONS.put("sapa", "Sa Pa");
        KNOWN_LOCATIONS.put("sa pa", "Sa Pa");
        KNOWN_LOCATIONS.put("phu quoc", "Phú Quốc");
        KNOWN_LOCATIONS.put("quy nhon", "Quy Nhơn");
        KNOWN_LOCATIONS.put("ha long", "Hạ Long");
        KNOWN_LOCATIONS.put("can tho", "Cần Thơ");
        KNOWN_LOCATIONS.put("mien trung", "Miền Trung");
        KNOWN_LOCATIONS.put("mien bac", "Miền Bắc");
        KNOWN_LOCATIONS.put("mien nam", "Miền Nam");
        KNOWN_LOCATIONS.put("tay nguyen", "Tây Nguyên");
    }

    public IntentResult detect(String message) {
        String original = StringUtils.hasText(message) ? message.trim() : "";
        String text = normalize(original);

        IntentResult result = IntentResult.builder()
                .location(extractLocation(text))
                .duration(extractDuration(text))
                .trackingCode(extractTrackingCode(original))
                .id(extractId(text))
                .build();

        extractPriceRange(text, result);
        if (StringUtils.hasText(result.getLocation())) {
            result.setKeyword(result.getLocation());
            result.getFilters().put("location", result.getLocation());
        }
        if (StringUtils.hasText(result.getDuration())) {
            result.getFilters().put("duration", result.getDuration());
            Integer durationDays = extractDurationDays(text);
            if (durationDays != null) {
                result.getFilters().put("durationDays", durationDays);
            }
        }

        result.setIntent(resolveIntent(text, result));
        if (!StringUtils.hasText(result.getKeyword()) && result.getIntent() == ChatIntent.DESTINATION_SEARCH) {
            result.setKeyword(extractDestinationKeyword(text));
        }
        return result;
    }

    private ChatIntent resolveIntent(String text, IntentResult result) {
        if (containsAny(text, "nhiet do", "do am", "va dap", "rung lac", "gps", "cam bien")) {
            return ChatIntent.SENSOR_STATUS;
        }
        if (containsAny(text, "smartbox", "hop hang", "hop thong minh")) {
            return ChatIntent.SMARTBOX_STATUS;
        }
        if (containsAny(text, "don hang", "ma don", "order")) {
            return ChatIntent.ORDER_TRACKING;
        }
        if (containsAny(text, "van chuyen", "shipment", "giao hang", "tracking", "dang o dau")) {
            return ChatIntent.SHIPMENT_TRACKING;
        }
        if (containsAny(text, "booking", "dat cho", "dat tour", "ve cua toi", "lich dat", "ma booking")) {
            return ChatIntent.BOOKING_LOOKUP;
        }
        if (containsAny(text, "ho tro", "khieu nai", "lien he", "tu van vien", "cham soc khach hang")) {
            return ChatIntent.SUPPORT_REQUEST;
        }
        if (looksLikePriceAdvice(text, result)) {
            return ChatIntent.PRICE_ADVICE;
        }
        if (containsAny(text, "dia diem", "nen di dau", "tham quan", "check-in", "checkin", "du lich o dau", "danh lam", "khu du lich")) {
            return ChatIntent.DESTINATION_SEARCH;
        }
        if (containsAny(text, "tour", "du lich", "lich trinh", "combo", "gia tour")
                || looksLikeTripSearch(text, result)) {
            return ChatIntent.TOUR_SEARCH;
        }
        if (containsAny(text, "hoi dap", "faq", "cau hoi thuong gap", "huong dan")) {
            return ChatIntent.GENERAL_FAQ;
        }
        return ChatIntent.UNKNOWN;
    }

    private boolean looksLikePriceAdvice(String text, IntentResult result) {
        return result.getMaxPrice() != null
                && containsAny(text, "ngan sach", "duoi", "khoang", "trieu", "gia re", "tiet kiem", "co", "nen di dau");
    }

    private boolean looksLikeTripSearch(String text, IntentResult result) {
        return (StringUtils.hasText(result.getLocation()) || StringUtils.hasText(result.getDuration()))
                && containsAny(text, "muon di", "can tim", "tim tour", "tu van", "cho toi", "gia");
    }

    private String normalize(String value) {
        String lower = value == null ? "" : value.toLowerCase(Locale.ROOT).trim();
        String normalized = Normalizer.normalize(lower, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .replace('đ', 'd')
                .replace('Đ', 'D');
        return normalized.replaceAll("\\s+", " ");
    }

    private boolean containsAny(String text, String... values) {
        for (String value : values) {
            if (text.contains(normalize(value))) {
                return true;
            }
        }
        return false;
    }

    private String extractLocation(String normalizedText) {
        for (Map.Entry<String, String> entry : KNOWN_LOCATIONS.entrySet()) {
            if (normalizedText.contains(entry.getKey())) {
                return entry.getValue();
            }
        }
        return null;
    }

    private String extractDestinationKeyword(String normalizedText) {
        if (normalizedText.contains("bien")) {
            return "biển";
        }
        if (normalizedText.contains("nui")) {
            return "núi";
        }
        if (normalizedText.contains("mien trung")) {
            return "Miền Trung";
        }
        return null;
    }

    private String extractDuration(String normalizedText) {
        Matcher matcher = DURATION_PATTERN.matcher(normalizedText);
        if (!matcher.find()) {
            return null;
        }
        String days = matcher.group(1);
        String nights = matcher.group(2);
        return nights == null ? days + " ngày" : days + " ngày " + nights + " đêm";
    }

    private Integer extractDurationDays(String normalizedText) {
        Matcher matcher = DURATION_PATTERN.matcher(normalizedText);
        if (!matcher.find()) {
            return null;
        }
        return Integer.parseInt(matcher.group(1));
    }

    private String extractTrackingCode(String original) {
        Matcher matcher = CODE_PATTERN.matcher(original == null ? "" : original.toUpperCase(Locale.ROOT));
        return matcher.find() ? matcher.group() : null;
    }

    private Long extractId(String normalizedText) {
        Matcher matcher = ID_PATTERN.matcher(normalizedText);
        if (!matcher.find()) {
            return null;
        }
        try {
            return Long.parseLong(matcher.group(1));
        } catch (NumberFormatException ignored) {
            return null;
        }
    }

    private void extractPriceRange(String normalizedText, IntentResult result) {
        Matcher rangeMatcher = PRICE_RANGE_PATTERN.matcher(normalizedText);
        if (rangeMatcher.find()) {
            String maxUnit = rangeMatcher.group(4);
            String minUnit = rangeMatcher.group(2) == null ? maxUnit : rangeMatcher.group(2);
            result.setMinPrice(toMoney(rangeMatcher.group(1), minUnit));
            result.setMaxPrice(toMoney(rangeMatcher.group(3), maxUnit));
            return;
        }

        Matcher maxMatcher = MAX_PRICE_PATTERN.matcher(normalizedText);
        if (maxMatcher.find()) {
            result.setMaxPrice(toMoney(maxMatcher.group(1), maxMatcher.group(2)));
        }

        Matcher minMatcher = MIN_PRICE_PATTERN.matcher(normalizedText);
        if (minMatcher.find()) {
            result.setMinPrice(toMoney(minMatcher.group(1), minMatcher.group(2)));
        }

        if (result.getMaxPrice() == null && result.getMinPrice() == null
                && containsAny(normalizedText, "ngan sach", "co", "khoang", "toi co", "gia")) {
            Matcher budgetMatcher = BUDGET_PRICE_PATTERN.matcher(normalizedText);
            if (budgetMatcher.find()) {
                result.setMaxPrice(toMoney(budgetMatcher.group(1), budgetMatcher.group(2)));
            }
        }
    }

    private BigDecimal toMoney(String number, String unit) {
        if (!StringUtils.hasText(number)) {
            return null;
        }
        BigDecimal value = new BigDecimal(number.replace(',', '.'));
        String normalizedUnit = normalize(unit);
        if (normalizedUnit.equals("trieu") || normalizedUnit.equals("tr")) {
            return value.multiply(BigDecimal.valueOf(1_000_000L));
        }
        if (normalizedUnit.equals("k") || normalizedUnit.equals("nghin") || normalizedUnit.equals("ngan")) {
            return value.multiply(BigDecimal.valueOf(1_000L));
        }
        return value;
    }
}

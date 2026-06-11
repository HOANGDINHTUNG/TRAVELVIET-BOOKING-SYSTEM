package com.wedservice.backend.module.tours.cache;

import com.wedservice.backend.module.tours.dto.request.TourSearchRequest;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * Stable cache keys for {@link com.wedservice.backend.module.tours.service.query.impl.TourQueryServiceImpl#searchTours}
 * (public catalog). Avoids using {@link TourSearchRequest} object identity / default {@code hashCode}.
 */
@Component("tourSearchCacheKeyGenerator")
public class TourSearchCacheKeyGenerator implements KeyGenerator {

    @Override
    public Object generate(Object target, Method method, Object... params) {
        if (params == null || params.length == 0 || !(params[0] instanceof TourSearchRequest request)) {
            return "tourSearch|empty|loc=" + LocaleContextHolder.getLocale().toLanguageTag();
        }
        return "tourSearch|public|"
                + buildKeyBody(request)
                + "|loc=" + LocaleContextHolder.getLocale().toLanguageTag();
    }

    static String buildKeyBody(TourSearchRequest request) {
        StringBuilder sb = new StringBuilder(256);
        append(sb, "dIds", request.getDestinationIds() != null ? request.getDestinationIds().hashCode() : null);
        append(sb, "dSub", request.getDestinationSubtree());
        append(sb, "dCc", blankToEmpty(request.getDestinationCountryCode()));
        append(sb, "dom", request.getDomesticOnly());
        append(sb, "intl", request.getInternationalOnly());
        append(sb, "kw", blankToEmpty(request.getKeyword()));
        append(sb, "tagIds", joinSortedLongs(request.getTagIds()));
        append(sb, "tagCodes", joinSortedCodes(request.getTagCodes()));
        append(sb, "minP", bdKey(request.getMinPrice()));
        append(sb, "maxP", bdKey(request.getMaxPrice()));
        append(sb, "tm", request.getTravelMonth());
        append(sb, "feat", request.getFeaturedOnly());
        append(sb, "stu", request.getStudentFriendlyOnly());
        append(sb, "fam", request.getFamilyFriendlyOnly());
        append(sb, "sen", request.getSeniorFriendlyOnly());
        append(sb, "diff", request.getDifficultyLevel());
        append(sb, "act", request.getActivityLevel());
        append(sb, "minDur", request.getMinDurationDays());
        append(sb, "maxDur", request.getMaxDurationDays());
        append(sb, "age", request.getTravellerAge());
        append(sb, "grp", request.getGroupSize());
        append(sb, "trMode", blankToEmpty(request.getTripMode()));
        append(sb, "trType", blankToEmpty(request.getTransportType()));
        append(sb, "minR", bdKey(request.getMinRating()));
        append(sb, "sort", blankToEmpty(request.getSortBy()) + ":" + blankToEmpty(request.getSortDir()));
        append(sb, "pg", request.getPage());
        append(sb, "sz", request.getSize());
        return sb.toString();
    }

    private static void append(StringBuilder sb, String k, Object v) {
        sb.append(k).append('=');
        if (v == null) {
            sb.append('_');
        } else {
            sb.append(v);
        }
        sb.append('|');
    }

    private static String blankToEmpty(String s) {
        return StringUtils.hasText(s) ? s.trim() : "";
    }

    private static String joinSortedLongs(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return "";
        }
        return ids.stream()
                .filter(Objects::nonNull)
                .sorted()
                .map(String::valueOf)
                .collect(Collectors.joining(","));
    }

    private static String joinSortedCodes(List<String> codes) {
        if (codes == null || codes.isEmpty()) {
            return "";
        }
        return codes.stream()
                .filter(StringUtils::hasText)
                .map(s -> s.trim().toUpperCase())
                .sorted()
                .collect(Collectors.joining(","));
    }

    private static String bdKey(BigDecimal bd) {
        if (bd == null) {
            return "";
        }
        return bd.stripTrailingZeros().toPlainString();
    }
}

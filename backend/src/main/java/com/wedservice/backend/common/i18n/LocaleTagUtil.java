package com.wedservice.backend.common.i18n;

import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.util.StringUtils;

import java.util.Locale;

/**
 * Normalizes {@link Locale} to a short language tag stored in translation tables (e.g. {@code en}, {@code vi}).
 */
public final class LocaleTagUtil {

    private LocaleTagUtil() {
    }

    public static String currentLanguageTag() {
        return normalizeLanguageTag(LocaleContextHolder.getLocale());
    }

    public static String normalizeLanguageTag(Locale locale) {
        if (locale == null) {
            return "vi";
        }
        String lang = locale.getLanguage();
        if (!StringUtils.hasText(lang)) {
            return "vi";
        }
        return lang.toLowerCase(Locale.ROOT);
    }
}

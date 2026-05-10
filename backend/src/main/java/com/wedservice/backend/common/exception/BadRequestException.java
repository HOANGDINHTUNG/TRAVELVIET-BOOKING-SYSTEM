package com.wedservice.backend.common.exception;

import org.springframework.lang.Nullable;

import java.util.Arrays;

/**
 * Business-layer bad request. Prefer {@link #i18n(String, Object...)} with {@code api.*} keys
 * resolved via {@link org.springframework.context.MessageSource}; legacy {@link #BadRequestException(String)}
 * keeps the string as a literal API message when it is not an {@code api.*} / {@code validation.*} key.
 */
public class BadRequestException extends RuntimeException {

    private final Object[] i18nArgs;
    private final boolean i18n;

    public BadRequestException(String messageOrKey) {
        super(messageOrKey);
        this.i18nArgs = null;
        this.i18n = false;
    }

    private BadRequestException(String messageKey, Object[] args) {
        super(messageKey);
        this.i18nArgs = args;
        this.i18n = true;
    }

    public static BadRequestException i18n(String messageKey, Object... args) {
        if (args == null || args.length == 0) {
            return new BadRequestException(messageKey, new Object[0]);
        }
        return new BadRequestException(messageKey, Arrays.copyOf(args, args.length));
    }

    public boolean isI18n() {
        return i18n;
    }

    /**
     * Arguments for {@link org.springframework.context.MessageSource#getMessage(String, Object[], java.util.Locale)}.
     * {@code null} when not created via {@link #i18n(String, Object...)}.
     */
    @Nullable
    public Object[] getI18nArgs() {
        return i18nArgs;
    }
}

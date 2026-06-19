package com.wedservice.backend.common.exception;

import org.jspecify.annotations.Nullable;

import java.util.Arrays;

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
    
    @Nullable
    public Object[] getI18nArgs() {
        return i18nArgs;
    }
}

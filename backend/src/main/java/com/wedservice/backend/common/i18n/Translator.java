package com.wedservice.backend.common.i18n;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

/**
 * Resolves message keys using the active request locale ({@code Accept-Language}).
 */
@Component
public class Translator {

    private static MessageSource messageSource;

    @Autowired
    public Translator(MessageSource messageSource) {
        Translator.messageSource = messageSource;
    }

    /**
     * @param msgCode message key in {@code i18n/messages_*.properties}
     */
    public static String toLocale(String msgCode) {
        return toLocale(msgCode, new Object[0]);
    }

    /**
     * @param msgCode message key in {@code i18n/messages_*.properties}
     */
    public static String toLocale(String msgCode, Object... args) {
        if (messageSource == null) {
            return msgCode;
        }
        return messageSource.getMessage(msgCode, args, LocaleContextHolder.getLocale());
    }
}

package com.wedservice.backend.common.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.lang.Nullable;
import org.springframework.context.NoSuchMessageException;
import org.springframework.util.StringUtils;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

// Bộ chuyển đổi exception tập trung thành JSON lỗi thống nhất cho toàn API.

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    private final MessageSource messageSource;

    public GlobalExceptionHandler(@Nullable MessageSource messageSource) {
        this.messageSource = messageSource != null ? messageSource : createDefaultMessageSource();
    }

    /**
     * MockMvc tests without a Spring {@link MessageSource} bean.
     */
    public static GlobalExceptionHandler standalone() {
        return new GlobalExceptionHandler(null);
    }

    private static MessageSource createDefaultMessageSource() {
        ReloadableResourceBundleMessageSource source = new ReloadableResourceBundleMessageSource();
        source.setBasenames("classpath:i18n/messages", "classpath:i18n/business");
        source.setDefaultEncoding(StandardCharsets.UTF_8.name());
        source.setFallbackToSystemLocale(false);
        source.setUseCodeAsDefaultMessage(true);
        return source;
    }

    private String message(String code, Object... args) {
        return messageSource.getMessage(code, args, LocaleContextHolder.getLocale());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex) {
        log.debug("Resource not found: {}", ex.getMessage());
        String body = resolveOptionalI18nKeyOrElse(ex.getMessage(), "api.error.notfound");
        return buildErrorResponse(HttpStatus.NOT_FOUND, body, "RESOURCE_NOT_FOUND", null);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
        return buildValidationResponse(ex.getBindingResult().getFieldErrors());
    }

    @ExceptionHandler(BindException.class)
    public ResponseEntity<ErrorResponse> handleBindException(BindException ex) {
        return buildValidationResponse(ex.getBindingResult().getFieldErrors());
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolation(ConstraintViolationException ex) {
        Map<String, String> errors = new LinkedHashMap<>();

        for (ConstraintViolation<?> violation : ex.getConstraintViolations()) {
            String propertyPath = violation.getPropertyPath() == null
                    ? "request"
                    : violation.getPropertyPath().toString();
            String fieldName = propertyPath.contains(".")
                    ? propertyPath.substring(propertyPath.lastIndexOf('.') + 1)
                    : propertyPath;
            errors.put(fieldName, resolveConstraintViolationMessage(violation, fieldName));
        }

        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                message("api.error.validation"),
                "VALIDATION_ERROR",
                errors
        );
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String requiredType = ex.getRequiredType() == null ? "expected type" : ex.getRequiredType().getSimpleName();
        String detail = message(
                "api.error.invalidParameterDetail",
                ex.getName(),
                String.valueOf(ex.getValue()),
                requiredType
        );
        Map<String, String> errors = new LinkedHashMap<>();
        errors.put(ex.getName(), detail);
        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                message("api.error.invalidParameter"),
                "INVALID_PARAMETER",
                errors
        );
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                message("api.error.invalidRequestBody"),
                "INVALID_REQUEST_BODY",
                null
        );
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ErrorResponse> handleHttpMediaTypeNotSupported(HttpMediaTypeNotSupportedException ex) {
        String contentType = ex.getContentType() == null ? "" : ex.getContentType().toString();
        String msg = message("api.error.unsupportedMediaType", contentType);
        return buildErrorResponse(
                HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                msg,
                "UNSUPPORTED_MEDIA_TYPE",
                null
        );
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(BadRequestException ex) {
        String body = resolveBadRequestMessage(ex);
        return buildErrorResponse(HttpStatus.BAD_REQUEST, body, "BAD_REQUEST", null);
    }

    private String resolveBadRequestMessage(BadRequestException ex) {
        String raw = ex.getMessage();
        if (!StringUtils.hasText(raw)) {
            return message("api.error.badRequest");
        }
        if (looksLikeMessageKey(raw)) {
            Object[] args = ex.isI18n() ? ex.getI18nArgs() : null;
            try {
                return messageSource.getMessage(raw, args, LocaleContextHolder.getLocale());
            } catch (NoSuchMessageException e) {
                log.warn("Missing message key: {}", raw);
                return message("api.error.badRequest");
            }
        }
        return raw;
    }

    @ExceptionHandler(ExternalServiceException.class)
    public ResponseEntity<ErrorResponse> handleExternalService(ExternalServiceException ex) {
        String body = resolveOptionalI18nKeyOrLiteral(ex.getMessage(), "api.error.externalService");
        return buildErrorResponse(HttpStatus.BAD_GATEWAY, body, "EXTERNAL_SERVICE_ERROR", null);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedException ex) {
        String body = resolveOptionalI18nKeyOrLiteral(ex.getMessage(), "api.error.unauthorized");
        return buildErrorResponse(HttpStatus.UNAUTHORIZED, body, "UNAUTHORIZED", null);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthentication(AuthenticationException ex) {
        String msg = ex instanceof DisabledException
                ? message("api.error.unauthorized.inactive")
                : message("api.error.unauthorized.invalidLogin");

        return buildErrorResponse(HttpStatus.UNAUTHORIZED, msg, "UNAUTHORIZED", null);
    }

    @ExceptionHandler({AccessDeniedException.class, AuthorizationDeniedException.class})
    public ResponseEntity<ErrorResponse> handleAccessDenied(Exception ex) {
        return buildErrorResponse(
                HttpStatus.FORBIDDEN,
                message("api.error.forbidden"),
                "FORBIDDEN",
                null
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobal(Exception ex) {
        log.error("Unhandled exception: {} - {}", ex.getClass().getSimpleName(), ex.getMessage(), ex);
        return buildErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                message("api.error.internal"),
                "INTERNAL_SERVER_ERROR",
                null
        );
    }

    /**
     * If {@code raw} looks like an i18n key ({@code api.*} / {@code validation.*}), resolve via {@link MessageSource};
     * otherwise return {@code fallbackKey} message.
     */
    private String resolveOptionalI18nKeyOrElse(String raw, String fallbackKey) {
        if (looksLikeMessageKey(raw)) {
            try {
                return messageSource.getMessage(raw, null, LocaleContextHolder.getLocale());
            } catch (NoSuchMessageException e) {
                log.debug("Missing message key: {}", raw);
            }
        }
        return message(fallbackKey);
    }

    /**
     * If {@code raw} is a message key, resolve it; if blank use {@code fallbackKey}; else use {@code raw} as literal (legacy services).
     */
    private String resolveOptionalI18nKeyOrLiteral(String raw, String fallbackKey) {
        if (!StringUtils.hasText(raw)) {
            return message(fallbackKey);
        }
        if (looksLikeMessageKey(raw)) {
            try {
                return messageSource.getMessage(raw, null, LocaleContextHolder.getLocale());
            } catch (NoSuchMessageException e) {
                log.debug("Missing message key: {}", raw);
                return message(fallbackKey);
            }
        }
        return raw;
    }

    private static boolean looksLikeMessageKey(String raw) {
        return StringUtils.hasText(raw) && (raw.startsWith("api.") || raw.startsWith("validation."));
    }

    private ResponseEntity<ErrorResponse> buildValidationResponse(Iterable<FieldError> fieldErrors) {
        Map<String, String> errors = new LinkedHashMap<>();

        for (FieldError error : fieldErrors) {
            errors.put(error.getField(), resolveFieldErrorMessage(error));
        }

        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                message("api.error.validation"),
                "VALIDATION_ERROR",
                errors
        );
    }

    private String resolveFieldErrorMessage(FieldError error) {
        var locale = LocaleContextHolder.getLocale();
        String field = error.getField();
        String code = error.getCode();

        if (StringUtils.hasText(field) && StringUtils.hasText(code)) {
            try {
                return messageSource.getMessage("validation." + field + "." + code, error.getArguments(), locale);
            } catch (NoSuchMessageException ignored) {
                // try generic patterns below
            }
        }

        if (StringUtils.hasText(code)) {
            try {
                return messageSource.getMessage("validation." + code, error.getArguments(), locale);
            } catch (NoSuchMessageException ignored) {
                // continue
            }
        }

        String[] codes = error.getCodes();
        if (codes != null) {
            for (String c : codes) {
                if (c == null) {
                    continue;
                }
                try {
                    return messageSource.getMessage(c, error.getArguments(), locale);
                } catch (NoSuchMessageException ignored) {
                    // next
                }
            }
        }

        String defaultMessage = error.getDefaultMessage();
        if (StringUtils.hasText(defaultMessage) && defaultMessage.startsWith("{") && defaultMessage.endsWith("}")) {
            String inner = defaultMessage.substring(1, defaultMessage.length() - 1);
            try {
                return messageSource.getMessage(inner, error.getArguments(), locale);
            } catch (NoSuchMessageException ignored) {
                // fall through
            }
        }

        return StringUtils.hasText(defaultMessage) ? defaultMessage : message("api.error.validation");
    }

    private String resolveConstraintViolationMessage(ConstraintViolation<?> violation, String fieldName) {
        var locale = LocaleContextHolder.getLocale();
        String simpleName = violation.getConstraintDescriptor().getAnnotation().annotationType().getSimpleName();
        if (StringUtils.hasText(fieldName) && StringUtils.hasText(simpleName)) {
            try {
                return messageSource.getMessage(
                        "validation." + fieldName + "." + simpleName,
                        null,
                        locale
                );
            } catch (NoSuchMessageException ignored) {
                // continue
            }
        }
        if (StringUtils.hasText(simpleName)) {
            try {
                return messageSource.getMessage("validation." + simpleName, null, locale);
            } catch (NoSuchMessageException ignored) {
                // continue
            }
        }
        String msg = violation.getMessage();
        if (StringUtils.hasText(msg) && msg.startsWith("{") && msg.endsWith("}")) {
            String inner = msg.substring(1, msg.length() - 1);
            try {
                return messageSource.getMessage(inner, null, locale);
            } catch (NoSuchMessageException ignored) {
                // fall through
            }
        }
        return msg != null ? msg : message("api.error.validation");
    }

    private ResponseEntity<ErrorResponse> buildErrorResponse(
            HttpStatus status,
            String message,
            String errorCode,
            Map<String, String> errors
    ) {
        ErrorResponse response = ErrorResponse.builder()
                .success(false)
                .message(message)
                .errorCode(errorCode)
                .timestamp(LocalDateTime.now())
                .errors(errors)
                .build();

        return ResponseEntity.status(status).body(response);
    }
}

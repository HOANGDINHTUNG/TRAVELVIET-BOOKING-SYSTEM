package com.wedservice.backend.common.exception;

/**
 * Exception cho các vi phạm Business Rule nghiêm trọng theo Domain-Driven Design.
 */
public class BusinessException extends RuntimeException {

    public BusinessException(String message) {
        super(message);
    }
    
    public BusinessException(String message, Throwable cause) {
        super(message, cause);
    }
}

package com.wedservice.backend.module.ai.exception;

public class AiChatException extends RuntimeException {
    public AiChatException(String message) {
        super(message);
    }

    public AiChatException(String message, Throwable cause) {
        super(message, cause);
    }
}

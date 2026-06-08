package com.wedservice.backend.common.rules;

/**
 * Interface cho việc validate các Core Business Rules (Rule Engine Pattern).
 *
 * @param <T> Loại Entity hoặc DTO cần được validate
 */
public interface BusinessRuleValidator<T> {
    
    /**
     * Xác thực các business rules đối với tham số đầu vào.
     * Ném ra các Exception liên quan đến Business logic (vd: BadRequestException) nếu logic bị vi phạm.
     *
     * @param target Đối tượng cần validate
     */
    void validate(T target);
}

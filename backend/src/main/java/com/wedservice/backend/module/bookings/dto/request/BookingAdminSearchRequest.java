package com.wedservice.backend.module.bookings.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingAdminSearchRequest {

    @Size(max = 120, message = "keyword must not exceed 120 characters")
    private String keyword;

    /** Giá trị JSON {@link com.wedservice.backend.module.bookings.entity.BookingStatus} */
    private String status;

    /** Giá trị JSON {@link com.wedservice.backend.module.bookings.entity.BookingPaymentStatus} */
    private String paymentStatus;

    @Pattern(
            regexp = "createdAt|finalAmount|id",
            message = "sortBy is invalid"
    )
    @Builder.Default
    private String sortBy = "createdAt";

    @Pattern(
            regexp = "asc|desc",
            flags = Pattern.Flag.CASE_INSENSITIVE,
            message = "sortDir must be asc or desc"
    )
    @Builder.Default
    private String sortDir = "desc";

    @Min(value = 0, message = "page must be greater than or equal to 0")
    @Builder.Default
    private Integer page = 0;

    @Min(value = 1, message = "size must be greater than or equal to 1")
    @Max(value = 150, message = "size must be less than or equal to 150")
    @Builder.Default
    private Integer size = 20;

    /**
     * When both cursor fields are set, admin search uses keyset pagination (O(page size)) instead of OFFSET.
     */
    private LocalDateTime cursorCreatedAt;
    private Long cursorId;
}

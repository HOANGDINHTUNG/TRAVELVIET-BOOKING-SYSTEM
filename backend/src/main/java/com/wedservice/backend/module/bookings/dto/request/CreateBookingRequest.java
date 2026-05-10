package com.wedservice.backend.module.bookings.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateBookingRequest {

    private String userId;

    @NotNull
    private Long tourId;

    @NotNull
    private Long scheduleId;

    @NotBlank
    private String contactName;

    @NotBlank
    private String contactPhone;

    private String contactEmail;

    @Min(1)
    @Builder.Default
    private int adults = 1;

    @Builder.Default
    private int children = 0;

    @Builder.Default
    private int infants = 0;

    @Builder.Default
    private int seniors = 0;

    @Size(max = 50, message = "voucherCode must not exceed 50 characters")
    private String voucherCode;

    private Long comboId;

    /** Kênh đặt (mã ASCII, ví dụ app, web, pos). Mặc định app nếu bỏ trống. */
    @Size(max = 30)
    @Pattern(regexp = "^[a-zA-Z0-9._-]*$", message = "bookingSource must be ASCII alphanumeric with . _ - only")
    private String bookingSource;

    @Size(max = 4000)
    private String specialRequests;

    private List<CreatePassengerRequest> passengers;

    @Valid
    private List<BookingProductLineRequest> bookingProducts;
}

package com.wedservice.backend.module.reviews.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CustomerTestimonialResponse {
    private Long id;
    private String customerName;
    private String customerTitle;
    private String content;
    private Integer rating;
    private String avatarUrl;
    private Boolean isVerified;
    private Integer sortOrder;
}

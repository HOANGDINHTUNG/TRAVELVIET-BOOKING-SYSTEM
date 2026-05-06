package com.wedservice.backend.module.reviews.controller;

import com.wedservice.backend.common.response.ApiResponse;
import com.wedservice.backend.module.reviews.dto.response.CustomerTestimonialResponse;
import com.wedservice.backend.module.reviews.entity.CustomerTestimonial;
import com.wedservice.backend.module.reviews.repository.CustomerTestimonialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/testimonials")
@RequiredArgsConstructor
public class CustomerTestimonialController {

    private final CustomerTestimonialRepository customerTestimonialRepository;

    @GetMapping("/public")
    @PreAuthorize("permitAll()")
    public ApiResponse<List<CustomerTestimonialResponse>> getPublicTestimonials() {
        List<CustomerTestimonialResponse> testimonials = customerTestimonialRepository
                .findTop8ByIsActiveTrueOrderBySortOrderAscCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();

        return ApiResponse.success(testimonials, "Public testimonials fetched successfully");
    }

    private CustomerTestimonialResponse toResponse(CustomerTestimonial testimonial) {
        return CustomerTestimonialResponse.builder()
                .id(testimonial.getId())
                .customerName(testimonial.getCustomerName())
                .customerTitle(testimonial.getCustomerTitle())
                .content(testimonial.getContent())
                .rating(testimonial.getRating())
                .avatarUrl(testimonial.getAvatarUrl())
                .isVerified(testimonial.getIsVerified())
                .sortOrder(testimonial.getSortOrder())
                .build();
    }
}

package com.wedservice.backend.module.reviews.controller;

import com.wedservice.backend.common.i18n.LocaleTagUtil;
import com.wedservice.backend.common.response.ApiResponse;
import com.wedservice.backend.module.reviews.dto.response.CustomerTestimonialResponse;
import com.wedservice.backend.module.reviews.entity.CustomerTestimonial;
import com.wedservice.backend.module.reviews.entity.CustomerTestimonialTranslation;
import com.wedservice.backend.module.reviews.repository.CustomerTestimonialRepository;
import com.wedservice.backend.module.reviews.repository.CustomerTestimonialTranslationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/testimonials")
@RequiredArgsConstructor
public class CustomerTestimonialController {

    private final CustomerTestimonialRepository customerTestimonialRepository;
    private final CustomerTestimonialTranslationRepository customerTestimonialTranslationRepository;

    @GetMapping("/public")
    @PreAuthorize("permitAll()")
    public ApiResponse<List<CustomerTestimonialResponse>> getPublicTestimonials() {
        List<CustomerTestimonial> baseTestimonials = customerTestimonialRepository
                .findTop8ByIsActiveTrueOrderBySortOrderAscCreatedAtDesc();
        List<Long> ids = baseTestimonials.stream()
                .map(CustomerTestimonial::getId)
                .toList();
        String lang = LocaleTagUtil.currentLanguageTag();

        Map<Long, CustomerTestimonialTranslation> primaryById = byTestimonialId(
                customerTestimonialTranslationRepository.findByTestimonialIdInAndLocale(ids, lang)
        );
        Map<Long, CustomerTestimonialTranslation> viById = "vi".equalsIgnoreCase(lang)
                ? Collections.emptyMap()
                : byTestimonialId(customerTestimonialTranslationRepository.findByTestimonialIdInAndLocale(ids, "vi"));

        List<CustomerTestimonialResponse> testimonials = baseTestimonials
                .stream()
                .map(testimonial -> toResponse(
                        testimonial,
                        primaryById.get(testimonial.getId()),
                        viById.get(testimonial.getId())
                ))
                .toList();

        return ApiResponse.success(testimonials, "Public testimonials fetched successfully");
    }

    private Map<Long, CustomerTestimonialTranslation> byTestimonialId(Collection<CustomerTestimonialTranslation> rows) {
        return rows.stream().collect(Collectors.toMap(
                tr -> tr.getTestimonial().getId(),
                Function.identity(),
                (left, ignored) -> left,
                LinkedHashMap::new
        ));
    }

    private CustomerTestimonialResponse toResponse(
            CustomerTestimonial testimonial,
            CustomerTestimonialTranslation primary,
            CustomerTestimonialTranslation vietnamese
    ) {
        return CustomerTestimonialResponse.builder()
                .id(testimonial.getId())
                .customerName(pick(
                        primary != null ? primary.getCustomerName() : null,
                        vietnamese != null ? vietnamese.getCustomerName() : null,
                        testimonial.getCustomerName()
                ))
                .customerTitle(pick(
                        primary != null ? primary.getCustomerTitle() : null,
                        vietnamese != null ? vietnamese.getCustomerTitle() : null,
                        testimonial.getCustomerTitle()
                ))
                .content(pick(
                        primary != null ? primary.getContent() : null,
                        vietnamese != null ? vietnamese.getContent() : null,
                        testimonial.getContent()
                ))
                .rating(testimonial.getRating())
                .avatarUrl(testimonial.getAvatarUrl())
                .isVerified(testimonial.getIsVerified())
                .sortOrder(testimonial.getSortOrder())
                .build();
    }

    private String pick(String preferred, String vietnamese, String base) {
        if (StringUtils.hasText(preferred)) return preferred.trim();
        if (StringUtils.hasText(vietnamese)) return vietnamese.trim();
        return base;
    }
}

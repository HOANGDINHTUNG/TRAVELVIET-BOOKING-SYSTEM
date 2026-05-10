package com.wedservice.backend.module.reviews.validator;

import com.wedservice.backend.common.exception.BadRequestException;
import com.wedservice.backend.module.reviews.entity.ReviewSentiment;
import org.springframework.stereotype.Component;

@Component
public class ReviewValidator {

    public void validateRating(Integer rating, String fieldName) {
        if (rating == null || rating < 1 || rating > 5) {
            throw BadRequestException.i18n("api.error.common.fieldRatingOneToFive", fieldName);
        }
    }

    public String normalizeSentiment(String sentiment) {
        try {
            return ReviewSentiment.fromValue(sentiment).getValue();
        } catch (IllegalArgumentException ex) {
            throw BadRequestException.i18n("api.error.review.invalidSentiment");
        }
    }
}

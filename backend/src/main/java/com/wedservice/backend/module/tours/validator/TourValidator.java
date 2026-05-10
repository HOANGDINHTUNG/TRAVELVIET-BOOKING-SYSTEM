package com.wedservice.backend.module.tours.validator;

import com.wedservice.backend.common.exception.BadRequestException;
import com.wedservice.backend.module.tours.dto.request.ItineraryItemRequest;
import com.wedservice.backend.module.tours.dto.request.TourChecklistItemRequest;
import com.wedservice.backend.module.tours.dto.request.TourItineraryDayRequest;
import com.wedservice.backend.module.tours.dto.request.TourMediaRequest;
import com.wedservice.backend.module.tours.dto.request.TourRequest;
import com.wedservice.backend.module.tours.dto.request.TourSeasonalityRequest;
import com.wedservice.backend.module.tours.dto.request.TourScheduleGuideRequest;
import com.wedservice.backend.module.tours.dto.request.TourSchedulePickupPointRequest;
import com.wedservice.backend.module.tours.dto.request.TourScheduleRequest;
import com.wedservice.backend.module.tours.entity.TourSchedule;
import com.wedservice.backend.module.tours.entity.TourScheduleStatus;
import com.wedservice.backend.module.tours.entity.TourStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;

@Component
public class TourValidator {

    public void validateRequest(TourRequest request) {
        if (request.getDurationDays() != null
                && request.getDurationNights() != null
                && request.getDurationNights() > request.getDurationDays()) {
            throw BadRequestException.i18n("api.error.tour.validator.durationNightsGtDays");
        }
        validateMedia(request.getMedia());
        validateTagIds(request.getTagIds());
        validateSeasonality(request.getSeasonality());
        validateItineraryDays(request.getItineraryDays(), request.getDurationDays());
        validateChecklistItems(request.getChecklistItems());
    }

    public String normalizeCurrency(String currency) {
        if (!StringUtils.hasText(currency)) {
            return "VND";
        }
        String normalized = currency.trim().toUpperCase(Locale.ROOT);
        if (normalized.length() != 3) {
            throw BadRequestException.i18n("api.error.tour.validator.currencyLength");
        }
        return normalized;
    }

    public TourStatus normalizeStatus(String status) {
        if (!StringUtils.hasText(status)) {
            return TourStatus.DRAFT;
        }
        try {
            return TourStatus.fromValue(status.trim().toLowerCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw BadRequestException.i18n("api.error.tour.invalidStatus", status.trim());
        }
    }

    public void validateScheduleRequest(TourScheduleRequest request) {
        if (request.getReturnAt() != null && request.getDepartureAt() != null
                && !request.getReturnAt().isAfter(request.getDepartureAt())) {
            throw BadRequestException.i18n("api.error.tour.validator.scheduleReturnAfterDeparture");
        }
        if (request.getBookingOpenAt() != null && request.getBookingCloseAt() != null
                && request.getBookingCloseAt().isBefore(request.getBookingOpenAt())) {
            throw BadRequestException.i18n("api.error.tour.validator.scheduleBookingCloseAfterOpen");
        }
        if (request.getBookingCloseAt() != null && request.getDepartureAt() != null
                && request.getBookingCloseAt().isAfter(request.getDepartureAt())) {
            throw BadRequestException.i18n("api.error.tour.validator.scheduleBookingCloseNotAfterDeparture");
        }
        if (request.getMeetingAt() != null && request.getDepartureAt() != null
                && request.getMeetingAt().isAfter(request.getDepartureAt())) {
            throw BadRequestException.i18n("api.error.tour.validator.scheduleMeetingNotAfterDeparture");
        }
        if (request.getMinGuestsToOperate() != null && request.getCapacityTotal() != null
                && request.getMinGuestsToOperate() > request.getCapacityTotal()) {
            throw BadRequestException.i18n("api.error.tour.validator.minGuestsVsCapacity");
        }

        validateNonNegativePrice(request.getAdultPrice(), "adultPrice");
        validateNonNegativePrice(request.getChildPrice(), "childPrice");
        validateNonNegativePrice(request.getInfantPrice(), "infantPrice");
        validateNonNegativePrice(request.getSeniorPrice(), "seniorPrice");
        validateNonNegativePrice(request.getSingleRoomSurcharge(), "singleRoomSurcharge");

        if (request.getPickupPoints() != null) {
            for (TourSchedulePickupPointRequest pickupPoint : request.getPickupPoints()) {
                if (pickupPoint.getPickupAt() != null && request.getDepartureAt() != null
                        && pickupPoint.getPickupAt().isAfter(request.getDepartureAt())) {
                    throw BadRequestException.i18n("api.error.tour.validator.pickupNotAfterDeparture");
                }
            }
        }

        if (request.getGuideAssignments() != null) {
            Set<Long> guideIds = new HashSet<>();
            for (TourScheduleGuideRequest guideAssignment : request.getGuideAssignments()) {
                if (guideAssignment.getGuideId() != null && guideAssignment.getGuideId() <= 0) {
                    throw BadRequestException.i18n("api.error.tour.validator.guideIdPositive");
                }
                if (guideAssignment.getGuideId() != null && !guideIds.add(guideAssignment.getGuideId())) {
                    throw BadRequestException.i18n("api.error.tour.validator.duplicateGuideId");
                }
            }
        }
    }

    public TourScheduleStatus normalizeScheduleStatus(String status) {
        if (!StringUtils.hasText(status)) {
            return TourScheduleStatus.DRAFT;
        }
        try {
            return TourScheduleStatus.fromValue(status.trim().toLowerCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw BadRequestException.i18n("api.error.tour.invalidScheduleStatus", status.trim());
        }
    }

    public void validateStatusUpdate(TourSchedule schedule, TourScheduleStatus targetStatus) {
        if (targetStatus == TourScheduleStatus.DRAFT
                && schedule.getBookedSeats() != null
                && schedule.getBookedSeats() > 0) {
            throw BadRequestException.i18n("api.error.tour.validator.bookedSeatsCannotDraft");
        }
        if ((targetStatus == TourScheduleStatus.OPEN || targetStatus == TourScheduleStatus.FULL)
                && schedule.getDepartureAt() != null
                && schedule.getDepartureAt().isBefore(LocalDateTime.now())) {
            throw BadRequestException.i18n("api.error.tour.validator.pastScheduleCannotReopen");
        }
    }

    private void validateNonNegativePrice(BigDecimal value, String fieldName) {
        if (value != null && value.compareTo(BigDecimal.ZERO) < 0) {
            throw BadRequestException.i18n("api.error.common.fieldGteZero", fieldName);
        }
    }

    private void validateMedia(java.util.List<TourMediaRequest> media) {
        if (media == null) {
            return;
        }
        Set<Integer> sortOrders = new HashSet<>();
        for (TourMediaRequest item : media) {
            Integer sortOrder = item.getSortOrder() == null ? 0 : item.getSortOrder();
            if (!sortOrders.add(sortOrder)) {
                throw BadRequestException.i18n("api.error.tour.validator.mediaSortOrderUnique");
            }
        }
    }

    private void validateItineraryDays(java.util.List<TourItineraryDayRequest> itineraryDays, Integer durationDays) {
        if (itineraryDays == null) {
            return;
        }
        Set<Integer> dayNumbers = new HashSet<>();
        for (TourItineraryDayRequest day : itineraryDays) {
            if (!dayNumbers.add(day.getDayNumber())) {
                throw BadRequestException.i18n("api.error.tour.validator.itineraryDayUnique");
            }
            if (durationDays != null && day.getDayNumber() > durationDays) {
                throw BadRequestException.i18n("api.error.tour.validator.itineraryDayMaxDuration");
            }
            validateItineraryItems(day.getItems());
        }
    }

    private void validateItineraryItems(java.util.List<ItineraryItemRequest> items) {
        if (items == null) {
            return;
        }
        Set<Integer> sequenceNumbers = new HashSet<>();
        for (ItineraryItemRequest item : items) {
            if (!sequenceNumbers.add(item.getSequenceNo())) {
                throw BadRequestException.i18n("api.error.tour.validator.itinerarySequenceUnique");
            }
            if (item.getStartTime() != null && item.getEndTime() != null && item.getEndTime().isBefore(item.getStartTime())) {
                throw BadRequestException.i18n("api.error.tour.validator.itineraryEndAfterStart");
            }
        }
    }

    private void validateChecklistItems(java.util.List<TourChecklistItemRequest> checklistItems) {
        if (checklistItems == null) {
            return;
        }
        Set<String> normalizedNames = new HashSet<>();
        for (TourChecklistItemRequest item : checklistItems) {
            String key = item.getItemName().trim().toLowerCase(Locale.ROOT);
            if (!normalizedNames.add(key)) {
                throw BadRequestException.i18n("api.error.tour.validator.checklistNamesUnique");
            }
        }
    }

    private void validateTagIds(java.util.List<Long> tagIds) {
        if (tagIds == null) {
            return;
        }
        Set<Long> uniqueTagIds = new HashSet<>();
        for (Long tagId : tagIds) {
            if (tagId == null || tagId <= 0) {
                throw BadRequestException.i18n("api.error.tour.validator.tagIdsPositive");
            }
            if (!uniqueTagIds.add(tagId)) {
                throw BadRequestException.i18n("api.error.tour.validator.tagIdsUnique");
            }
        }
    }

    private void validateSeasonality(java.util.List<TourSeasonalityRequest> seasonalityRequests) {
        if (seasonalityRequests == null) {
            return;
        }
        Set<String> uniqueSeasonNames = new HashSet<>();
        for (TourSeasonalityRequest season : seasonalityRequests) {
            String nameKey = season.getSeasonName().trim().toLowerCase(Locale.ROOT);
            if (!uniqueSeasonNames.add(nameKey)) {
                throw BadRequestException.i18n("api.error.tour.validator.seasonNamesUnique");
            }
            if (season.getMonthFrom() != null && season.getMonthTo() != null && season.getMonthTo() < season.getMonthFrom()) {
                throw BadRequestException.i18n("api.error.tour.validator.seasonalityMonthOrder");
            }
            validateNonNegativePrice(season.getRecommendationScore(), "seasonality recommendationScore");
        }
    }
}

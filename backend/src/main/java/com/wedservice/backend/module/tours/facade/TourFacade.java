package com.wedservice.backend.module.tours.facade;

import com.wedservice.backend.module.tours.dto.request.TourRequest;
import com.wedservice.backend.module.tours.dto.request.TourSearchRequest;
import com.wedservice.backend.module.tours.dto.request.TourScheduleRequest;
import com.wedservice.backend.module.tours.dto.request.UpsertTourTranslationRequest;
import com.wedservice.backend.module.tours.dto.response.TourResponse;
import com.wedservice.backend.module.tours.dto.response.TourScheduleResponse;
import com.wedservice.backend.module.tours.dto.response.TourTranslationResponse;
import com.wedservice.backend.module.tours.service.TourTranslationAdminService;
import com.wedservice.backend.module.tours.service.command.TourCommandService;
import com.wedservice.backend.module.tours.service.query.TourQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class TourFacade {

    private final TourCommandService tourCommandService;
    private final TourQueryService tourQueryService;
    private final TourTranslationAdminService tourTranslationAdminService;

    public Page<TourResponse> searchTours(TourSearchRequest request) {
        return tourQueryService.searchTours(request);
    }

    public Page<TourResponse> searchAdminTours(TourSearchRequest request) {
        return tourQueryService.searchAdminTours(request);
    }

    public TourResponse getTour(Long id) {
        return tourQueryService.getTour(id);
    }

    public TourResponse getAdminTour(Long id) {
        return tourQueryService.getAdminTour(id);
    }

    public List<TourScheduleResponse> getTourSchedules(Long tourId) {
        return tourQueryService.getTourSchedules(tourId);
    }

    public List<TourScheduleResponse> getAdminTourSchedules(Long tourId) {
        return tourQueryService.getAdminTourSchedules(tourId);
    }

    public TourScheduleResponse getTourSchedule(Long tourId, Long scheduleId) {
        return tourQueryService.getTourSchedule(tourId, scheduleId);
    }

    public TourResponse createTour(TourRequest request) {
        return tourCommandService.createTour(request);
    }

    public TourResponse updateTour(Long id, TourRequest request) {
        return tourCommandService.updateTour(id, request);
    }

    public void deleteTour(Long id) {
        tourCommandService.deleteTour(id);
    }

    public List<TourTranslationResponse> listTourTranslations(Long tourId) {
        return tourTranslationAdminService.listByTourId(tourId);
    }

    public TourTranslationResponse upsertTourTranslation(Long tourId, String locale, UpsertTourTranslationRequest request) {
        return tourTranslationAdminService.upsert(tourId, locale, request);
    }

    public void deleteTourTranslation(Long tourId, String locale) {
        tourTranslationAdminService.delete(tourId, locale);
    }

    public TourScheduleResponse createTourSchedule(Long tourId, TourScheduleRequest request) {
        return tourCommandService.createTourSchedule(tourId, request);
    }

    public TourScheduleResponse updateTourSchedule(Long tourId, Long scheduleId, TourScheduleRequest request) {
        return tourCommandService.updateTourSchedule(tourId, scheduleId, request);
    }

    public TourScheduleResponse updateTourScheduleStatus(Long tourId, Long scheduleId, String status) {
        return tourCommandService.updateTourScheduleStatus(tourId, scheduleId, status);
    }
}


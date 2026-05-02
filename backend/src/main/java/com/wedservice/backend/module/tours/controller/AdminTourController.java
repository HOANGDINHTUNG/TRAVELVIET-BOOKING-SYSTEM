package com.wedservice.backend.module.tours.controller;

import com.wedservice.backend.common.service.FileService;
import com.wedservice.backend.common.response.ApiResponse;
import com.wedservice.backend.common.response.PageResponse;
import com.wedservice.backend.module.tours.dto.request.TourMediaRequest;
import com.wedservice.backend.module.tours.dto.request.TourRequest;
import com.wedservice.backend.module.tours.dto.request.TourScheduleRequest;
import com.wedservice.backend.module.tours.dto.request.TourSearchRequest;
import com.wedservice.backend.module.tours.dto.request.UpdateTourScheduleStatusRequest;
import com.wedservice.backend.module.tours.dto.response.TourResponse;
import com.wedservice.backend.module.tours.dto.response.TourScheduleResponse;
import com.wedservice.backend.module.tours.facade.TourFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/admin/tours")
@RequiredArgsConstructor
public class AdminTourController {

    private final TourFacade tourFacade;
    private final FileService fileService;

    @GetMapping
    @PreAuthorize("hasAuthority('tour.view')")
    public ApiResponse<PageResponse<TourResponse>> searchTours(@Validated TourSearchRequest request) {
        return ApiResponse.success(PageResponse.of(tourFacade.searchAdminTours(request)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('tour.view')")
    public ApiResponse<TourResponse> getTour(@PathVariable Long id) {
        return ApiResponse.success(tourFacade.getAdminTour(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('tour.create')")
    public ApiResponse<TourResponse> createTour(@Validated @RequestBody TourRequest request) {
        return ApiResponse.success(tourFacade.createTour(request));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('tour.create')")
    public ApiResponse<TourResponse> createTourWithImage(
            @Validated @RequestPart("tour") TourRequest request,
            @RequestPart(value = "fileImage", required = false) MultipartFile fileImage
    ) throws Exception {
        attachUploadedImage(request, fileImage);
        return ApiResponse.success(tourFacade.createTour(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('tour.update')")
    public ApiResponse<TourResponse> updateTour(@PathVariable Long id, @Validated @RequestBody TourRequest request) {
        return ApiResponse.success(tourFacade.updateTour(id, request));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('tour.update')")
    public ApiResponse<TourResponse> updateTourWithImage(
            @PathVariable Long id,
            @Validated @RequestPart("tour") TourRequest request,
            @RequestPart(value = "fileImage", required = false) MultipartFile fileImage
    ) throws Exception {
        attachUploadedImage(request, fileImage);
        return ApiResponse.success(tourFacade.updateTour(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('tour.delete')")
    public ApiResponse<String> deleteTour(@PathVariable Long id) {
        tourFacade.deleteTour(id);
        return ApiResponse.success("Deleted");
    }

    @GetMapping("/{tourId}/schedules")
    @PreAuthorize("hasAuthority('schedule.view')")
    public ApiResponse<List<TourScheduleResponse>> getAdminTourSchedules(@PathVariable Long tourId) {
        return ApiResponse.success(tourFacade.getAdminTourSchedules(tourId));
    }

    @GetMapping("/{tourId}/schedules/{scheduleId}")
    @PreAuthorize("hasAuthority('schedule.view')")
    public ApiResponse<TourScheduleResponse> getAdminTourSchedule(
            @PathVariable Long tourId,
            @PathVariable Long scheduleId
    ) {
        return ApiResponse.success(tourFacade.getTourSchedule(tourId, scheduleId));
    }

    @PostMapping("/{tourId}/schedules")
    @PreAuthorize("hasAuthority('schedule.create')")
    public ApiResponse<TourScheduleResponse> createTourSchedule(
            @PathVariable Long tourId,
            @Validated @RequestBody TourScheduleRequest request
    ) {
        return ApiResponse.success(tourFacade.createTourSchedule(tourId, request), "Tour schedule created");
    }

    @PutMapping("/{tourId}/schedules/{scheduleId}")
    @PreAuthorize("hasAuthority('schedule.update')")
    public ApiResponse<TourScheduleResponse> updateTourSchedule(
            @PathVariable Long tourId,
            @PathVariable Long scheduleId,
            @Validated @RequestBody TourScheduleRequest request
    ) {
        return ApiResponse.success(tourFacade.updateTourSchedule(tourId, scheduleId, request), "Tour schedule updated");
    }

    @PatchMapping("/{tourId}/schedules/{scheduleId}/status")
    @PreAuthorize("hasAuthority('schedule.close')")
    public ApiResponse<TourScheduleResponse> updateTourScheduleStatus(
            @PathVariable Long tourId,
            @PathVariable Long scheduleId,
            @Validated @RequestBody UpdateTourScheduleStatusRequest request
    ) {
        return ApiResponse.success(
                tourFacade.updateTourScheduleStatus(tourId, scheduleId, request.getStatus()),
                "Tour schedule status updated"
        );
    }

    private void attachUploadedImage(TourRequest request, MultipartFile fileImage) throws Exception {
        if (fileImage == null || fileImage.isEmpty()) {
            return;
        }

        String imageUrl = fileService.uploadFile(fileImage);
        List<TourMediaRequest> media = request.getMedia() == null
                ? new ArrayList<>()
                : new ArrayList<>(request.getMedia());
        int nextSortOrder = media.stream()
                .map(TourMediaRequest::getSortOrder)
                .filter(java.util.Objects::nonNull)
                .max(Integer::compareTo)
                .map(sortOrder -> sortOrder + 1)
                .orElse(0);

        media.add(TourMediaRequest.builder()
                .mediaType("image")
                .mediaUrl(imageUrl)
                .altText(fileImage.getOriginalFilename())
                .sortOrder(nextSortOrder)
                .isActive(true)
                .build());
        request.setMedia(media);
    }
}

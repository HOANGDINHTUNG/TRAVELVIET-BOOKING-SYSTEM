package com.wedservice.backend.module.weather.facade;

import com.wedservice.backend.module.weather.dto.request.AdminCreateRouteEstimateRequest;
import com.wedservice.backend.module.weather.dto.request.AdminUpsertCrowdPredictionRequest;
import com.wedservice.backend.module.weather.dto.request.AdminUpsertWeatherForecastRequest;
import com.wedservice.backend.module.weather.dto.request.AdminWeatherDisplayPolicyRequest;
import com.wedservice.backend.module.weather.dto.request.AdminWeatherAlertRequest;
import com.wedservice.backend.module.weather.dto.request.AdminWeatherPublicNoticeRequest;
import com.wedservice.backend.module.weather.dto.request.UpdateWeatherAlertStatusRequest;
import com.wedservice.backend.module.weather.dto.request.UpdateWeatherPublicNoticeStatusRequest;
import com.wedservice.backend.module.weather.dto.response.CrowdPredictionResponse;
import com.wedservice.backend.module.weather.dto.response.RouteEstimateResponse;
import com.wedservice.backend.module.weather.dto.response.WeatherAlertResponse;
import com.wedservice.backend.module.weather.dto.response.WeatherApiSyncResponse;
import com.wedservice.backend.module.weather.dto.response.WeatherDisplayPolicyResponse;
import com.wedservice.backend.module.weather.dto.response.WeatherForecastResponse;
import com.wedservice.backend.module.weather.dto.response.WeatherPublicNoticeResponse;
import com.wedservice.backend.module.weather.service.AdminWeatherService;
import com.wedservice.backend.module.weather.service.WeatherApiSyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class AdminWeatherFacade {

    private final AdminWeatherService adminWeatherService;
    private final WeatherApiSyncService weatherApiSyncService;

    public WeatherDisplayPolicyResponse getDisplayPolicy(UUID destinationUuid) {
        return adminWeatherService.getDisplayPolicy(destinationUuid);
    }

    public WeatherApiSyncResponse syncWeatherApi(UUID destinationUuid) {
        return weatherApiSyncService.syncDestination(destinationUuid);
    }

    public WeatherDisplayPolicyResponse updateDisplayPolicy(
            UUID destinationUuid,
            AdminWeatherDisplayPolicyRequest request
    ) {
        return adminWeatherService.updateDisplayPolicy(destinationUuid, request);
    }

    public List<WeatherForecastResponse> getForecasts(UUID destinationUuid) {
        return adminWeatherService.getForecasts(destinationUuid);
    }

    public WeatherForecastResponse upsertForecast(
            UUID destinationUuid,
            LocalDate forecastDate,
            AdminUpsertWeatherForecastRequest request
    ) {
        return adminWeatherService.upsertForecast(destinationUuid, forecastDate, request);
    }

    public List<WeatherAlertResponse> getAlerts(UUID destinationUuid) {
        return adminWeatherService.getAlerts(destinationUuid);
    }

    public WeatherAlertResponse createAlert(UUID destinationUuid, AdminWeatherAlertRequest request) {
        return adminWeatherService.createAlert(destinationUuid, request);
    }

    public WeatherAlertResponse updateAlert(UUID destinationUuid, Long alertId, AdminWeatherAlertRequest request) {
        return adminWeatherService.updateAlert(destinationUuid, alertId, request);
    }

    public WeatherAlertResponse updateAlertStatus(
            UUID destinationUuid,
            Long alertId,
            UpdateWeatherAlertStatusRequest request
    ) {
        return adminWeatherService.updateAlertStatus(destinationUuid, alertId, request);
    }

    public List<WeatherPublicNoticeResponse> getPublicNotices(UUID destinationUuid) {
        return adminWeatherService.getPublicNotices(destinationUuid);
    }

    public WeatherPublicNoticeResponse createPublicNotice(
            UUID destinationUuid,
            AdminWeatherPublicNoticeRequest request
    ) {
        return adminWeatherService.createPublicNotice(destinationUuid, request);
    }

    public WeatherPublicNoticeResponse updatePublicNotice(
            UUID destinationUuid,
            Long noticeId,
            AdminWeatherPublicNoticeRequest request
    ) {
        return adminWeatherService.updatePublicNotice(destinationUuid, noticeId, request);
    }

    public WeatherPublicNoticeResponse updatePublicNoticeStatus(
            UUID destinationUuid,
            Long noticeId,
            UpdateWeatherPublicNoticeStatusRequest request
    ) {
        return adminWeatherService.updatePublicNoticeStatus(destinationUuid, noticeId, request);
    }

    public List<CrowdPredictionResponse> getCrowdPredictions(UUID destinationUuid) {
        return adminWeatherService.getCrowdPredictions(destinationUuid);
    }

    public CrowdPredictionResponse upsertCrowdPrediction(
            UUID destinationUuid,
            LocalDate predictionDate,
            AdminUpsertCrowdPredictionRequest request
    ) {
        return adminWeatherService.upsertCrowdPrediction(destinationUuid, predictionDate, request);
    }

    public List<RouteEstimateResponse> getRouteEstimates(String fromLabel, String toLabel) {
        return adminWeatherService.getRouteEstimates(fromLabel, toLabel);
    }

    public RouteEstimateResponse createRouteEstimate(AdminCreateRouteEstimateRequest request) {
        return adminWeatherService.createRouteEstimate(request);
    }
}

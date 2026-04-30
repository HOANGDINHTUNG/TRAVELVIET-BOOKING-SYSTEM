package com.wedservice.backend.module.weather.controller;

import com.wedservice.backend.common.exception.GlobalExceptionHandler;
import com.wedservice.backend.module.weather.dto.request.AdminUpsertCrowdPredictionRequest;
import com.wedservice.backend.module.weather.dto.request.AdminUpsertWeatherForecastRequest;
import com.wedservice.backend.module.weather.dto.request.AdminWeatherDisplayPolicyRequest;
import com.wedservice.backend.module.weather.dto.request.UpdateWeatherAlertStatusRequest;
import com.wedservice.backend.module.weather.dto.response.CrowdPredictionResponse;
import com.wedservice.backend.module.weather.dto.response.WeatherAlertResponse;
import com.wedservice.backend.module.weather.dto.response.WeatherApiSyncResponse;
import com.wedservice.backend.module.weather.dto.response.WeatherDisplayPolicyResponse;
import com.wedservice.backend.module.weather.dto.response.WeatherForecastResponse;
import com.wedservice.backend.module.weather.dto.response.WeatherPublicNoticeResponse;
import com.wedservice.backend.module.destinations.entity.CrowdLevel;
import com.wedservice.backend.module.weather.entity.WeatherNoticeStatus;
import com.wedservice.backend.module.weather.entity.WeatherSeverity;
import com.wedservice.backend.module.weather.facade.AdminWeatherFacade;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.JacksonJsonHttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import tools.jackson.databind.json.JsonMapper;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AdminWeatherControllerTest {

    @Mock
    private AdminWeatherFacade adminWeatherFacade;

    private MockMvc mockMvc;
    private JsonMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = JsonMapper.builder().findAndAddModules().build();
        mockMvc = MockMvcBuilders.standaloneSetup(new AdminWeatherController(adminWeatherFacade))
                .setControllerAdvice(new GlobalExceptionHandler())
                .setMessageConverters(new JacksonJsonHttpMessageConverter(objectMapper))
                .build();
    }

    @Test
    void syncWeatherApi_returnsWrappedApiResponse() throws Exception {
        UUID destinationUuid = UUID.randomUUID();

        when(adminWeatherFacade.syncWeatherApi(destinationUuid)).thenReturn(WeatherApiSyncResponse.builder()
                .destinationId(10L)
                .query("11.9404,108.4583")
                .locationName("Da Lat")
                .forecastsSaved(3)
                .alertsSaved(1)
                .build());

        mockMvc.perform(post("/admin/destinations/{destinationUuid}/weather/weatherapi/sync", destinationUuid))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("WeatherAPI data synced successfully"))
                .andExpect(jsonPath("$.data.locationName").value("Da Lat"))
                .andExpect(jsonPath("$.data.forecastsSaved").value(3));
    }

    @Test
    void updateDisplayPolicy_returnsWrappedApiResponse() throws Exception {
        UUID destinationUuid = UUID.randomUUID();

        when(adminWeatherFacade.updateDisplayPolicy(eq(destinationUuid), any(AdminWeatherDisplayPolicyRequest.class)))
                .thenReturn(WeatherDisplayPolicyResponse.builder()
                        .id(6L)
                        .destinationId(10L)
                        .showTemperature(true)
                        .showHumidity(true)
                        .showAlertDetail(false)
                        .build());

        mockMvc.perform(put("/admin/destinations/{destinationUuid}/weather/display-policy", destinationUuid)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(AdminWeatherDisplayPolicyRequest.builder()
                                .showTemperature(true)
                                .showHumidity(true)
                                .showAlertDetail(false)
                                .build())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Weather display policy saved successfully"))
                .andExpect(jsonPath("$.data.showHumidity").value(true))
                .andExpect(jsonPath("$.data.showAlertDetail").value(false));
    }

    @Test
    void upsertForecast_returnsWrappedApiResponse() throws Exception {
        UUID destinationUuid = UUID.randomUUID();
        LocalDate forecastDate = LocalDate.of(2026, 4, 18);

        when(adminWeatherFacade.upsertForecast(eq(destinationUuid), eq(forecastDate), any(AdminUpsertWeatherForecastRequest.class)))
                .thenReturn(WeatherForecastResponse.builder()
                        .id(1L)
                        .forecastDate(forecastDate)
                        .summary("Mua rai rac")
                        .build());

        mockMvc.perform(put("/admin/destinations/{destinationUuid}/weather/forecasts/{forecastDate}", destinationUuid, forecastDate)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(AdminUpsertWeatherForecastRequest.builder()
                                .summary("Mua rai rac")
                                .build())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Weather forecast saved successfully"))
                .andExpect(jsonPath("$.data.id").value(1L));
    }

    @Test
    void updateAlertStatus_returnsWrappedApiResponse() throws Exception {
        UUID destinationUuid = UUID.randomUUID();

        when(adminWeatherFacade.updateAlertStatus(eq(destinationUuid), eq(9L), any(UpdateWeatherAlertStatusRequest.class)))
                .thenReturn(WeatherAlertResponse.builder()
                        .id(9L)
                        .severity(WeatherSeverity.WARNING)
                        .title("Mua to")
                        .validFrom(LocalDateTime.of(2026, 4, 18, 9, 0))
                        .validTo(LocalDateTime.of(2026, 4, 18, 12, 0))
                        .isActive(false)
                        .build());

        mockMvc.perform(patch("/admin/destinations/{destinationUuid}/weather/alerts/{alertId}/status", destinationUuid, 9L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(UpdateWeatherAlertStatusRequest.builder()
                                .active(false)
                                .build())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Weather alert status updated successfully"))
                .andExpect(jsonPath("$.data.isActive").value(false));
    }

    @Test
    void getPublicNotices_returnsWrappedApiResponse() throws Exception {
        UUID destinationUuid = UUID.randomUUID();

        when(adminWeatherFacade.getPublicNotices(destinationUuid)).thenReturn(List.of(
                WeatherPublicNoticeResponse.builder()
                        .id(15L)
                        .severity(WeatherSeverity.WARNING)
                        .title("Mua lon")
                        .summary("Nen mang ao mua")
                        .status(WeatherNoticeStatus.PUBLISHED)
                        .displayFrom(LocalDateTime.of(2026, 4, 18, 9, 0))
                        .displayTo(LocalDateTime.of(2026, 4, 18, 12, 0))
                        .build()
        ));

        mockMvc.perform(get("/admin/destinations/{destinationUuid}/weather/public-notices", destinationUuid))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Weather public notices fetched successfully"))
                .andExpect(jsonPath("$.data[0].status").value("published"));
    }

    @Test
    void createPublicNotice_returnsWrappedApiResponse() throws Exception {
        UUID destinationUuid = UUID.randomUUID();

        when(adminWeatherFacade.createPublicNotice(eq(destinationUuid), any()))
                .thenReturn(WeatherPublicNoticeResponse.builder()
                        .id(16L)
                        .severity(WeatherSeverity.WARNING)
                        .title("Mua lon")
                        .summary("Nen mang ao mua")
                        .status(WeatherNoticeStatus.PUBLISHED)
                        .displayFrom(LocalDateTime.of(2026, 4, 18, 9, 0))
                        .displayTo(LocalDateTime.of(2026, 4, 18, 12, 0))
                        .build());

        mockMvc.perform(post("/admin/destinations/{destinationUuid}/weather/public-notices", destinationUuid)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "severity": "warning",
                                  "title": "Mua lon",
                                  "summary": "Nen mang ao mua",
                                  "displayFrom": "2026-04-18T09:00:00",
                                  "displayTo": "2026-04-18T12:00:00",
                                  "status": "published"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Weather public notice created successfully"))
                .andExpect(jsonPath("$.data.id").value(16L));
    }

    @Test
    void upsertCrowdPrediction_returnsWrappedApiResponse() throws Exception {
        UUID destinationUuid = UUID.randomUUID();
        LocalDate predictionDate = LocalDate.of(2026, 4, 20);

        when(adminWeatherFacade.upsertCrowdPrediction(eq(destinationUuid), eq(predictionDate), any(AdminUpsertCrowdPredictionRequest.class)))
                .thenReturn(CrowdPredictionResponse.builder()
                        .id(11L)
                        .predictionDate(predictionDate)
                        .crowdLevel("high")
                        .build());

        mockMvc.perform(put("/admin/destinations/{destinationUuid}/weather/crowd-predictions/{predictionDate}", destinationUuid, predictionDate)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(AdminUpsertCrowdPredictionRequest.builder()
                                .crowdLevel(CrowdLevel.HIGH)
                                .predictedVisitors(10000)
                                .build())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Crowd prediction saved successfully"))
                .andExpect(jsonPath("$.data.id").value(11L));
    }
}

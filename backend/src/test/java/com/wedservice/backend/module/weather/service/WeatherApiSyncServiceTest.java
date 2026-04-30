package com.wedservice.backend.module.weather.service;

import com.wedservice.backend.module.destinations.entity.Destination;
import com.wedservice.backend.module.destinations.repository.DestinationRepository;
import com.wedservice.backend.module.users.service.AuditTrailRecorder;
import com.wedservice.backend.module.weather.entity.WeatherAlert;
import com.wedservice.backend.module.weather.entity.WeatherForecast;
import com.wedservice.backend.module.weather.entity.WeatherSeverity;
import com.wedservice.backend.module.weather.integration.WeatherApiClient;
import com.wedservice.backend.module.weather.integration.WeatherApiForecastResult;
import com.wedservice.backend.module.weather.repository.WeatherAlertRepository;
import com.wedservice.backend.module.weather.repository.WeatherForecastRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tools.jackson.databind.json.JsonMapper;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class WeatherApiSyncServiceTest {

    @Mock
    private DestinationRepository destinationRepository;
    @Mock
    private WeatherForecastRepository weatherForecastRepository;
    @Mock
    private WeatherAlertRepository weatherAlertRepository;
    @Mock
    private WeatherApiClient weatherApiClient;
    @Mock
    private AuditTrailRecorder auditTrailRecorder;

    private WeatherApiSyncService weatherApiSyncService;
    private JsonMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = JsonMapper.builder().findAndAddModules().build();
        weatherApiSyncService = new WeatherApiSyncService(
                destinationRepository,
                weatherForecastRepository,
                weatherAlertRepository,
                weatherApiClient,
                auditTrailRecorder
        );
    }

    @Test
    void syncDestination_savesForecastAndAlertFromWeatherApiPayload() throws Exception {
        UUID destinationUuid = UUID.randomUUID();
        Destination destination = Destination.builder()
                .id(12L)
                .uuid(destinationUuid)
                .name("Da Lat")
                .province("Lam Dong")
                .latitude(BigDecimal.valueOf(11.9404))
                .longitude(BigDecimal.valueOf(108.4583))
                .build();
        String payload = """
                {
                  "location": {
                    "name": "Da Lat",
                    "region": "Lam Dong",
                    "country": "Vietnam"
                  },
                  "forecast": {
                    "forecastday": [
                      {
                        "date": "2026-04-30",
                        "day": {
                          "maxtemp_c": 28.4,
                          "mintemp_c": 19.1,
                          "avghumidity": 82,
                          "maxwind_kph": 14.8,
                          "daily_chance_of_rain": 72,
                          "condition": {
                            "text": "Mua vua",
                            "code": 1189
                          }
                        }
                      }
                    ]
                  },
                  "alerts": {
                    "alert": [
                      {
                        "headline": "Canh bao mua lon",
                        "severity": "Severe",
                        "event": "Heavy rain",
                        "effective": "2026-04-30 09:00",
                        "expires": "2026-04-30 15:00",
                        "desc": "Mua lon trong ngay",
                        "instruction": "Mang ao mua"
                      }
                    ]
                  }
                }
                """;

        when(destinationRepository.findByUuid(destinationUuid)).thenReturn(Optional.of(destination));
        when(weatherApiClient.fetchForecast("11.9404,108.4583")).thenReturn(WeatherApiForecastResult.builder()
                .query("11.9404,108.4583")
                .payload(objectMapper.readTree(payload))
                .rawPayload(payload)
                .fetchedAt(LocalDateTime.of(2026, 4, 30, 9, 30))
                .build());
        when(weatherForecastRepository.findByDestinationIdAndForecastDate(
                destination.getId(),
                LocalDate.of(2026, 4, 30)
        )).thenReturn(Optional.empty());
        when(weatherForecastRepository.save(any(WeatherForecast.class))).thenAnswer(invocation -> {
            WeatherForecast forecast = invocation.getArgument(0);
            forecast.setId(31L);
            return forecast;
        });
        when(weatherAlertRepository.findFirstByDestinationIdAndAlertTypeAndTitleAndValidFromAndValidTo(
                eq(destination.getId()),
                eq("Heavy rain"),
                eq("Canh bao mua lon"),
                eq(LocalDateTime.of(2026, 4, 30, 9, 0)),
                eq(LocalDateTime.of(2026, 4, 30, 15, 0))
        )).thenReturn(Optional.empty());
        when(weatherAlertRepository.save(any(WeatherAlert.class))).thenAnswer(invocation -> {
            WeatherAlert alert = invocation.getArgument(0);
            alert.setId(44L);
            return alert;
        });

        var response = weatherApiSyncService.syncDestination(destinationUuid);

        assertEquals(1, response.getForecastsSaved());
        assertEquals(1, response.getAlertsSaved());
        assertEquals("Da Lat", response.getLocationName());
        assertEquals("Mua vua", response.getForecasts().get(0).getSummary());
        assertEquals(WeatherSeverity.WARNING, response.getAlerts().get(0).getSeverity());
        verify(auditTrailRecorder).record(any(), eq(destination.getId()), any(), any());
    }
}

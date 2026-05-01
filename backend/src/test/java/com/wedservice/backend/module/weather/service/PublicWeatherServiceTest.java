package com.wedservice.backend.module.weather.service;

import com.wedservice.backend.common.exception.ResourceNotFoundException;
import com.wedservice.backend.module.destinations.entity.Destination;
import com.wedservice.backend.module.destinations.entity.DestinationStatus;
import com.wedservice.backend.module.destinations.repository.DestinationRepository;
import com.wedservice.backend.module.destinations.entity.CrowdLevel;
import com.wedservice.backend.module.weather.config.WeatherApiProperties;
import com.wedservice.backend.module.weather.entity.CrowdPrediction;
import com.wedservice.backend.module.weather.entity.RouteEstimate;
import com.wedservice.backend.module.weather.entity.WeatherAlert;
import com.wedservice.backend.module.weather.entity.WeatherForecast;
import com.wedservice.backend.module.weather.entity.WeatherSeverity;
import com.wedservice.backend.module.weather.integration.WeatherApiClient;
import com.wedservice.backend.module.weather.repository.CrowdPredictionRepository;
import com.wedservice.backend.module.weather.repository.RouteEstimateRepository;
import com.wedservice.backend.module.weather.repository.WeatherAlertRepository;
import com.wedservice.backend.module.weather.repository.WeatherForecastRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PublicWeatherServiceTest {

    @Mock
    private DestinationRepository destinationRepository;
    @Mock
    private WeatherForecastRepository weatherForecastRepository;
    @Mock
    private WeatherAlertRepository weatherAlertRepository;
    @Mock
    private CrowdPredictionRepository crowdPredictionRepository;
    @Mock
    private RouteEstimateRepository routeEstimateRepository;
    @Mock
    private WeatherApiClient weatherApiClient;

    private PublicWeatherService publicWeatherService;
    private WeatherApiProperties weatherApiProperties;

    @BeforeEach
    void setUp() {
        weatherApiProperties = new WeatherApiProperties();
        publicWeatherService = new PublicWeatherService(
                destinationRepository,
                weatherForecastRepository,
                weatherAlertRepository,
                crowdPredictionRepository,
                routeEstimateRepository,
                weatherApiClient,
                weatherApiProperties
        );
    }

    @Test
    void getDestinationForecasts_returnsUpcomingForecasts() {
        UUID destinationUuid = UUID.randomUUID();
        Destination destination = Destination.builder()
                .id(12L)
                .uuid(destinationUuid)
                .status(DestinationStatus.APPROVED)
                .isActive(true)
                .build();

        when(destinationRepository.findByUuid(destinationUuid)).thenReturn(Optional.of(destination));
        when(weatherForecastRepository.findByDestinationIdAndForecastDateGreaterThanEqualOrderByForecastDateAsc(
                destination.getId(),
                LocalDate.now()
        )).thenReturn(List.of(
                WeatherForecast.builder()
                        .id(1L)
                        .destinationId(destination.getId())
                        .forecastDate(LocalDate.now().plusDays(1))
                        .summary("Nang nhe")
                        .build()
        ));

        assertEquals(1, publicWeatherService.getDestinationForecasts(destinationUuid).size());
    }

    @Test
    void getDestinationForecasts_usesWeatherApiForecastWhenConfigured() throws Exception {
        UUID destinationUuid = UUID.randomUUID();
        Destination destination = Destination.builder()
                .id(12L)
                .uuid(destinationUuid)
                .status(DestinationStatus.APPROVED)
                .isActive(true)
                .latitude(new BigDecimal("21.0278"))
                .longitude(new BigDecimal("105.8342"))
                .build();
        JsonNode weatherApiPayload = JsonMapper.builder().findAndAddModules().build().readTree("""
                {
                  "forecast": {
                    "forecastday": [
                      {
                        "date": "2026-05-01",
                        "day": {
                          "maxtemp_c": 32.5,
                          "mintemp_c": 24.2,
                          "avghumidity": 81,
                          "maxwind_kph": 14.8,
                          "daily_chance_of_rain": 70,
                          "condition": {
                            "text": "Patchy rain nearby",
                            "code": 1063
                          }
                        }
                      }
                    ]
                  }
                }
                """);

        when(destinationRepository.findByUuid(destinationUuid)).thenReturn(Optional.of(destination));
        when(weatherApiClient.isConfigured()).thenReturn(true);
        when(weatherApiClient.getSourceName()).thenReturn("WeatherAPI.com");
        when(weatherApiClient.fetchForecast("21.0278,105.8342", 1, "no", "no"))
                .thenReturn(weatherApiPayload);

        List<com.wedservice.backend.module.weather.dto.response.WeatherForecastResponse> forecasts =
                publicWeatherService.getDestinationForecasts(destinationUuid);

        assertEquals(1, forecasts.size());
        assertEquals(LocalDate.of(2026, 5, 1), forecasts.getFirst().getForecastDate());
        assertEquals("1063", forecasts.getFirst().getWeatherCode());
        assertEquals("Patchy rain nearby", forecasts.getFirst().getSummary());
        assertEquals(0, new BigDecimal("24.2").compareTo(forecasts.getFirst().getTempMin()));
        assertEquals(0, new BigDecimal("32.5").compareTo(forecasts.getFirst().getTempMax()));
        assertEquals("WeatherAPI.com", forecasts.getFirst().getSourceName());
    }

    @Test
    void getDestinationAlerts_returnsCurrentActiveAlerts() {
        UUID destinationUuid = UUID.randomUUID();
        Destination destination = Destination.builder()
                .id(12L)
                .uuid(destinationUuid)
                .status(DestinationStatus.APPROVED)
                .isActive(true)
                .build();

        when(destinationRepository.findByUuid(destinationUuid)).thenReturn(Optional.of(destination));
        when(weatherAlertRepository
                .findByDestinationIdAndIsActiveTrueAndValidFromLessThanEqualAndValidToGreaterThanEqualOrderByValidFromDesc(
                        eq(destination.getId()),
                        any(LocalDateTime.class),
                        any(LocalDateTime.class)
                )).thenReturn(List.of(
                WeatherAlert.builder()
                        .id(3L)
                        .destinationId(destination.getId())
                        .severity(WeatherSeverity.WARNING)
                        .title("Mua lon")
                        .message("Canh bao")
                        .validFrom(LocalDateTime.now().minusHours(1))
                        .validTo(LocalDateTime.now().plusHours(2))
                        .isActive(true)
                        .build()
        ));

        assertEquals(1, publicWeatherService.getDestinationAlerts(destinationUuid).size());
    }

    @Test
    void getDestinationCrowdPredictions_returnsUpcomingPredictions() {
        UUID destinationUuid = UUID.randomUUID();
        Destination destination = Destination.builder()
                .id(12L)
                .uuid(destinationUuid)
                .status(DestinationStatus.APPROVED)
                .isActive(true)
                .build();

        when(destinationRepository.findByUuid(destinationUuid)).thenReturn(Optional.of(destination));
        when(crowdPredictionRepository.findByDestinationIdAndPredictionDateGreaterThanEqualOrderByPredictionDateAsc(
                destination.getId(),
                LocalDate.now()
        )).thenReturn(List.of(
                CrowdPrediction.builder()
                        .id(7L)
                        .destinationId(destination.getId())
                        .predictionDate(LocalDate.now().plusDays(1))
                        .crowdLevel(CrowdLevel.HIGH)
                        .build()
        ));

        assertEquals(1, publicWeatherService.getDestinationCrowdPredictions(destinationUuid).size());
    }

    @Test
    void getRouteEstimates_filtersByLabels() {
        when(routeEstimateRepository.findTop100ByOrderByCreatedAtDesc()).thenReturn(List.of(
                RouteEstimate.builder()
                        .id(1L)
                        .fromLabel("Ho Chi Minh City")
                        .toLabel("Da Lat")
                        .createdAt(LocalDateTime.now())
                        .build(),
                RouteEstimate.builder()
                        .id(2L)
                        .fromLabel("Ha Noi")
                        .toLabel("Sa Pa")
                        .createdAt(LocalDateTime.now().minusHours(1))
                        .build()
        ));

        assertEquals(1, publicWeatherService.getRouteEstimates("chi minh", "da lat").size());
    }

    @Test
    void getDestinationForecasts_rejectsInactiveDestination() {
        UUID destinationUuid = UUID.randomUUID();
        Destination destination = Destination.builder()
                .id(12L)
                .uuid(destinationUuid)
                .status(DestinationStatus.APPROVED)
                .isActive(false)
                .build();

        when(destinationRepository.findByUuid(destinationUuid)).thenReturn(Optional.of(destination));

        assertThrows(ResourceNotFoundException.class, () -> publicWeatherService.getDestinationForecasts(destinationUuid));
        verify(destinationRepository).findByUuid(destinationUuid);
    }
}

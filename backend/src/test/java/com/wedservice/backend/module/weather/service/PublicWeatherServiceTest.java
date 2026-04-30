package com.wedservice.backend.module.weather.service;

import com.wedservice.backend.common.exception.ResourceNotFoundException;
import com.wedservice.backend.module.destinations.entity.Destination;
import com.wedservice.backend.module.destinations.entity.DestinationStatus;
import com.wedservice.backend.module.destinations.repository.DestinationRepository;
import com.wedservice.backend.module.destinations.entity.CrowdLevel;
import com.wedservice.backend.module.weather.entity.CrowdPrediction;
import com.wedservice.backend.module.weather.entity.RouteEstimate;
import com.wedservice.backend.module.weather.entity.WeatherAlert;
import com.wedservice.backend.module.weather.entity.WeatherDisplayPolicy;
import com.wedservice.backend.module.weather.entity.WeatherForecast;
import com.wedservice.backend.module.weather.entity.WeatherNoticeStatus;
import com.wedservice.backend.module.weather.entity.WeatherPublicNotice;
import com.wedservice.backend.module.weather.entity.WeatherSeverity;
import com.wedservice.backend.module.weather.repository.CrowdPredictionRepository;
import com.wedservice.backend.module.weather.repository.RouteEstimateRepository;
import com.wedservice.backend.module.weather.repository.WeatherAlertRepository;
import com.wedservice.backend.module.weather.repository.WeatherDisplayPolicyRepository;
import com.wedservice.backend.module.weather.repository.WeatherForecastRepository;
import com.wedservice.backend.module.weather.repository.WeatherPublicNoticeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.lenient;
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
    private WeatherDisplayPolicyRepository weatherDisplayPolicyRepository;
    @Mock
    private WeatherPublicNoticeRepository weatherPublicNoticeRepository;
    @Mock
    private CrowdPredictionRepository crowdPredictionRepository;
    @Mock
    private RouteEstimateRepository routeEstimateRepository;

    private PublicWeatherService publicWeatherService;

    @BeforeEach
    void setUp() {
        publicWeatherService = new PublicWeatherService(
                destinationRepository,
                weatherForecastRepository,
                weatherAlertRepository,
                weatherDisplayPolicyRepository,
                weatherPublicNoticeRepository,
                crowdPredictionRepository,
                routeEstimateRepository
        );
        lenient().when(weatherDisplayPolicyRepository.findByDestinationId(any())).thenReturn(Optional.empty());
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
    void getDestinationWeatherNotice_returnsCuratedNoticeAndMaskedWeather() {
        UUID destinationUuid = UUID.randomUUID();
        Destination destination = Destination.builder()
                .id(12L)
                .uuid(destinationUuid)
                .status(DestinationStatus.APPROVED)
                .isActive(true)
                .build();
        WeatherDisplayPolicy policy = WeatherDisplayPolicy.builder()
                .destinationId(destination.getId())
                .showTemperature(false)
                .showAlertDetail(false)
                .build();

        when(destinationRepository.findByUuid(destinationUuid)).thenReturn(Optional.of(destination));
        when(weatherDisplayPolicyRepository.findByDestinationId(destination.getId())).thenReturn(Optional.of(policy));
        when(weatherForecastRepository.findByDestinationIdAndForecastDateGreaterThanEqualOrderByForecastDateAsc(
                eq(destination.getId()),
                any(LocalDate.class)
        )).thenReturn(List.of(
                WeatherForecast.builder()
                        .id(1L)
                        .destinationId(destination.getId())
                        .forecastDate(LocalDate.now())
                        .summary("Mua nhe")
                        .tempMin(BigDecimal.valueOf(24))
                        .tempMax(BigDecimal.valueOf(30))
                        .build()
        ));
        when(weatherPublicNoticeRepository
                .findByDestinationIdAndStatusAndDisplayFromLessThanEqualAndDisplayToGreaterThanEqualOrderByPinnedDescDisplayFromDesc(
                        eq(destination.getId()),
                        eq(WeatherNoticeStatus.PUBLISHED),
                        any(LocalDateTime.class),
                        any(LocalDateTime.class)
                )).thenReturn(List.of(
                WeatherPublicNotice.builder()
                        .id(9L)
                        .destinationId(destination.getId())
                        .severity(WeatherSeverity.WARNING)
                        .title("Mua lon")
                        .summary("Nen mang ao mua")
                        .detail("Mua lon trong khung gio chieu")
                        .displayFrom(LocalDateTime.now().minusHours(1))
                        .displayTo(LocalDateTime.now().plusHours(3))
                        .status(WeatherNoticeStatus.PUBLISHED)
                        .pinned(true)
                        .build()
        ));
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
                        .alertType("rain")
                        .title("Mua lon")
                        .message("Canh bao chi tiet")
                        .validFrom(LocalDateTime.now().minusHours(1))
                        .validTo(LocalDateTime.now().plusHours(2))
                        .isActive(true)
                        .build()
        ));

        var response = publicWeatherService.getDestinationWeatherNotice(destinationUuid);

        assertEquals(1, response.getNotices().size());
        assertEquals("Nen mang ao mua", response.getNotices().get(0).getSummary());
        assertNull(response.getCurrentForecast().getTempMin());
        assertNull(response.getActiveAlerts().get(0).getMessage());
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

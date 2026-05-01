package com.wedservice.backend.module.weather.controller;

import com.wedservice.backend.common.exception.GlobalExceptionHandler;
import com.wedservice.backend.module.weather.facade.WeatherFacade;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.converter.json.JacksonJsonHttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class WeatherApiControllerTest {

    @Mock
    private WeatherFacade weatherFacade;

    private MockMvc mockMvc;
    private JsonMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = JsonMapper.builder().findAndAddModules().build();
        mockMvc = MockMvcBuilders.standaloneSetup(new WeatherApiController(weatherFacade))
                .setControllerAdvice(new GlobalExceptionHandler())
                .setMessageConverters(new JacksonJsonHttpMessageConverter(objectMapper))
                .build();
    }

    @Test
    void getRealtime_returnsWrappedWeatherApiResponse() throws Exception {
        JsonNode payload = objectMapper.readTree("""
                {
                  "current": {
                    "temp_c": 29.0,
                    "condition": {
                      "text": "Partly cloudy"
                    }
                  }
                }
                """);
        when(weatherFacade.getRealtime("Hanoi", "no")).thenReturn(payload);

        mockMvc.perform(get("/weather/realtime").param("q", "Hanoi"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Realtime weather fetched successfully"))
                .andExpect(jsonPath("$.data.current.temp_c").value(29.0))
                .andExpect(jsonPath("$.data.current.condition.text").value("Partly cloudy"));
    }

    @Test
    void getForecast_usesWeatherApiForecastParameters() throws Exception {
        JsonNode payload = objectMapper.readTree("""
                {
                  "forecast": {
                    "forecastday": [
                      {
                        "date": "2026-05-01"
                      }
                    ]
                  }
                }
                """);
        when(weatherFacade.getForecast("Hanoi", 1, "no", "no")).thenReturn(payload);

        mockMvc.perform(get("/weather/forecast").param("q", "Hanoi"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Weather forecast fetched successfully"))
                .andExpect(jsonPath("$.data.forecast.forecastday[0].date").value("2026-05-01"));
    }

    @Test
    void searchLocations_returnsWrappedWeatherApiResponse() throws Exception {
        JsonNode payload = objectMapper.readTree("""
                [
                  {
                    "name": "Hanoi",
                    "country": "Vietnam"
                  }
                ]
                """);
        when(weatherFacade.searchLocations("Hanoi")).thenReturn(payload);

        mockMvc.perform(get("/weather/search").param("q", "Hanoi"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Weather locations fetched successfully"))
                .andExpect(jsonPath("$.data[0].name").value("Hanoi"));
    }

    @Test
    void lookupIp_returnsWrappedWeatherApiResponse() throws Exception {
        JsonNode payload = objectMapper.readTree("""
                {
                  "ip": "8.8.8.8",
                  "type": "ipv4",
                  "country_name": "United States"
                }
                """);
        when(weatherFacade.lookupIp("8.8.8.8")).thenReturn(payload);

        mockMvc.perform(get("/weather/ip").param("q", "8.8.8.8"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Weather IP lookup fetched successfully"))
                .andExpect(jsonPath("$.data.ip").value("8.8.8.8"));
    }
}

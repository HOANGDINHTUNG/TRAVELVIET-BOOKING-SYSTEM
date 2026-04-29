package com.wedservice.backend.module.destinations.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class DestinationPublicControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private UUID destinationUuid;

    @BeforeEach
    void setUp() {
        jdbcTemplate.update("DELETE FROM destination_media");
        jdbcTemplate.update("DELETE FROM destinations");

        destinationUuid = UUID.randomUUID();
        jdbcTemplate.update("""
                INSERT INTO destinations (
                    uuid, code, name, slug, country_code, province, crowd_level_default,
                    is_featured, is_active, status, is_official, created_at, updated_at
                )
                VALUES (?, 'HCM-001', 'Ho Chi Minh City', 'ho-chi-minh-city', 'VN', 'Ho Chi Minh',
                        'medium', false, true, 'approved', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                """, destinationUuid.toString());

        Long destinationId = jdbcTemplate.queryForObject(
                "SELECT id FROM destinations WHERE uuid = ?",
                Long.class,
                destinationUuid.toString()
        );

        jdbcTemplate.update("""
                INSERT INTO destination_media (
                    destination_id, media_type, media_url, alt_text, sort_order, is_active, created_at, updated_at
                )
                VALUES (?, 'image', 'https://example.com/hcm.jpg', 'Cover', 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                """, destinationId);
    }

    @Test
    void searchDestinations_returnsApprovedActiveDestinationWithLowercaseDbEnums() throws Exception {
        mockMvc.perform(get("/destinations"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalElements").value(1))
                .andExpect(jsonPath("$.data.content[0].uuid").value(destinationUuid.toString()))
                .andExpect(jsonPath("$.data.content[0].name").value("Ho Chi Minh City"))
                .andExpect(jsonPath("$.data.content[0].crowdLevelDefault").value("MEDIUM"))
                .andExpect(jsonPath("$.data.content[0].coverImageUrl").value("https://example.com/hcm.jpg"));
    }

    @Test
    void getDestination_returnsApprovedActiveDestinationWithLowercaseDbEnums() throws Exception {
        mockMvc.perform(get("/destinations/" + destinationUuid))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.uuid").value(destinationUuid.toString()))
                .andExpect(jsonPath("$.data.name").value("Ho Chi Minh City"))
                .andExpect(jsonPath("$.data.crowdLevelDefault").value("MEDIUM"))
                .andExpect(jsonPath("$.data.mediaList[0].mediaType").value("IMAGE"));
    }
}

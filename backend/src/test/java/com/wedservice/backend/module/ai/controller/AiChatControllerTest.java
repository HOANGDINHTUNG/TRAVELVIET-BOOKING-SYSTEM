package com.wedservice.backend.module.ai.controller;

import com.wedservice.backend.common.exception.GlobalExceptionHandler;
import com.wedservice.backend.module.ai.dto.AiChatRequest;
import com.wedservice.backend.module.ai.dto.AiChatResponse;
import com.wedservice.backend.module.ai.service.AiChatOrchestrator;
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

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AiChatControllerTest {
    @Mock
    private AiChatOrchestrator aiChatOrchestrator;

    private MockMvc mockMvc;
    private JsonMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = JsonMapper.builder().findAndAddModules().build();
        mockMvc = MockMvcBuilders.standaloneSetup(new AiChatController(aiChatOrchestrator))
                .setControllerAdvice(GlobalExceptionHandler.standalone())
                .setMessageConverters(new JacksonJsonHttpMessageConverter(objectMapper))
                .build();
    }

    @Test
    void chatReturnsDirectAiContract() throws Exception {
        when(aiChatOrchestrator.handle(any(AiChatRequest.class))).thenReturn(AiChatResponse.builder()
                .intent("TOUR_SEARCH")
                .answer("Hiện hệ thống có tour phù hợp.")
                .dataFound(true)
                .suggestions(List.of("Tìm tour Đà Lạt 3 ngày 2 đêm"))
                .build());

        mockMvc.perform(post("/ai/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(AiChatRequest.builder()
                                .message("Tôi muốn đi Đà Lạt")
                                .conversationId("conv-1")
                                .userId("ignored-from-client")
                                .build())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").doesNotExist())
                .andExpect(jsonPath("$.intent").value("TOUR_SEARCH"))
                .andExpect(jsonPath("$.answer").value("Hiện hệ thống có tour phù hợp."))
                .andExpect(jsonPath("$.dataFound").value(true))
                .andExpect(jsonPath("$.suggestions[0]").value("Tìm tour Đà Lạt 3 ngày 2 đêm"));
    }

    @Test
    void chatRejectsBlankMessage() throws Exception {
        mockMvc.perform(post("/ai/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(AiChatRequest.builder()
                                .message(" ")
                                .build())))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errorCode").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.errors.message").exists());
    }
}

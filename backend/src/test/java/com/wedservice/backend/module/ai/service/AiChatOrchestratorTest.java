package com.wedservice.backend.module.ai.service;

import com.wedservice.backend.module.ai.dto.AiChatRequest;
import com.wedservice.backend.module.ai.dto.AiDataResult;
import com.wedservice.backend.module.ai.dto.IntentResult;
import com.wedservice.backend.module.ai.enums.ChatIntent;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

class AiChatOrchestratorTest {
    private final IntentDetectionService intentDetectionService = mock(IntentDetectionService.class);
    private final AiDataProvider aiDataProvider = mock(AiDataProvider.class);
    private final PromptBuilderService promptBuilderService = mock(PromptBuilderService.class);
    private final GeminiService geminiService = mock(GeminiService.class);
    private final AiChatOrchestrator orchestrator = new AiChatOrchestrator(
            intentDetectionService,
            aiDataProvider,
            promptBuilderService,
            geminiService
    );

    @Test
    void returnsFallbackWithoutCallingGeminiWhenNoDataFound() {
        String message = "Hộp hàng SBX123 có bị va đập không?";
        IntentResult intent = IntentResult.builder()
                .intent(ChatIntent.SENSOR_STATUS)
                .trackingCode("SBX123")
                .build();
        AiDataResult data = AiDataResult.noData(List.of("Tìm tour phù hợp"));

        when(intentDetectionService.detect(message)).thenReturn(intent);
        when(aiDataProvider.getData(intent, message)).thenReturn(data);

        var response = orchestrator.handle(AiChatRequest.builder().message(message).build());

        assertThat(response.getIntent()).isEqualTo(ChatIntent.SENSOR_STATUS.name());
        assertThat(response.isDataFound()).isFalse();
        assertThat(response.getAnswer()).isEqualTo(AiChatMessages.NO_DATA);
        verifyNoInteractions(promptBuilderService, geminiService);
    }

    @Test
    void callsGeminiWhenBackendDataExists() {
        String message = "Tôi muốn đi Đà Lạt";
        IntentResult intent = IntentResult.builder()
                .intent(ChatIntent.TOUR_SEARCH)
                .location("Đà Lạt")
                .build();
        AiDataResult data = AiDataResult.found("Tên tour: Đà Lạt 3 ngày", List.of("Tour giá dưới 5 triệu"));

        when(intentDetectionService.detect(message)).thenReturn(intent);
        when(aiDataProvider.getData(intent, message)).thenReturn(data);
        when(promptBuilderService.buildPrompt(message, intent, data)).thenReturn("safe prompt");
        when(geminiService.generateAnswer("safe prompt")).thenReturn("Có tour Đà Lạt phù hợp.");

        var response = orchestrator.handle(AiChatRequest.builder().message(message).build());

        assertThat(response.getIntent()).isEqualTo(ChatIntent.TOUR_SEARCH.name());
        assertThat(response.isDataFound()).isTrue();
        assertThat(response.getAnswer()).isEqualTo("Có tour Đà Lạt phù hợp.");
        verify(geminiService).generateAnswer("safe prompt");
    }

    @Test
    void returnsErrorContractWhenGeminiFails() {
        String message = "Tôi muốn đi Đà Lạt";
        IntentResult intent = IntentResult.builder()
                .intent(ChatIntent.TOUR_SEARCH)
                .location("Đà Lạt")
                .build();
        AiDataResult data = AiDataResult.found("Tên tour: Đà Lạt 3 ngày", List.of("Tour giá dưới 5 triệu"));

        when(intentDetectionService.detect(message)).thenReturn(intent);
        when(aiDataProvider.getData(intent, message)).thenReturn(data);
        when(promptBuilderService.buildPrompt(message, intent, data)).thenReturn("safe prompt");
        when(geminiService.generateAnswer("safe prompt")).thenReturn(GeminiService.ERROR_ANSWER);

        var response = orchestrator.handle(AiChatRequest.builder().message(message).build());

        assertThat(response.getIntent()).isEqualTo(ChatIntent.UNKNOWN.name());
        assertThat(response.isDataFound()).isFalse();
        assertThat(response.getAnswer()).isEqualTo(GeminiService.ERROR_ANSWER);
        assertThat(response.getSuggestions()).isEmpty();
    }
}

package com.wedservice.backend.module.ai.service;

import com.wedservice.backend.module.ai.dto.AiChatRequest;
import com.wedservice.backend.module.ai.dto.AiChatResponse;
import com.wedservice.backend.module.ai.dto.AiDataResult;
import com.wedservice.backend.module.ai.dto.IntentResult;
import com.wedservice.backend.module.ai.enums.ChatIntent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiChatOrchestrator {
    private final IntentDetectionService intentDetectionService;
    private final AiDataProvider aiDataProvider;
    private final PromptBuilderService promptBuilderService;
    private final GeminiService geminiService;

    public AiChatResponse handle(AiChatRequest request) {
        try {
            String message = request.getMessage().trim();
            IntentResult intentResult = intentDetectionService.detect(message);
            AiDataResult dataResult = aiDataProvider.getData(intentResult, message);

            if (!dataResult.isDataFound()) {
                return AiChatResponse.builder()
                        .intent(intentResult.getIntent().name())
                        .answer(resolveFallback(dataResult))
                        .dataFound(false)
                        .suggestions(dataResult.getSuggestions())
                        .build();
            }

            String prompt = promptBuilderService.buildPrompt(message, intentResult, dataResult);
            String answer = geminiService.generateAnswer(prompt);
            if (!StringUtils.hasText(answer) || AiChatMessages.ERROR.equals(answer)) {
                return errorResponse();
            }

            return AiChatResponse.builder()
                    .intent(intentResult.getIntent().name())
                    .answer(answer)
                    .dataFound(true)
                    .suggestions(dataResult.getSuggestions())
                    .build();
        } catch (Exception e) {
            log.warn("AI chat handling failed: {}", e.getMessage());
            return errorResponse();
        }
    }

    private AiChatResponse errorResponse() {
        return AiChatResponse.builder()
                .intent(ChatIntent.UNKNOWN.name())
                .answer(AiChatMessages.ERROR)
                .dataFound(false)
                .suggestions(List.of())
                .build();
    }

    private String resolveFallback(AiDataResult dataResult) {
        return StringUtils.hasText(dataResult.getFallbackAnswer())
                ? dataResult.getFallbackAnswer()
                : AiChatMessages.NO_DATA;
    }
}

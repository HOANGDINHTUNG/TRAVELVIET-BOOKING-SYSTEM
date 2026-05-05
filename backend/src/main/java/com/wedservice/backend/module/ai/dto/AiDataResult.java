package com.wedservice.backend.module.ai.dto;

import com.wedservice.backend.module.ai.service.AiChatMessages;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiDataResult {
    private boolean dataFound;
    private String context;
    private List<String> suggestions;
    private String fallbackAnswer;

    public static AiDataResult found(String context, List<String> suggestions) {
        return AiDataResult.builder()
                .dataFound(true)
                .context(context)
                .suggestions(suggestions == null ? List.of() : suggestions)
                .build();
    }

    public static AiDataResult noData(List<String> suggestions) {
        return noData(AiChatMessages.NO_DATA, suggestions);
    }

    public static AiDataResult noData(String fallbackAnswer, List<String> suggestions) {
        return AiDataResult.builder()
                .dataFound(false)
                .context(AiChatMessages.NO_DATA_CONTEXT)
                .fallbackAnswer(fallbackAnswer)
                .suggestions(suggestions == null ? List.of() : suggestions)
                .build();
    }
}

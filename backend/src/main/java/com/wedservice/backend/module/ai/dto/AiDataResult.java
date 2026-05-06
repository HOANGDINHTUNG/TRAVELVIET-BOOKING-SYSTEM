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
    private List<AiRelatedItem> relatedItems;
    private String fallbackAnswer;

    public static AiDataResult found(String context, List<String> suggestions) {
        return found(context, suggestions, List.of(), null);
    }

    public static AiDataResult found(
            String context,
            List<String> suggestions,
            List<AiRelatedItem> relatedItems,
            String fallbackAnswer
    ) {
        return AiDataResult.builder()
                .dataFound(true)
                .context(context)
                .suggestions(suggestions == null ? List.of() : suggestions)
                .relatedItems(relatedItems == null ? List.of() : relatedItems)
                .fallbackAnswer(fallbackAnswer)
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
                .relatedItems(List.of())
                .build();
    }
}

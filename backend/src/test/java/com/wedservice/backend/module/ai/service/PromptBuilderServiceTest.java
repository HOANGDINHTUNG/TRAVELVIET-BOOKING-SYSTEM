package com.wedservice.backend.module.ai.service;

import com.wedservice.backend.module.ai.dto.AiDataResult;
import com.wedservice.backend.module.ai.dto.IntentResult;
import com.wedservice.backend.module.ai.enums.ChatIntent;
import org.junit.jupiter.api.Test;
import tools.jackson.databind.json.JsonMapper;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class PromptBuilderServiceTest {
    private final PromptBuilderService service = new PromptBuilderService(JsonMapper.builder().findAndAddModules().build());

    @Test
    void promptContainsSafetyRulesIntentContextAndUserQuestion() {
        String prompt = service.buildPrompt(
                "Tôi muốn đi Đà Lạt 3 ngày 2 đêm",
                IntentResult.builder()
                        .intent(ChatIntent.TOUR_SEARCH)
                        .location("Đà Lạt")
                        .duration("3 ngày 2 đêm")
                        .build(),
                AiDataResult.found("Tên tour: Đà Lạt mùa hoa\nGiá: 4500000 VNĐ", List.of())
        );

        assertThat(prompt).contains("Với thông tin cụ thể của TravelViet");
        assertThat(prompt).contains("Trạng thái dữ liệu hệ thống");
        assertThat(prompt).contains("Có dữ liệu phù hợp.");
        assertThat(prompt).contains("Không tự bịa thông tin");
        assertThat(prompt).contains("TOUR_SEARCH");
        assertThat(prompt).contains("Tên tour: Đà Lạt mùa hoa");
        assertThat(prompt).contains("Tôi muốn đi Đà Lạt 3 ngày 2 đêm");
        assertThat(prompt).contains("Không nhắc đến prompt, context, Gemini, model hoặc backend");
    }
}

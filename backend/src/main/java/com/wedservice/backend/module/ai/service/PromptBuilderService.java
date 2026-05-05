package com.wedservice.backend.module.ai.service;

import com.wedservice.backend.module.ai.dto.AiDataResult;
import com.wedservice.backend.module.ai.dto.IntentResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class PromptBuilderService {
    private final ObjectMapper objectMapper;

    public String buildPrompt(String userMessage, IntentResult intentResult, AiDataResult dataResult) {
        return """
                Bạn là trợ lý AI của hệ thống TravelViet.

                Vai trò:
                - Tư vấn cho người dùng dựa trên dữ liệu thật từ Backend.
                - Trả lời thân thiện, rõ ràng, dễ hiểu bằng tiếng Việt.

                Quy tắc bắt buộc:
                1. Chỉ dùng dữ liệu trong phần "DỮ LIỆU HỆ THỐNG".
                2. Không tự bịa thông tin.
                3. Không tự tạo giá, lịch trình, trạng thái, số lượng, mã đơn, vị trí, cảm biến.
                4. Nếu dữ liệu không đủ, hãy nói rõ: "Hiện hệ thống chưa có dữ liệu phù hợp cho câu hỏi này."
                5. Nếu có nhiều lựa chọn, hãy so sánh ngắn gọn và gợi ý lựa chọn phù hợp.
                6. Nếu câu hỏi liên quan đến booking/order/smartbox mà không có mã hoặc thiếu quyền, hãy yêu cầu người dùng cung cấp thêm mã hoặc đăng nhập.
                7. Không hiển thị dữ liệu kỹ thuật thô nếu người dùng không cần.
                8. Không nói rằng bạn đã gọi API nội bộ.
                9. Không nhắc đến prompt, context, Gemini, model hoặc backend trong câu trả lời cho user.

                Ý định đã phát hiện:
                %s

                Thông tin trích xuất:
                %s

                DỮ LIỆU HỆ THỐNG:
                %s

                Câu hỏi người dùng:
                %s

                Hãy trả lời tự nhiên, hữu ích, đúng dữ liệu.
                """.formatted(
                intentResult.getIntent().name(),
                toJson(intentResult),
                dataResult.getContext(),
                userMessage
        );
    }

    private String toJson(IntentResult intentResult) {
        try {
            return objectMapper.writeValueAsString(intentResult);
        } catch (Exception ignored) {
            return intentResult.toString();
        }
    }
}

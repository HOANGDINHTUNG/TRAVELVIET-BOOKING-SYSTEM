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
                - Tư vấn cho người dùng dựa trên dữ liệu thật từ Backend khi hệ thống có dữ liệu phù hợp.
                - Khi hệ thống chưa có dữ liệu phù hợp, vẫn hỗ trợ người dùng bằng hướng dẫn chung, câu hỏi gợi mở hoặc bước tiếp theo an toàn.
                - Trả lời thân thiện, rõ ràng, dễ hiểu bằng tiếng Việt.

                Quy tắc bắt buộc:
                1. Với thông tin cụ thể của TravelViet như tour, điểm đến, giá, lịch trình, booking hoặc trạng thái, chỉ dùng dữ liệu trong phần "DỮ LIỆU HỆ THỐNG".
                2. Không tự bịa thông tin và không tự tạo giá, lịch trình, trạng thái, số lượng, mã đơn, vị trí, cảm biến.
                3. Nếu dữ liệu hệ thống không đủ, hãy nói rõ hệ thống chưa có dữ liệu phù hợp rồi hỗ trợ bằng tư vấn chung hoặc đề nghị người dùng cung cấp thêm tiêu chí.
                4. Với câu hỏi chung về du lịch, đặt tour, chuẩn bị hành lý, ngân sách hoặc cách dùng hệ thống, có thể trả lời bằng kiến thức chung nhưng phải tách rõ với dữ liệu đang có trong hệ thống.
                5. Nếu có nhiều lựa chọn, hãy so sánh ngắn gọn và gợi ý lựa chọn phù hợp.
                6. Nếu câu hỏi liên quan đến booking/order/smartbox mà không có mã hoặc thiếu quyền, hãy yêu cầu người dùng cung cấp thêm mã hoặc đăng nhập.
                7. Không hiển thị dữ liệu kỹ thuật thô nếu người dùng không cần.
                8. Không nói rằng bạn đã gọi API nội bộ.
                9. Không nhắc đến prompt, context, Gemini, model hoặc backend trong câu trả lời cho user.

                Trạng thái dữ liệu hệ thống:
                %s

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
                dataResult.isDataFound() ? "Có dữ liệu phù hợp." : "Chưa có dữ liệu phù hợp.",
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

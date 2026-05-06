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

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;

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

            if (shouldAskGemini(intentResult, dataResult)) {
                String prompt = promptBuilderService.buildPrompt(message, intentResult, dataResult);
                String answer = geminiService.generateAnswer(prompt);
                if (isUsableAnswer(answer)) {
                    return AiChatResponse.builder()
                            .intent(intentResult.getIntent().name())
                            .answer(answer)
                            .dataFound(dataResult.isDataFound())
                            .suggestions(dataResult.getSuggestions())
                            .relatedItems(dataResult.getRelatedItems())
                            .build();
                }

                log.warn("Gemini did not return a usable AI chat answer for intent {}", intentResult.getIntent());
            }

            return fallbackResponse(intentResult, dataResult, message);
        } catch (Exception e) {
            log.warn("AI chat handling failed: {}", e.getMessage());
            return errorResponse();
        }
    }

    private boolean shouldAskGemini(IntentResult intentResult, AiDataResult dataResult) {
        if (dataResult.isDataFound()) {
            return true;
        }

        return switch (intentResult.getIntent()) {
            case ORDER_TRACKING, SHIPMENT_TRACKING, SMARTBOX_STATUS, SENSOR_STATUS, BOOKING_LOOKUP -> false;
            case TOUR_SEARCH, DESTINATION_SEARCH, PRICE_ADVICE, SUPPORT_REQUEST, GENERAL_FAQ, UNKNOWN -> true;
        };
    }

    private boolean isUsableAnswer(String answer) {
        return StringUtils.hasText(answer) && !AiChatMessages.ERROR.equals(answer);
    }

    private AiChatResponse fallbackResponse(IntentResult intentResult, AiDataResult dataResult, String userMessage) {
        return AiChatResponse.builder()
                .intent(intentResult.getIntent().name())
                .answer(resolveFallback(intentResult, dataResult, userMessage))
                .dataFound(dataResult.isDataFound())
                .suggestions(dataResult.getSuggestions())
                .relatedItems(dataResult.getRelatedItems())
                .build();
    }

    private AiChatResponse errorResponse() {
        return AiChatResponse.builder()
                .intent(ChatIntent.UNKNOWN.name())
                .answer(AiChatMessages.ERROR)
                .dataFound(false)
                .suggestions(List.of())
                .relatedItems(List.of())
                .build();
    }

    private String resolveFallback(IntentResult intentResult, AiDataResult dataResult, String userMessage) {
        if (dataResult.isDataFound() && StringUtils.hasText(dataResult.getFallbackAnswer())) {
            return dataResult.getFallbackAnswer();
        }

        if (dataResult.isDataFound()) {
            return "Mình tìm thấy một vài thông tin phù hợp. Bạn có thể mở các gợi ý bên dưới để xem chi tiết.";
        }

        if (StringUtils.hasText(dataResult.getFallbackAnswer())
                && !AiChatMessages.NO_DATA.equals(dataResult.getFallbackAnswer())) {
            return dataResult.getFallbackAnswer();
        }

        return switch (intentResult.getIntent()) {
            case TOUR_SEARCH, PRICE_ADVICE -> "Hiện chưa có thông tin tour phù hợp với câu hỏi này. Bạn có thể cho mình điểm đến, ngân sách, số ngày đi hoặc nhóm khách để mình tìm lại.";
            case DESTINATION_SEARCH -> "Hiện chưa có thông tin điểm đến phù hợp. Bạn có thể hỏi theo vùng miền, tỉnh/thành hoặc kiểu trải nghiệm như biển, núi, nghỉ dưỡng, gia đình.";
            case BOOKING_LOOKUP -> AiChatMessages.LOGIN_REQUIRED;
            case ORDER_TRACKING, SHIPMENT_TRACKING, SMARTBOX_STATUS, SENSOR_STATUS -> "Hiện chưa có thông tin phù hợp cho loại yêu cầu này. Bạn có thể liên hệ hỗ trợ hoặc cung cấp thêm mã liên quan nếu hệ thống đã hỗ trợ chức năng đó.";
            case SUPPORT_REQUEST -> "Mình có thể hỗ trợ các vấn đề về đặt tour, thanh toán, hủy/đổi lịch và tư vấn tour. Bạn mô tả vấn đề cụ thể để mình hướng dẫn bước tiếp theo.";
            case GENERAL_FAQ, UNKNOWN -> generalFallback(userMessage);
        };
    }

    private String generalFallback(String userMessage) {
        String text = normalize(userMessage);
        if (containsAny(text, "chuan bi", "hanh ly", "mang gi", "can mang")) {
            return """
                    Khi đi du lịch, bạn nên chuẩn bị:
                    - Giấy tờ cá nhân, vé/booking, giấy tờ trẻ em nếu đi cùng gia đình.
                    - Quần áo phù hợp thời tiết, giày dễ đi, áo khoác mỏng hoặc đồ mưa.
                    - Thuốc cá nhân, sạc điện thoại, pin dự phòng và một ít tiền mặt.
                    - Kiểm tra giờ khởi hành, điểm đón, chính sách hành lý và số hotline hỗ trợ trước ngày đi.
                    Nếu bạn cho mình biết điểm đến và số ngày đi, mình có thể gợi ý danh sách chuẩn bị sát hơn.
                    """.trim();
        }
        if (containsAny(text, "ngan sach", "chi phi", "tiet kiem", "gia re")) {
            return "Để tối ưu ngân sách, bạn nên chốt số ngày đi, chọn mùa thấp điểm nếu linh hoạt, ưu tiên tour đã gồm xe/khách sạn/vé tham quan và giữ một khoản dự phòng cho ăn uống, phát sinh cá nhân. Bạn có thể cho mình ngân sách và điểm đến để mình tìm tour phù hợp trong hệ thống.";
        }
        if (containsAny(text, "huong dan", "dat tour", "thanh toan")) {
            return "Bạn có thể chọn tour phù hợp, kiểm tra lịch khởi hành còn chỗ, nhập thông tin khách, áp dụng voucher nếu có rồi thanh toán theo hướng dẫn. Nếu cần kiểm tra booking cá nhân, bạn hãy đăng nhập để hệ thống lấy đúng thông tin.";
        }
        return "Mình có thể hỗ trợ tư vấn tour, điểm đến, ngân sách, lịch trình và thông tin đặt tour. Bạn hãy cho mình biết bạn muốn đi đâu, đi mấy ngày, ngân sách khoảng bao nhiêu hoặc cần hỗ trợ phần nào.";
    }

    private String normalize(String value) {
        String lower = value == null ? "" : value.toLowerCase(Locale.ROOT).trim();
        String normalized = Normalizer.normalize(lower, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .replace('đ', 'd')
                .replace('Đ', 'D');
        return normalized.replaceAll("\\s+", " ");
    }

    private boolean containsAny(String text, String... values) {
        for (String value : values) {
            if (text.contains(value)) {
                return true;
            }
        }
        return false;
    }

}

package com.wedservice.backend.module.ai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiChatRequest {
    @NotBlank(message = "Noi dung chat khong duoc de trong")
    @Size(max = 2000, message = "Noi dung chat khong duoc vuot qua 2000 ky tu")
    private String message;

    private String conversationId;

    private String userId;
}

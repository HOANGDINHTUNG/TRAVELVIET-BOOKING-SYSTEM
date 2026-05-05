package com.wedservice.backend.module.ai.controller;

import com.wedservice.backend.module.ai.dto.AiChatRequest;
import com.wedservice.backend.module.ai.dto.AiChatResponse;
import com.wedservice.backend.module.ai.service.AiChatOrchestrator;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class AiChatController {
    private final AiChatOrchestrator aiChatOrchestrator;

    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chat(@Valid @RequestBody AiChatRequest request) {
        return ResponseEntity.ok(aiChatOrchestrator.handle(request));
    }
}

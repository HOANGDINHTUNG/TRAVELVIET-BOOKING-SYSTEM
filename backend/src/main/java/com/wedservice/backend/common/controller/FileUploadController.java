package com.wedservice.backend.common.controller;

import com.wedservice.backend.common.response.ApiResponse;
import com.wedservice.backend.common.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/media")
@RequiredArgsConstructor
public class FileUploadController {

    private final FileService fileService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) throws Exception {
        String url = fileService.uploadFile(file);
        return ApiResponse.success(Map.of("url", url), "File uploaded successfully");
    }
}

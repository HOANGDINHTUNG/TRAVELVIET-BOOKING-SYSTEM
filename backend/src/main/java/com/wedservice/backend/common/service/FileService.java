package com.wedservice.backend.common.service;

import com.wedservice.backend.common.exception.BadRequestException;
import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
public class FileService {

    private final MinioClient minioClient;

    @Value("${minio.bucketName}")
    private String bucketName;

    @Value("${minio.url}")
    private String minioUrl;

    public FileService(@Autowired(required = false) MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    public String uploadFile(MultipartFile file) throws Exception {
        if (minioClient == null) {
            throw BadRequestException.i18n("api.error.file.storageNotConfigured");
        }
        if (file == null || file.isEmpty()) {
            throw BadRequestException.i18n("api.error.file.uploadEmpty");
        }

        ensureBucketExists();

        String originalFilename = StringUtils.cleanPath(
                file.getOriginalFilename() == null ? "file" : file.getOriginalFilename()
        );
        String safeFilename = originalFilename
                .replace("\\", "/")
                .replaceAll("^.*/", "")
                .replaceAll("[^A-Za-z0-9._-]", "_");
        String fileName = UUID.randomUUID() + "-" + safeFilename;
        String contentType = StringUtils.hasText(file.getContentType())
                ? file.getContentType()
                : "application/octet-stream";

        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket(bucketName)
                        .object(fileName)
                        .stream(file.getInputStream(), file.getSize(), -1)
                        .contentType(contentType)
                        .build()
        );

        return minioUrl.replaceAll("/+$", "") + "/" + bucketName + "/" + fileName;
    }

    private void ensureBucketExists() throws Exception {
        boolean exists = minioClient.bucketExists(
                BucketExistsArgs.builder()
                        .bucket(bucketName)
                        .build()
        );

        if (!exists) {
            minioClient.makeBucket(
                    MakeBucketArgs.builder()
                            .bucket(bucketName)
                            .build()
            );
        }
    }
}

package in.bouziani.billingsoftwar.service.impl;

import in.bouziani.billingsoftwar.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileUploadServiceImpl implements FileUploadService {

    private final S3Client s3Client;

    @Value("${aws.bucket.name}")
    private String bucketName;

    @Override
    public String uploadFile(MultipartFile file) {

        if (file.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "File is empty"
            );
        }

        String originalFilename = file.getOriginalFilename();
        String filenameExtension = "";

        // Safely extract extension
        if (originalFilename != null && originalFilename.contains(".")) {
            filenameExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        // Generate unique key (file name in S3)
        String key = UUID.randomUUID().toString() + filenameExtension;

        try {
            // Removed the .acl() line because the MinIO bucket is already public
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    .build();

            PutObjectResponse response = s3Client.putObject(
                    putObjectRequest,
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize())
            );

            if (response.sdkHttpResponse().isSuccessful()) {
                // Hardcoded to your MinIO container address
                return "http://localhost:9000/" + bucketName + "/" + key;
            } else {
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Failed to upload file to MinIO"
                );
            }

        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "An error occurred while uploading file to MinIO",
                    e
            );
        }
    }
    @Override
    public boolean deleteFile(String imgUrl) {

        try {
            // Extract filename from URL
            String filename = imgUrl.substring(imgUrl.lastIndexOf("/") + 1);

            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(filename)
                    .build();

            s3Client.deleteObject(deleteObjectRequest);

            return true;

        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to delete file from S3",
                    e
            );
        }
    }

}

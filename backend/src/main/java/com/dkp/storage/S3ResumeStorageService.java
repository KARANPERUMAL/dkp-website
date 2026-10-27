package com.dkp.storage;

import com.dkp.common.InvalidFileException;
import com.dkp.config.AppProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.http.urlconnection.UrlConnectionHttpClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3ClientBuilder;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.util.Optional;
import java.util.UUID;

public class S3ResumeStorageService implements ResumeStorageService {

    private static final Logger log = LoggerFactory.getLogger(S3ResumeStorageService.class);
    private final S3Client s3Client;
    private final String bucketName;
    private final FileValidator fileValidator;

    public S3ResumeStorageService(AppProperties appProperties, FileValidator fileValidator) {
        this.bucketName = appProperties.getStorage().getBucket();
        this.fileValidator = fileValidator;

        var storage = appProperties.getStorage();
        S3ClientBuilder builder = S3Client.builder()
                .httpClient(UrlConnectionHttpClient.builder().build())
                .region(Region.of(storage.getRegion()));

        if (StringUtils.hasText(storage.getEndpoint())) {
            builder.endpointOverride(URI.create(storage.getEndpoint()));
        }

        if (StringUtils.hasText(storage.getAccessKey()) && StringUtils.hasText(storage.getSecretKey())) {
            builder.credentialsProvider(StaticCredentialsProvider.create(
                    AwsBasicCredentials.create(storage.getAccessKey(), storage.getSecretKey())
            ));
        }

        this.s3Client = builder.build();
        log.info("Initialized S3ResumeStorageService for bucket: {}", bucketName);
    }

    @Override
    public StoredResumeMetadata store(MultipartFile file) {
        fileValidator.validateResumeFile(file);

        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume.pdf";
        String extension = "";
        int dotIdx = originalFilename.lastIndexOf('.');
        if (dotIdx > 0) {
            extension = originalFilename.substring(dotIdx).toLowerCase();
        }

        String storageKey = "resumes/" + UUID.randomUUID() + extension;
        String contentType = file.getContentType() != null ? file.getContentType() : "application/octet-stream";

        try {
            PutObjectRequest putReq = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(storageKey)
                    .contentType(contentType)
                    .build();

            s3Client.putObject(putReq, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            log.info("Successfully uploaded resume to S3 with key: {}", storageKey);

            return new StoredResumeMetadata(storageKey, originalFilename, contentType, file.getSize());
        } catch (IOException | S3Exception e) {
            log.error("Failed to upload resume to S3 [bucket={}]: {}", bucketName, e.getMessage());
            throw new InvalidFileException("Could not upload resume to cloud storage. Please try again.");
        }
    }

    @Override
    public Optional<InputStream> get(String storageKey) {
        try {
            GetObjectRequest getReq = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(storageKey)
                    .build();
            return Optional.of(s3Client.getObject(getReq));
        } catch (NoSuchKeyException e) {
            log.warn("Resume object not found in S3: {}", storageKey);
            return Optional.empty();
        } catch (S3Exception e) {
            log.error("Error retrieving resume object from S3: {}", e.getMessage());
            return Optional.empty();
        }
    }

    @Override
    public void delete(String storageKey) {
        try {
            DeleteObjectRequest delReq = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(storageKey)
                    .build();
            s3Client.deleteObject(delReq);
            log.info("Deleted resume object from S3: {}", storageKey);
        } catch (S3Exception e) {
            log.warn("Failed to delete resume object from S3 {}: {}", storageKey, e.getMessage());
        }
    }
}

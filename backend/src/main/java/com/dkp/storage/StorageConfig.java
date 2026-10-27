package com.dkp.storage;

import com.dkp.config.AppProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;
import org.springframework.util.StringUtils;

import java.util.Arrays;

@Configuration
public class StorageConfig {

    private static final Logger log = LoggerFactory.getLogger(StorageConfig.class);

    @Bean
    @Primary
    public ResumeStorageService resumeStorageService(AppProperties appProperties,
                                                     FileValidator fileValidator,
                                                     Environment environment) {
        var storage = appProperties.getStorage();
        boolean isProd = Arrays.asList(environment.getActiveProfiles()).contains("prod");
        boolean wantsS3 = "s3".equalsIgnoreCase(storage.getProvider());
        boolean hasS3Credentials = StringUtils.hasText(storage.getAccessKey()) && StringUtils.hasText(storage.getSecretKey());

        if (isProd) {
            if (!wantsS3) {
                throw new IllegalStateException("Production environment requires cloud object storage (STORAGE_PROVIDER=s3). Local filesystem storage is prohibited in production.");
            }
            if (!hasS3Credentials) {
                throw new IllegalStateException("Missing required S3 credentials in production: OBJECT_STORAGE_ACCESS_KEY and OBJECT_STORAGE_SECRET_KEY must be provided via environment variables.");
            }
            if (!StringUtils.hasText(storage.getBucket())) {
                throw new IllegalStateException("Missing required S3 bucket in production: OBJECT_STORAGE_BUCKET must be provided via environment variables.");
            }
            log.info("Configuring S3-compatible cloud storage for resume uploads [bucket={}, region={}]", storage.getBucket(), storage.getRegion());
            return new S3ResumeStorageService(appProperties, fileValidator);
        }

        if (wantsS3 && hasS3Credentials) {
            log.info("Configuring S3-compatible cloud storage for resume uploads [bucket={}]", storage.getBucket());
            return new S3ResumeStorageService(appProperties, fileValidator);
        } else {
            log.info("Using LocalResumeStorageService at {} for development/test environment", storage.getLocalDir());
            return new LocalResumeStorageService(appProperties, fileValidator);
        }
    }
}

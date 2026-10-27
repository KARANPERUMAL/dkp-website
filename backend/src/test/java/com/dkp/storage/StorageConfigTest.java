package com.dkp.storage;

import com.dkp.config.AppProperties;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.env.MockEnvironment;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class StorageConfigTest {

    private final StorageConfig storageConfig = new StorageConfig();
    private final FileValidator fileValidator = new FileValidator();

    @Test
    @DisplayName("Should prohibit local storage and throw in production profile")
    void testProhibitLocalStorageInProd() {
        AppProperties props = new AppProperties();
        props.getStorage().setProvider("local");

        MockEnvironment env = new MockEnvironment();
        env.setActiveProfiles("prod");

        assertThatThrownBy(() -> storageConfig.resumeStorageService(props, fileValidator, env))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Local filesystem storage is prohibited in production");
    }

    @Test
    @DisplayName("Should throw in production profile when S3 credentials are missing")
    void testMissingS3CredentialsInProdThrows() {
        AppProperties props = new AppProperties();
        props.getStorage().setProvider("s3");
        props.getStorage().setBucket("my-bucket");
        props.getStorage().setAccessKey("");
        props.getStorage().setSecretKey("");

        MockEnvironment env = new MockEnvironment();
        env.setActiveProfiles("prod");

        assertThatThrownBy(() -> storageConfig.resumeStorageService(props, fileValidator, env))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Missing required S3 credentials in production");
    }

    @Test
    @DisplayName("Should fall back to LocalResumeStorageService in dev/test profile when credentials absent")
    void testFallbackToLocalInDev() {
        AppProperties props = new AppProperties();
        props.getStorage().setProvider("s3");
        props.getStorage().setAccessKey("");
        props.getStorage().setSecretKey("");

        MockEnvironment env = new MockEnvironment();
        env.setActiveProfiles("local");

        ResumeStorageService service = storageConfig.resumeStorageService(props, fileValidator, env);
        assertThat(service).isInstanceOf(LocalResumeStorageService.class);
    }
}

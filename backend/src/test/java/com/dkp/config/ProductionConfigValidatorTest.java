package com.dkp.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.DefaultApplicationArguments;
import org.springframework.mock.env.MockEnvironment;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ProductionConfigValidatorTest {

    @Test
    @DisplayName("Should throw IllegalStateException in production when required environment variables are missing")
    void testMissingProdVariablesThrows() {
        AppProperties props = new AppProperties();
        MockEnvironment env = new MockEnvironment();

        ProductionConfigValidator validator = new ProductionConfigValidator(props, env);

        assertThatThrownBy(() -> validator.run(new DefaultApplicationArguments()))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Production environment startup validation failed");
    }

    @Test
    @DisplayName("Should pass validation in production when all required environment variables are properly configured")
    void testCompleteProdVariablesPasses() {
        AppProperties props = new AppProperties();
        props.setFrontendUrl("https://dkpinnovation.com");
        props.setCorsAllowedOrigins(List.of("https://dkpinnovation.com", "https://www.dkpinnovation.com"));

        var email = props.getEmail();
        email.setResendApiKey("re_test_live_key");
        email.setMailFrom("DKP Innovations <noreply@dkpinnovation.com>");
        email.setCareersTo("careers@dkpinnovation.com");
        email.setContactTo("info@dkpinnovation.com");

        var storage = props.getStorage();
        storage.setProvider("s3");
        storage.setBucket("dkp-resumes-prod");
        storage.setRegion("us-east-1");
        storage.setAccessKey("AKIA_TEST_KEY");
        storage.setSecretKey("SECRET_TEST_KEY");

        MockEnvironment env = new MockEnvironment();
        env.setProperty("spring.datasource.url", "jdbc:postgresql://ep-sample-123.us-east-2.aws.neon.tech/neondb?sslmode=require");
        env.setProperty("spring.datasource.username", "neondb_owner");
        env.setProperty("spring.datasource.password", "strong_secret_password");

        ProductionConfigValidator validator = new ProductionConfigValidator(props, env);

        assertThatCode(() -> validator.run(new DefaultApplicationArguments()))
                .doesNotThrowAnyException();
    }
}

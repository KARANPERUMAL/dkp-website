package com.dkp.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

@Component
@Profile("prod")
public class ProductionConfigValidator implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(ProductionConfigValidator.class);

    private final AppProperties appProperties;
    private final Environment environment;

    public ProductionConfigValidator(AppProperties appProperties, Environment environment) {
        this.appProperties = appProperties;
        this.environment = environment;
    }

    @Override
    public void run(ApplicationArguments args) {
        log.info("Executing production environment configuration sanity checks...");
        List<String> missingOrInvalid = new ArrayList<>();

        // 1. Neon PostgreSQL Database checks
        String dbUrl = environment.getProperty("spring.datasource.url");
        String dbUser = environment.getProperty("spring.datasource.username");
        String dbPass = environment.getProperty("spring.datasource.password");

        if (!StringUtils.hasText(dbUrl) || dbUrl.contains("localhost:5432")) {
            missingOrInvalid.add("DATABASE_URL must be configured with a production Neon PostgreSQL JDBC connection string.");
        } else if (dbUrl.contains("neon.tech") && !dbUrl.contains("sslmode=require") && !dbUrl.contains("ssl=true")) {
            missingOrInvalid.add("DATABASE_URL must enforce SSL encryption for Neon PostgreSQL (append '?sslmode=require').");
        }

        if (!StringUtils.hasText(dbUser) || "postgres".equalsIgnoreCase(dbUser)) {
            missingOrInvalid.add("DATABASE_USERNAME must be configured with production database credentials.");
        }

        if (!StringUtils.hasText(dbPass) || "postgres".equalsIgnoreCase(dbPass)) {
            missingOrInvalid.add("DATABASE_PASSWORD must be configured with production database credentials.");
        }

        // 2. Resend Email checks
        var email = appProperties.getEmail();
        if (!StringUtils.hasText(email.getResendApiKey())) {
            missingOrInvalid.add("RESEND_API_KEY must be provided via environment variable for transactional email delivery.");
        }
        if (!StringUtils.hasText(email.getMailFrom())) {
            missingOrInvalid.add("MAIL_FROM must be configured with a verified sender address.");
        }
        if (!StringUtils.hasText(email.getCareersTo())) {
            missingOrInvalid.add("CAREERS_TO must be configured with the recruitment team mailbox.");
        }
        if (!StringUtils.hasText(email.getContactTo())) {
            missingOrInvalid.add("CONTACT_TO must be configured with the business inquiry mailbox.");
        }

        // 3. Private Resume Storage checks
        var storage = appProperties.getStorage();
        if (!"s3".equalsIgnoreCase(storage.getProvider())) {
            missingOrInvalid.add("STORAGE_PROVIDER must be 's3' in production. Local disk storage is prohibited in production.");
        }
        if (!StringUtils.hasText(storage.getBucket())) {
            missingOrInvalid.add("OBJECT_STORAGE_BUCKET must be configured for resume storage.");
        }
        if (!StringUtils.hasText(storage.getRegion())) {
            missingOrInvalid.add("OBJECT_STORAGE_REGION must be configured for S3 object storage.");
        }
        if (!StringUtils.hasText(storage.getAccessKey())) {
            missingOrInvalid.add("OBJECT_STORAGE_ACCESS_KEY must be configured for S3 object storage.");
        }
        if (!StringUtils.hasText(storage.getSecretKey())) {
            missingOrInvalid.add("OBJECT_STORAGE_SECRET_KEY must be configured for S3 object storage.");
        }

        // 4. Frontend & CORS checks
        if (!StringUtils.hasText(appProperties.getFrontendUrl()) || appProperties.getFrontendUrl().contains("localhost")) {
            missingOrInvalid.add("FRONTEND_URL must be configured with the canonical production domain (e.g. https://dkpinnovation.com).");
        }
        if (appProperties.getCorsAllowedOrigins().isEmpty() ||
            appProperties.getCorsAllowedOrigins().stream().allMatch(o -> o.contains("localhost"))) {
            missingOrInvalid.add("CORS_ALLOWED_ORIGINS must include the production frontend domain.");
        }

        if (!missingOrInvalid.isEmpty()) {
            StringBuilder errorReport = new StringBuilder("\n================================================================================\n");
            errorReport.append("APPLICATION STARTUP FAILED — MISSING PRODUCTION CONFIGURATION\n");
            errorReport.append("The application is running with active profile 'prod', but the following required\n");
            errorReport.append("environment variables or settings are missing or invalid:\n");
            for (int i = 0; i < missingOrInvalid.size(); i++) {
                errorReport.append(String.format("  [%d] %s\n", i + 1, missingOrInvalid.get(i)));
            }
            errorReport.append("Please configure these variables in your hosting dashboard (e.g. Render Web Service Environment).\n");
            errorReport.append("================================================================================\n");
            log.error(errorReport.toString());
            throw new IllegalStateException("Production environment startup validation failed: " + missingOrInvalid.size() + " required configuration issue(s).");
        }

        log.info("Production environment configuration validation passed successfully.");
    }
}

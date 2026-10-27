package com.dkp.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import java.util.List;

@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private String frontendUrl = "http://localhost:5173";
    private List<String> corsAllowedOrigins = List.of("http://localhost:5173", "http://localhost:3000");
    private final EmailProperties email = new EmailProperties();
    private final StorageProperties storage = new StorageProperties();
    private final RateLimitProperties rateLimit = new RateLimitProperties();
    private final SecurityProperties security = new SecurityProperties();

    public String getFrontendUrl() {
        return frontendUrl;
    }

    public void setFrontendUrl(String frontendUrl) {
        this.frontendUrl = frontendUrl;
    }

    public List<String> getCorsAllowedOrigins() {
        return corsAllowedOrigins;
    }

    public void setCorsAllowedOrigins(List<String> corsAllowedOrigins) {
        this.corsAllowedOrigins = corsAllowedOrigins;
    }

    public EmailProperties getEmail() {
        return email;
    }

    public StorageProperties getStorage() {
        return storage;
    }

    public RateLimitProperties getRateLimit() {
        return rateLimit;
    }

    public SecurityProperties getSecurity() {
        return security;
    }

    public static class EmailProperties {
        private String resendApiKey = "";
        private String mailFrom = "DKP Innovations <noreply@dkpinnovation.com>";
        private String careersTo = "careers@dkpinnovation.com";
        private String servicesTo = "services@dkpinnovation.com";
        private String contactTo = "info@dkpinnovation.com";
        private int outboxBatchSize = 10;
        private long outboxPollIntervalMs = 5000;

        public String getResendApiKey() {
            return resendApiKey;
        }

        public void setResendApiKey(String resendApiKey) {
            this.resendApiKey = resendApiKey;
        }

        public String getMailFrom() {
            return mailFrom;
        }

        public void setMailFrom(String mailFrom) {
            this.mailFrom = mailFrom;
        }

        public String getCareersTo() {
            return careersTo;
        }

        public void setCareersTo(String careersTo) {
            this.careersTo = careersTo;
        }

        public String getServicesTo() {
            return servicesTo;
        }

        public void setServicesTo(String servicesTo) {
            this.servicesTo = servicesTo;
        }

        public String getContactTo() {
            return contactTo;
        }

        public void setContactTo(String contactTo) {
            this.contactTo = contactTo;
        }

        public int getOutboxBatchSize() {
            return outboxBatchSize;
        }

        public void setOutboxBatchSize(int outboxBatchSize) {
            this.outboxBatchSize = outboxBatchSize;
        }

        public long getOutboxPollIntervalMs() {
            return outboxPollIntervalMs;
        }

        public void setOutboxPollIntervalMs(long outboxPollIntervalMs) {
            this.outboxPollIntervalMs = outboxPollIntervalMs;
        }
    }

    public static class StorageProperties {
        private String provider = "s3";
        private String endpoint = "";
        private String region = "us-east-1";
        private String bucket = "dkp-resumes";
        private String accessKey = "";
        private String secretKey = "";
        private String localDir = "./storage/resumes";
        private long maxFileSizeBytes = 5 * 1024 * 1024; // 5 MB

        public String getProvider() {
            return provider;
        }

        public void setProvider(String provider) {
            this.provider = provider;
        }

        public String getEndpoint() {
            return endpoint;
        }

        public void setEndpoint(String endpoint) {
            this.endpoint = endpoint;
        }

        public String getRegion() {
            return region;
        }

        public void setRegion(String region) {
            this.region = region;
        }

        public String getBucket() {
            return bucket;
        }

        public void setBucket(String bucket) {
            this.bucket = bucket;
        }

        public String getAccessKey() {
            return accessKey;
        }

        public void setAccessKey(String accessKey) {
            this.accessKey = accessKey;
        }

        public String getSecretKey() {
            return secretKey;
        }

        public void setSecretKey(String secretKey) {
            this.secretKey = secretKey;
        }

        public String getLocalDir() {
            return localDir;
        }

        public void setLocalDir(String localDir) {
            this.localDir = localDir;
        }

        public long getMaxFileSizeBytes() {
            return maxFileSizeBytes;
        }

        public void setMaxFileSizeBytes(long maxFileSizeBytes) {
            this.maxFileSizeBytes = maxFileSizeBytes;
        }
    }

    public static class RateLimitProperties {
        private boolean enabled = true;
        private int capacity = 20;
        private int refillTokens = 20;
        private int refillPeriodSeconds = 60;

        public boolean isEnabled() {
            return enabled;
        }

        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }

        public int getCapacity() {
            return capacity;
        }

        public void setCapacity(int capacity) {
            this.capacity = capacity;
        }

        public int getRefillTokens() {
            return refillTokens;
        }

        public void setRefillTokens(int refillTokens) {
            this.refillTokens = refillTokens;
        }

        public int getRefillPeriodSeconds() {
            return refillPeriodSeconds;
        }

        public void setRefillPeriodSeconds(int refillPeriodSeconds) {
            this.refillPeriodSeconds = refillPeriodSeconds;
        }
    }

    public static class SecurityProperties {
        private List<String> trustedProxies = List.of("127.0.0.1", "0:0:0:0:0:0:0:1");

        public List<String> getTrustedProxies() {
            return trustedProxies;
        }

        public void setTrustedProxies(List<String> trustedProxies) {
            this.trustedProxies = trustedProxies;
        }
    }
}

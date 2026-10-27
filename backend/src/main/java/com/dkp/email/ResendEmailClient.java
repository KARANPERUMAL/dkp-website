package com.dkp.email;

import com.dkp.config.AppProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.*;

@Component
public class ResendEmailClient {

    private static final Logger log = LoggerFactory.getLogger(ResendEmailClient.class);
    private static final String RESEND_API_URL = "https://api.resend.com/emails";

    private final RestTemplate restTemplate;
    private final AppProperties appProperties;

    public ResendEmailClient(AppProperties appProperties, RestTemplateBuilder builder) {
        this.appProperties = appProperties;
        this.restTemplate = builder
                .connectTimeout(Duration.ofSeconds(10))
                .readTimeout(Duration.ofSeconds(20))
                .build();
    }

    public String sendEmail(String toEmail, String subject, String bodyHtml, String bodyText) {
        return sendEmailWithAttachments(toEmail, subject, bodyHtml, bodyText, Collections.emptyList());
    }

    public String sendEmailWithAttachment(String toEmail, String subject, String bodyHtml, String bodyText,
                                          String attachmentFilename, byte[] attachmentBytes, String contentType) {
        if (attachmentBytes == null || attachmentBytes.length == 0) {
            return sendEmail(toEmail, subject, bodyHtml, bodyText);
        }

        String base64Content = Base64.getEncoder().encodeToString(attachmentBytes);
        Map<String, Object> attachmentMap = new HashMap<>();
        attachmentMap.put("filename", attachmentFilename);
        attachmentMap.put("content", base64Content);
        if (StringUtils.hasText(contentType)) {
            attachmentMap.put("contentType", contentType);
        }

        return sendEmailWithAttachments(toEmail, subject, bodyHtml, bodyText, List.of(attachmentMap));
    }

    public String sendEmailWithAttachments(String toEmail, String subject, String bodyHtml, String bodyText,
                                           List<Map<String, Object>> attachments) {
        String apiKey = appProperties.getEmail().getResendApiKey();

        if (!StringUtils.hasText(apiKey)) {
            log.warn("RESEND_API_KEY is not configured. Email to {} with subject '{}' will not be sent over network. " +
                    "Set RESEND_API_KEY in environment to enable live transactional dispatch.", toEmail, subject);
            return "mock-msg-" + System.currentTimeMillis();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey.trim());

        Map<String, Object> payload = new HashMap<>();
        payload.put("from", appProperties.getEmail().getMailFrom());
        payload.put("to", List.of(toEmail));
        payload.put("subject", subject);
        payload.put("html", bodyHtml);
        payload.put("text", bodyText);
        if (attachments != null && !attachments.isEmpty()) {
            payload.put("attachments", attachments);
        }

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(payload, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(RESEND_API_URL, requestEntity, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Object idObj = response.getBody().get("id");
                String providerId = idObj != null ? idObj.toString() : "resend-ok";
                log.info("Email successfully accepted by Resend API [providerId={}]", providerId);
                return providerId;
            }
            throw new TransientEmailException("Unexpected response status from Resend: " + response.getStatusCode());
        } catch (HttpStatusCodeException ex) {
            int statusCode = ex.getStatusCode().value();
            String responseBody = ex.getResponseBodyAsString();
            log.error("Resend API error status {} response: {}", statusCode, responseBody);

            if (statusCode == 429 || statusCode >= 500) {
                throw new TransientEmailException("Resend transient error (" + statusCode + "): " + responseBody);
            } else {
                throw new PermanentEmailException("Resend permanent error (" + statusCode + "): " + responseBody);
            }
        } catch (ResourceAccessException ex) {
            log.error("Network or timeout connection failure contacting Resend API: {}", ex.getMessage());
            throw new TransientEmailException("Network failure contacting Resend: " + ex.getMessage());
        } catch (Exception ex) {
            log.error("Unexpected error invoking Resend API: {}", ex.getMessage());
            throw new TransientEmailException("Failed to invoke Resend API: " + ex.getMessage());
        }
    }

    public static class TransientEmailException extends RuntimeException {
        public TransientEmailException(String message) {
            super(message);
        }
    }

    public static class PermanentEmailException extends RuntimeException {
        public PermanentEmailException(String message) {
            super(message);
        }
    }
}

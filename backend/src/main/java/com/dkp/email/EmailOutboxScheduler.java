package com.dkp.email;

import com.dkp.config.AppProperties;
import com.dkp.report.ExcelReportService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.List;

@Component
public class EmailOutboxScheduler {

    private static final Logger log = LoggerFactory.getLogger(EmailOutboxScheduler.class);
    private final EmailOutboxRepository outboxRepository;
    private final ResendEmailClient resendClient;
    private final ExcelReportService excelReportService;
    private final AppProperties appProperties;
    private final SecureRandom random = new SecureRandom();

    public EmailOutboxScheduler(EmailOutboxRepository outboxRepository,
                                ResendEmailClient resendClient,
                                ExcelReportService excelReportService,
                                AppProperties appProperties) {
        this.outboxRepository = outboxRepository;
        this.resendClient = resendClient;
        this.excelReportService = excelReportService;
        this.appProperties = appProperties;
    }

    @Scheduled(fixedDelayString = "${app.email.outbox-poll-interval-ms:5000}")
    @Transactional
    public void processOutbox() {
        int batchSize = appProperties.getEmail().getOutboxBatchSize();
        Instant now = Instant.now();

        List<EmailOutbox> dueEvents = outboxRepository.findDueEvents(
                List.of(EmailOutboxStatus.PENDING, EmailOutboxStatus.FAILED),
                now,
                PageRequest.of(0, batchSize)
        );

        if (dueEvents.isEmpty()) {
            return;
        }

        log.info("Processing {} pending email outbox notification(s)", dueEvents.size());

        for (EmailOutbox event : dueEvents) {
            processSingleEvent(event, now);
        }
    }

    private void processSingleEvent(EmailOutbox event, Instant now) {
        event.setStatus(EmailOutboxStatus.PROCESSING);
        event.setLastAttemptAt(now);
        event.setAttemptCount(event.getAttemptCount() + 1);

        try {
            String providerId;
            // Only attach complete database records workbook to administrator notifications
            if (event.getEventType() == EmailEventType.CONTACT_ADMIN_NOTIFICATION ||
                    event.getEventType() == EmailEventType.CAREER_ADMIN_NOTIFICATION) {

                byte[] excelBytes = null;
                try {
                    excelBytes = excelReportService.generateRecordsWorkbook();
                } catch (Exception ex) {
                    log.error("Failed to generate Excel records attachment for admin notification [ref={}]: {}",
                            event.getReferenceId(), ex.getMessage(), ex);
                }

                if (excelBytes != null && excelBytes.length > 0) {
                    providerId = resendClient.sendEmailWithAttachment(
                            event.getRecipientEmail(),
                            event.getSubject(),
                            event.getBodyHtml(),
                            event.getBodyText(),
                            ExcelReportService.EXCEL_FILENAME,
                            excelBytes,
                            ExcelReportService.EXCEL_CONTENT_TYPE
                    );
                } else {
                    providerId = resendClient.sendEmail(
                            event.getRecipientEmail(),
                            event.getSubject(),
                            event.getBodyHtml(),
                            event.getBodyText()
                    );
                }
            } else {
                // Client / candidate acknowledgement emails NEVER receive attachments
                providerId = resendClient.sendEmail(
                        event.getRecipientEmail(),
                        event.getSubject(),
                        event.getBodyHtml(),
                        event.getBodyText()
                );
            }

            event.setStatus(EmailOutboxStatus.SENT);
            event.setProviderMessageId(providerId);
            event.setLastError(null);
            outboxRepository.save(event);
            log.info("Email outbox event {} sent successfully [ref={}]", event.getId(), event.getReferenceId());
        } catch (ResendEmailClient.PermanentEmailException ex) {
            log.error("Permanent email failure for outbox event {}: {}", event.getId(), ex.getMessage());
            event.setStatus(EmailOutboxStatus.PERMANENT_FAILURE);
            event.setLastError(truncateError(ex.getMessage()));
            outboxRepository.save(event);
        } catch (Exception ex) {
            log.warn("Transient email failure sending outbox event {} (attempt {}/{}): {}",
                    event.getId(), event.getAttemptCount(), event.getMaxAttempts(), ex.getMessage());

            if (event.getAttemptCount() >= event.getMaxAttempts()) {
                event.setStatus(EmailOutboxStatus.FAILED);
                log.error("Outbox event {} exceeded max attempts ({}) without delivery", event.getId(), event.getMaxAttempts());
            } else {
                event.setStatus(EmailOutboxStatus.FAILED);
                // Exponential backoff: base 30s * 2^(attempt - 1) + 0..10s jitter
                long backoffSeconds = (long) (30 * Math.pow(2, event.getAttemptCount() - 1)) + random.nextInt(10);
                event.setNextAttemptAt(now.plusSeconds(backoffSeconds));
            }
            event.setLastError(truncateError(ex.getMessage()));
            outboxRepository.save(event);
        }
    }

    private String truncateError(String msg) {
        if (msg == null) return null;
        return msg.length() > 500 ? msg.substring(0, 500) : msg;
    }
}

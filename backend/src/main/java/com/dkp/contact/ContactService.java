package com.dkp.contact;

import com.dkp.common.ApiResponse;
import com.dkp.common.ReferenceGenerator;
import com.dkp.config.AppProperties;
import com.dkp.contact.dto.ContactRequest;
import com.dkp.email.EmailEventType;
import com.dkp.email.EmailOutbox;
import com.dkp.email.EmailOutboxRepository;
import com.dkp.email.EmailTemplateService;
import com.dkp.security.SpamProtectionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactService.class);

    private final ContactSubmissionRepository repository;
    private final EmailOutboxRepository outboxRepository;
    private final EmailTemplateService emailTemplateService;
    private final ReferenceGenerator referenceGenerator;
    private final SpamProtectionService spamProtectionService;
    private final AppProperties appProperties;

    public ContactService(ContactSubmissionRepository repository,
                          EmailOutboxRepository outboxRepository,
                          EmailTemplateService emailTemplateService,
                          ReferenceGenerator referenceGenerator,
                          SpamProtectionService spamProtectionService,
                          AppProperties appProperties) {
        this.repository = repository;
        this.outboxRepository = outboxRepository;
        this.emailTemplateService = emailTemplateService;
        this.referenceGenerator = referenceGenerator;
        this.spamProtectionService = spamProtectionService;
        this.appProperties = appProperties;
    }

    @Transactional
    public ApiResponse processSubmission(ContactRequest request) {
        spamProtectionService.validateHoneypot(request.getHoneypot());

        String referenceId = referenceGenerator.generateContactReference();

        ContactSubmission sub = new ContactSubmission();
        sub.setReferenceId(referenceId);
        sub.setFullName(request.getFullName().trim());
        sub.setEmail(request.getEmail().trim().toLowerCase());
        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            sub.setPhone(request.getPhone().trim());
        }
        if (request.getService() != null && !request.getService().isBlank()) {
            sub.setService(request.getService().trim());
        }
        sub.setMessage(request.getMessage().trim());
        sub.setStatus("SUBMITTED");

        repository.save(sub);

        // Queue Admin Notification Outbox
        String adminTo = appProperties.getEmail().getContactTo();
        String adminSubject = "New Contact / Services Submission [" + referenceId + "]";
        String adminHtml = emailTemplateService.buildContactAdminHtml(
                referenceId, sub.getFullName(), sub.getEmail(), sub.getPhone(), sub.getService(), sub.getMessage()
        );
        String adminText = emailTemplateService.buildContactAdminText(
                referenceId, sub.getFullName(), sub.getEmail(), sub.getPhone(), sub.getService(), sub.getMessage()
        );

        outboxRepository.save(new EmailOutbox(
                EmailEventType.CONTACT_ADMIN_NOTIFICATION,
                referenceId,
                adminTo,
                adminSubject,
                adminHtml,
                adminText
        ));

        // Queue Client Confirmation Outbox
        String clientSubject = "Message Received [" + referenceId + "] - DKP Innovations";
        String clientHtml = emailTemplateService.buildContactClientHtml(
                referenceId, sub.getFullName(), sub.getService()
        );
        String clientText = emailTemplateService.buildContactClientText(
                referenceId, sub.getFullName(), sub.getService()
        );

        outboxRepository.save(new EmailOutbox(
                EmailEventType.CONTACT_CLIENT_ACK,
                referenceId,
                sub.getEmail(),
                clientSubject,
                clientHtml,
                clientText
        ));

        log.info("Successfully persisted contact submission and queued admin and client emails [ref={}]", referenceId);

        return ApiResponse.ok(referenceId, "Thank you! Your message has been received. Our team will get back to you shortly.");
    }
}

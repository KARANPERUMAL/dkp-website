package com.dkp.services;

import com.dkp.common.ApiResponse;
import com.dkp.common.ReferenceGenerator;
import com.dkp.config.AppProperties;
import com.dkp.email.EmailEventType;
import com.dkp.email.EmailOutbox;
import com.dkp.email.EmailOutboxRepository;
import com.dkp.email.EmailTemplateService;
import com.dkp.security.SpamProtectionService;
import com.dkp.services.dto.ServiceEnquiryRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class ServiceEnquiryService {

    private static final Logger log = LoggerFactory.getLogger(ServiceEnquiryService.class);

    private final ServiceEnquiryRepository repository;
    private final EmailOutboxRepository outboxRepository;
    private final EmailTemplateService emailTemplateService;
    private final ReferenceGenerator referenceGenerator;
    private final SpamProtectionService spamProtectionService;
    private final ServiceCatalogue serviceCatalogue;
    private final AppProperties appProperties;

    public ServiceEnquiryService(ServiceEnquiryRepository repository,
                                 EmailOutboxRepository outboxRepository,
                                 EmailTemplateService emailTemplateService,
                                 ReferenceGenerator referenceGenerator,
                                 SpamProtectionService spamProtectionService,
                                 ServiceCatalogue serviceCatalogue,
                                 AppProperties appProperties) {
        this.repository = repository;
        this.outboxRepository = outboxRepository;
        this.emailTemplateService = emailTemplateService;
        this.referenceGenerator = referenceGenerator;
        this.spamProtectionService = spamProtectionService;
        this.serviceCatalogue = serviceCatalogue;
        this.appProperties = appProperties;
    }

    @Transactional
    public ApiResponse processEnquiry(ServiceEnquiryRequest request) {
        spamProtectionService.validateHoneypot(request.getHoneypot());

        if (!serviceCatalogue.isValidService(request.getService())) {
            throw new IllegalArgumentException("The specified service category is not currently recognized.");
        }

        String referenceId = referenceGenerator.generateServiceReference();

        ServiceEnquiry enquiry = new ServiceEnquiry();
        enquiry.setReferenceId(referenceId);
        enquiry.setFullName(request.getFullName().trim());
        enquiry.setEmail(request.getEmail().trim().toLowerCase());
        if (request.getPhone() != null) {
            enquiry.setPhone(request.getPhone().trim());
        }
        if (request.getCompanyName() != null) {
            enquiry.setCompanyName(request.getCompanyName().trim());
        }
        enquiry.setService(request.getService().trim());
        enquiry.setMessage(request.getMessage().trim());
        enquiry.setPrivacyConsent(request.isPrivacyConsent());
        enquiry.setPrivacyConsentAt(Instant.now());
        enquiry.setStatus("SUBMITTED");

        repository.save(enquiry);

        // Queue Admin Notification Outbox
        String adminTo = appProperties.getEmail().getServicesTo();
        String adminSubject = "New Service Enquiry [" + referenceId + "] - " + enquiry.getService();
        String adminHtml = emailTemplateService.buildServiceAdminHtml(
                referenceId, enquiry.getFullName(), enquiry.getEmail(), enquiry.getPhone(),
                enquiry.getCompanyName() != null ? enquiry.getCompanyName() : "Not Specified",
                enquiry.getService(), enquiry.getMessage()
        );
        String adminText = emailTemplateService.buildServiceAdminText(
                referenceId, enquiry.getFullName(), enquiry.getEmail(), enquiry.getPhone(),
                enquiry.getCompanyName() != null ? enquiry.getCompanyName() : "Not Specified",
                enquiry.getService(), enquiry.getMessage()
        );

        outboxRepository.save(new EmailOutbox(
                EmailEventType.SERVICE_ADMIN_NOTIFICATION,
                referenceId,
                adminTo,
                adminSubject,
                adminHtml,
                adminText
        ));

        // Queue Client Confirmation Outbox
        String clientSubject = "Inquiry Confirmed [" + referenceId + "] - DKP Innovations";
        String clientHtml = emailTemplateService.buildServiceClientHtml(referenceId, enquiry.getFullName(), enquiry.getService());
        String clientText = emailTemplateService.buildServiceClientText(referenceId, enquiry.getFullName(), enquiry.getService());

        outboxRepository.save(new EmailOutbox(
                EmailEventType.SERVICE_CLIENT_ACK,
                referenceId,
                enquiry.getEmail(),
                clientSubject,
                clientHtml,
                clientText
        ));

        log.info("Successfully persisted service enquiry and queued notifications [ref={}]", referenceId);

        return ApiResponse.ok(referenceId, "Thank you! Your project enquiry has been received. Our solutions team will review your requirements and schedule a discovery consultation.");
    }
}

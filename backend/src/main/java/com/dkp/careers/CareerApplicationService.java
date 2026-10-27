package com.dkp.careers;

import com.dkp.careers.dto.CareerApplicationRequest;
import com.dkp.common.ApiResponse;
import com.dkp.common.ReferenceGenerator;
import com.dkp.config.AppProperties;
import com.dkp.email.EmailEventType;
import com.dkp.email.EmailOutbox;
import com.dkp.email.EmailOutboxRepository;
import com.dkp.email.EmailTemplateService;
import com.dkp.security.SpamProtectionService;
import com.dkp.storage.ResumeStorageService;
import com.dkp.storage.StoredResumeMetadata;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;

@Service
public class CareerApplicationService {

    private static final Logger log = LoggerFactory.getLogger(CareerApplicationService.class);

    private final JobApplicationRepository repository;
    private final EmailOutboxRepository outboxRepository;
    private final ResumeStorageService resumeStorageService;
    private final EmailTemplateService emailTemplateService;
    private final ReferenceGenerator referenceGenerator;
    private final SpamProtectionService spamProtectionService;
    private final AppProperties appProperties;

    public CareerApplicationService(JobApplicationRepository repository,
                                  EmailOutboxRepository outboxRepository,
                                  ResumeStorageService resumeStorageService,
                                  EmailTemplateService emailTemplateService,
                                  ReferenceGenerator referenceGenerator,
                                  SpamProtectionService spamProtectionService,
                                  AppProperties appProperties) {
        this.repository = repository;
        this.outboxRepository = outboxRepository;
        this.resumeStorageService = resumeStorageService;
        this.emailTemplateService = emailTemplateService;
        this.referenceGenerator = referenceGenerator;
        this.spamProtectionService = spamProtectionService;
        this.appProperties = appProperties;
    }

    @Transactional
    public ApiResponse processApplication(CareerApplicationRequest request, MultipartFile resumeFile) {
        spamProtectionService.validateHoneypot(request.getHoneypot());

        // Store file securely
        StoredResumeMetadata storedResume = resumeStorageService.store(resumeFile);
        String referenceId = referenceGenerator.generateCareerReference();

        try {
            JobApplication app = new JobApplication();
            app.setReferenceId(referenceId);
            app.setFullName(request.getFullName().trim());
            app.setEmail(request.getEmail().trim().toLowerCase());
            app.setPhone(request.getPhone().trim());
            app.setPosition(request.getPosition().trim());
            app.setDepartment(request.getDepartment().trim());
            app.setExperienceLevel(request.getExperienceLevel().trim());
            app.setWorkArrangement(request.getWorkArrangement().trim());
            app.setKeySkills(request.getKeySkills().trim());
            app.setCoverLetter(request.getCoverLetter().trim());
            if (request.getLinkedInUrl() != null) {
                app.setLinkedInUrl(request.getLinkedInUrl().trim());
            }
            if (request.getPortfolioUrl() != null) {
                app.setPortfolioUrl(request.getPortfolioUrl().trim());
            }
            app.setPrivacyConsent(request.isPrivacyConsent());
            app.setPrivacyConsentAt(Instant.now());
            app.setResumeStorageKey(storedResume.getStorageKey());
            app.setResumeOriginalFilename(storedResume.getOriginalFilename());
            app.setResumeContentType(storedResume.getContentType());
            app.setResumeFileSizeBytes(storedResume.getFileSizeBytes());
            app.setStatus("SUBMITTED");

            repository.save(app);

            // Queue Admin Notification Outbox
            String adminTo = appProperties.getEmail().getCareersTo();
            String adminSubject = "New Career Application [" + referenceId + "] - " + app.getPosition();
            String adminHtml = emailTemplateService.buildCareerAdminHtml(
                    referenceId, app.getFullName(), app.getEmail(), app.getPhone(),
                    app.getPosition(), app.getDepartment(), app.getExperienceLevel(),
                    app.getWorkArrangement(), app.getKeySkills(), app.getCoverLetter(),
                    storedResume.getOriginalFilename(), storedResume.getStorageKey()
            );
            String adminText = emailTemplateService.buildCareerAdminText(
                    referenceId, app.getFullName(), app.getEmail(), app.getPhone(),
                    app.getPosition(), app.getDepartment(), app.getExperienceLevel(),
                    app.getWorkArrangement(), app.getKeySkills(), app.getCoverLetter(),
                    storedResume.getOriginalFilename(), storedResume.getStorageKey()
            );

            outboxRepository.save(new EmailOutbox(
                    EmailEventType.CAREER_ADMIN_NOTIFICATION,
                    referenceId,
                    adminTo,
                    adminSubject,
                    adminHtml,
                    adminText
            ));

            // Queue Candidate Acknowledgement Outbox
            String candidateSubject = "Application Received [" + referenceId + "] - DKP Innovations";
            String candidateHtml = emailTemplateService.buildCareerCandidateHtml(referenceId, app.getFullName(), app.getPosition());
            String candidateText = emailTemplateService.buildCareerCandidateText(referenceId, app.getFullName(), app.getPosition());

            outboxRepository.save(new EmailOutbox(
                    EmailEventType.CAREER_CANDIDATE_ACK,
                    referenceId,
                    app.getEmail(),
                    candidateSubject,
                    candidateHtml,
                    candidateText
            ));

            log.info("Successfully persisted career application and queued notifications [ref={}]", referenceId);

            return ApiResponse.ok(referenceId, "Your application has been received successfully. Our recruitment team will review your qualifications against active requirements.");
        } catch (Exception ex) {
            // Cleanup orphaned file if DB persistence fails
            log.error("Failed to persist job application [ref={}]: {}. Cleaning up uploaded resume...", referenceId, ex.getMessage());
            resumeStorageService.delete(storedResume.getStorageKey());
            throw ex;
        }
    }
}

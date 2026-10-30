package com.dkp.careers;

import com.dkp.careers.dto.CareerApplicationRequest;
import com.dkp.common.ApiResponse;
import com.dkp.common.InvalidFileException;
import com.dkp.common.ReferenceGenerator;
import com.dkp.config.AppProperties;
import com.dkp.email.EmailEventType;
import com.dkp.email.EmailOutbox;
import com.dkp.email.EmailOutboxRepository;
import com.dkp.email.EmailTemplateService;
import com.dkp.email.ResendEmailClient;
import com.dkp.report.ExcelReportService;
import com.dkp.security.SpamProtectionService;
import com.dkp.storage.FileValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class CareerApplicationService {

    private static final Logger log = LoggerFactory.getLogger(CareerApplicationService.class);

    private final JobApplicationRepository repository;
    private final EmailOutboxRepository outboxRepository;
    private final ResendEmailClient resendClient;
    private final ExcelReportService excelReportService;
    private final FileValidator fileValidator;
    private final EmailTemplateService emailTemplateService;
    private final ReferenceGenerator referenceGenerator;
    private final SpamProtectionService spamProtectionService;
    private final AppProperties appProperties;

    public CareerApplicationService(JobApplicationRepository repository,
                                   EmailOutboxRepository outboxRepository,
                                   ResendEmailClient resendClient,
                                   ExcelReportService excelReportService,
                                   FileValidator fileValidator,
                                   EmailTemplateService emailTemplateService,
                                   ReferenceGenerator referenceGenerator,
                                   SpamProtectionService spamProtectionService,
                                   AppProperties appProperties) {
        this.repository = repository;
        this.outboxRepository = outboxRepository;
        this.resendClient = resendClient;
        this.excelReportService = excelReportService;
        this.fileValidator = fileValidator;
        this.emailTemplateService = emailTemplateService;
        this.referenceGenerator = referenceGenerator;
        this.spamProtectionService = spamProtectionService;
        this.appProperties = appProperties;
    }

    @Transactional
    public ApiResponse processApplication(CareerApplicationRequest request, MultipartFile resumeFile) {
        // 1. Anti-bot honeypot check
        spamProtectionService.validateHoneypot(request.getHoneypot());

        // 2. Validate uploaded resume document (magic bytes, MIME type, configurable size limit)
        fileValidator.validateResumeFile(resumeFile);

        byte[] resumeBytes;
        try {
            resumeBytes = resumeFile.getBytes();
        } catch (IOException e) {
            throw new InvalidFileException("Failed to read uploaded resume bytes: " + e.getMessage());
        }

        String referenceId = referenceGenerator.generateCareerReference();
        String sanitizedFilename = fileValidator.sanitizeFilename(resumeFile.getOriginalFilename());
        String contentType = (resumeFile.getContentType() != null && !resumeFile.getContentType().isBlank())
                ? resumeFile.getContentType()
                : "application/pdf";

        // 3. Persist application metadata in Neon PostgreSQL
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
        if (request.getLinkedInUrl() != null && !request.getLinkedInUrl().isBlank()) {
            app.setLinkedInUrl(request.getLinkedInUrl().trim());
        }
        if (request.getPortfolioUrl() != null && !request.getPortfolioUrl().isBlank()) {
            app.setPortfolioUrl(request.getPortfolioUrl().trim());
        }
        app.setPrivacyConsent(request.isPrivacyConsent());
        app.setPrivacyConsentAt(Instant.now());
        app.setResumeStorageKey("EMAIL_ATTACHMENT");
        app.setResumeOriginalFilename(sanitizedFilename);
        app.setResumeContentType(contentType);
        app.setResumeFileSizeBytes(resumeBytes.length);
        app.setStatus("PROCESSING");

        repository.saveAndFlush(app);

        // 4. Construct recruiter email HTML & plain-text templates
        String adminTo = appProperties.getEmail().getCareersTo();
        String adminSubject = "New Career Application [" + referenceId + "] - " + app.getPosition();
        String adminHtml = emailTemplateService.buildCareerAdminHtml(
                referenceId, app.getFullName(), app.getEmail(), app.getPhone(),
                app.getPosition(), app.getDepartment(), app.getExperienceLevel(),
                app.getWorkArrangement(), app.getKeySkills(), app.getCoverLetter(),
                sanitizedFilename
        );
        String adminText = emailTemplateService.buildCareerAdminText(
                referenceId, app.getFullName(), app.getEmail(), app.getPhone(),
                app.getPosition(), app.getDepartment(), app.getExperienceLevel(),
                app.getWorkArrangement(), app.getKeySkills(), app.getCoverLetter(),
                sanitizedFilename
        );

        // 5. Deliver attachments (resume and database records Excel workbook) to recruitment team via Resend API
        byte[] excelBytes = null;
        try {
            excelBytes = excelReportService.generateRecordsWorkbook();
        } catch (Exception ex) {
            log.error("Failed to generate Excel records attachment for career application admin notification [ref={}]: {}",
                    referenceId, ex.getMessage(), ex);
        }

        List<ResendEmailClient.EmailAttachment> attachments = new ArrayList<>();
        attachments.add(new ResendEmailClient.EmailAttachment(sanitizedFilename, resumeBytes, contentType));
        if (excelBytes != null && excelBytes.length > 0) {
            attachments.add(new ResendEmailClient.EmailAttachment(
                    ExcelReportService.EXCEL_FILENAME,
                    excelBytes,
                    ExcelReportService.EXCEL_CONTENT_TYPE
            ));
        }

        String providerMessageId = resendClient.sendEmailWithMultipleAttachments(
                adminTo,
                adminSubject,
                adminHtml,
                adminText,
                attachments
        );

        // 6. Queue Candidate Acknowledgement in email_outbox for guaranteed asynchronous delivery
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

        // 7. Update status to SUBMITTED
        app.setStatus("SUBMITTED");
        repository.save(app);

        log.info("Career application processed successfully with attachment delivery [ref={}, providerId={}]", referenceId, providerMessageId);

        return ApiResponse.ok(referenceId, "Your application has been received successfully. Our recruitment team will review your qualifications against active requirements.");
    }
}

package com.dkp.careers;

import com.dkp.email.EmailEventType;
import com.dkp.email.EmailOutbox;
import com.dkp.email.EmailOutboxRepository;
import com.dkp.email.ResendEmailClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.notNullValue;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CareerApplicationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private EmailOutboxRepository emailOutboxRepository;

    @MockitoBean
    private ResendEmailClient resendEmailClient;

    private final byte[] validPdfBytes = new byte[]{0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x35};

    @BeforeEach
    void setupMock() {
        when(resendEmailClient.sendEmailWithAttachment(anyString(), anyString(), anyString(), anyString(), anyString(), any(byte[].class), anyString()))
                .thenReturn("msg_mock_resend_attachment_123");
        when(resendEmailClient.sendEmail(anyString(), anyString(), anyString(), anyString()))
                .thenReturn("msg_mock_ack_456");
    }

    @Test
    @DisplayName("POST /api/careers/applications with valid payload should send attachment email and return 201 Created")
    void testValidApplicationSubmission() throws Exception {
        MockMultipartFile resumeFile = new MockMultipartFile("resume", "cv.pdf", "application/pdf", validPdfBytes);

        mockMvc.perform(multipart("/api/careers/applications")
                        .file(resumeFile)
                        .param("fullName", "Jane Doe")
                        .param("email", "jane.doe@example.com")
                        .param("phone", "+91 98765 43210")
                        .param("position", "Senior React Developer")
                        .param("department", "IT & Digital Solutions")
                        .param("experienceLevel", "3–5 Years")
                        .param("workArrangement", "Hybrid")
                        .param("keySkills", "React, TypeScript, Next.js, Tailwind")
                        .param("coverLetter", "I am excited to apply for this engineering role at DKP Innovations and bring value to your projects.")
                        .param("privacyConsent", "true")
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.referenceId", containsString("DKP-APP-")))
                .andExpect(jsonPath("$.message", notNullValue()));

        // Verify that resend client was invoked with resume attachment
        verify(resendEmailClient, times(1)).sendEmailWithAttachment(
                eq("careers@dkpinnovation.com"),
                contains("Senior React Developer"),
                contains("Jane Doe"),
                anyString(),
                eq("cv.pdf"),
                eq(validPdfBytes),
                eq("application/pdf")
        );

        // Verify entity persisted in database
        List<JobApplication> apps = jobApplicationRepository.findByEmailOrderByCreatedAtDesc("jane.doe@example.com");
        assertThat(apps).isNotEmpty();
        JobApplication latest = apps.get(0);
        assertThat(latest.getResumeOriginalFilename()).isEqualTo("cv.pdf");
        assertThat(latest.getResumeStorageKey()).isEqualTo("EMAIL_ATTACHMENT");
        assertThat(latest.getStatus()).isEqualTo("SUBMITTED");

        // Verify candidate acknowledgement queued in outbox
        List<EmailOutbox> outboxEvents = emailOutboxRepository.findByReferenceId(latest.getReferenceId());
        assertThat(outboxEvents).hasSize(1);
        assertThat(outboxEvents.get(0).getEventType()).isEqualTo(EmailEventType.CAREER_CANDIDATE_ACK);
    }

    @Test
    @DisplayName("POST /api/careers/apply alias should also return 201 Created")
    void testApplyAliasEndpoint() throws Exception {
        MockMultipartFile resumeFile = new MockMultipartFile("resume", "john_cv.pdf", "application/pdf", validPdfBytes);

        mockMvc.perform(multipart("/api/careers/apply")
                        .file(resumeFile)
                        .param("fullName", "John Smith")
                        .param("email", "john.smith@example.com")
                        .param("phone", "+91 98765 11111")
                        .param("position", "General Application")
                        .param("department", "Creative Production & Advertising")
                        .param("experienceLevel", "Entry Level")
                        .param("workArrangement", "On-site")
                        .param("keySkills", "Graphic Design, Adobe Premiere, Figma")
                        .param("coverLetter", "I have extensive creative production experience and would love to join your Bangalore studio.")
                        .param("privacyConsent", "true")
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.referenceId", containsString("DKP-APP-")));

        verify(resendEmailClient, atLeastOnce()).sendEmailWithAttachment(
                anyString(), anyString(), anyString(), anyString(), eq("john_cv.pdf"), any(), anyString()
        );
    }

    @Test
    @DisplayName("POST /api/careers/applications with missing fields should return 400 Bad Request")
    void testMissingFieldsValidation() throws Exception {
        MockMultipartFile resumeFile = new MockMultipartFile("resume", "cv.pdf", "application/pdf", validPdfBytes);

        mockMvc.perform(multipart("/api/careers/applications")
                        .file(resumeFile)
                        .param("fullName", "") // empty name
                        .param("email", "not-an-email")
                        .param("privacyConsent", "false")
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.fieldErrors.fullName", notNullValue()))
                .andExpect(jsonPath("$.fieldErrors.email", notNullValue()));

        verify(resendEmailClient, never()).sendEmailWithAttachment(anyString(), anyString(), anyString(), anyString(), anyString(), any(), anyString());
    }

    @Test
    @DisplayName("POST /api/careers/applications with honeypot triggered should reject request")
    void testHoneypotRejection() throws Exception {
        MockMultipartFile resumeFile = new MockMultipartFile("resume", "cv.pdf", "application/pdf", validPdfBytes);

        mockMvc.perform(multipart("/api/careers/applications")
                        .file(resumeFile)
                        .param("fullName", "Bot User")
                        .param("email", "bot@spammer.com")
                        .param("phone", "+91 98765 43210")
                        .param("position", "React Developer")
                        .param("department", "IT")
                        .param("experienceLevel", "Entry Level")
                        .param("workArrangement", "Remote")
                        .param("keySkills", "Spamming")
                        .param("coverLetter", "Automated script submission with valid length for test.")
                        .param("privacyConsent", "true")
                        .param("honeypot", "I am a bot")
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isBadRequest());

        verify(resendEmailClient, never()).sendEmailWithAttachment(anyString(), anyString(), anyString(), anyString(), anyString(), any(), anyString());
    }

    @Test
    @DisplayName("POST /api/careers/applications with spoofed/invalid file magic bytes should return 400")
    void testInvalidFileSpoofedMagicBytes() throws Exception {
        byte[] maliciousFakePdf = "This is not a real PDF document, it is plain text disguised with .pdf".getBytes();
        MockMultipartFile resumeFile = new MockMultipartFile("resume", "fake.pdf", "application/pdf", maliciousFakePdf);

        mockMvc.perform(multipart("/api/careers/applications")
                        .file(resumeFile)
                        .param("fullName", "Attacker User")
                        .param("email", "attacker@example.com")
                        .param("phone", "+91 98765 43210")
                        .param("position", "React Developer")
                        .param("department", "IT")
                        .param("experienceLevel", "Entry Level")
                        .param("workArrangement", "Remote")
                        .param("keySkills", "Exploiting")
                        .param("coverLetter", "Cover letter text that is sufficiently long for validation.")
                        .param("privacyConsent", "true")
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("file signature does not match")));

        verify(resendEmailClient, never()).sendEmailWithAttachment(anyString(), anyString(), anyString(), anyString(), anyString(), any(), anyString());
    }

    @Test
    @DisplayName("POST /api/careers/applications with oversized file should return 400 Bad Request")
    void testOversizedFileRejection() throws Exception {
        // Create 6 MB byte array (exceeding 5 MB limit)
        byte[] oversizedBytes = new byte[6 * 1024 * 1024];
        oversizedBytes[0] = 0x25;
        oversizedBytes[1] = 0x50;
        oversizedBytes[2] = 0x44;
        oversizedBytes[3] = 0x46; // valid PDF header
        MockMultipartFile resumeFile = new MockMultipartFile("resume", "large.pdf", "application/pdf", oversizedBytes);

        mockMvc.perform(multipart("/api/careers/applications")
                        .file(resumeFile)
                        .param("fullName", "Big File Candidate")
                        .param("email", "bigfile@example.com")
                        .param("phone", "+91 98765 43210")
                        .param("position", "React Developer")
                        .param("department", "IT")
                        .param("experienceLevel", "Entry Level")
                        .param("workArrangement", "Remote")
                        .param("keySkills", "Java, Spring")
                        .param("coverLetter", "Cover letter text that is sufficiently long for validation.")
                        .param("privacyConsent", "true")
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("exceeds")));

        verify(resendEmailClient, never()).sendEmailWithAttachment(anyString(), anyString(), anyString(), anyString(), anyString(), any(), anyString());
    }

    @Test
    @DisplayName("POST /api/careers/applications when email delivery fails should return 503 and not return success")
    void testEmailDeliveryFailureReturnsError() throws Exception {
        when(resendEmailClient.sendEmailWithAttachment(anyString(), anyString(), anyString(), anyString(), anyString(), any(byte[].class), anyString()))
                .thenThrow(new ResendEmailClient.TransientEmailException("Connection to Resend timed out"));

        MockMultipartFile resumeFile = new MockMultipartFile("resume", "cv.pdf", "application/pdf", validPdfBytes);

        mockMvc.perform(multipart("/api/careers/applications")
                        .file(resumeFile)
                        .param("fullName", "Error Candidate")
                        .param("email", "error.candidate@example.com")
                        .param("phone", "+91 98765 43210")
                        .param("position", "React Developer")
                        .param("department", "IT")
                        .param("experienceLevel", "Entry Level")
                        .param("workArrangement", "Remote")
                        .param("keySkills", "Java, Spring")
                        .param("coverLetter", "Cover letter text that is sufficiently long for validation.")
                        .param("privacyConsent", "true")
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.status").value(503))
                .andExpect(jsonPath("$.message", containsString("temporarily unavailable")));
    }
}

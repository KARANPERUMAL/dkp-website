package com.dkp.careers;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CareerApplicationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("POST /api/careers/applications with valid payload should return 201 Created")
    void testValidApplicationSubmission() throws Exception {
        byte[] pdfBytes = new byte[]{0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x35};
        MockMultipartFile resumeFile = new MockMultipartFile("resume", "cv.pdf", "application/pdf", pdfBytes);

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
    }

    @Test
    @DisplayName("POST /api/careers/apply alias should also return 201 Created")
    void testApplyAliasEndpoint() throws Exception {
        byte[] pdfBytes = new byte[]{0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x35};
        MockMultipartFile resumeFile = new MockMultipartFile("resume", "cv.pdf", "application/pdf", pdfBytes);

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
    }

    @Test
    @DisplayName("POST /api/careers/applications with missing fields should return 400 Bad Request")
    void testMissingFieldsValidation() throws Exception {
        byte[] pdfBytes = new byte[]{0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x35};
        MockMultipartFile resumeFile = new MockMultipartFile("resume", "cv.pdf", "application/pdf", pdfBytes);

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
    }

    @Test
    @DisplayName("POST /api/careers/applications with honeypot triggered should reject request")
    void testHoneypotRejection() throws Exception {
        byte[] pdfBytes = new byte[]{0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x35};
        MockMultipartFile resumeFile = new MockMultipartFile("resume", "cv.pdf", "application/pdf", pdfBytes);

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
    }
}

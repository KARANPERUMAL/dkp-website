package com.dkp.services;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ServiceEnquiryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("POST /api/services/enquiries with valid payload should return 201 Created")
    void testValidServiceEnquiry() throws Exception {
        String jsonPayload = """
        {
            "fullName": "Aarav Patel",
            "email": "aarav@techfirm.in",
            "phone": "+91 98450 12345",
            "companyName": "TechFirm India Pvt Ltd",
            "service": "IT & Digital Solutions",
            "message": "We need custom e-commerce web architecture with ERP synchronization and high performance.",
            "privacyConsent": true
        }
        """;

        mockMvc.perform(post("/api/services/enquiries")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonPayload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.referenceId", containsString("DKP-SRV-")));
    }

    @Test
    @DisplayName("POST /api/services/enquiries with invalid email should return 400 Bad Request")
    void testInvalidEmail() throws Exception {
        String jsonPayload = """
        {
            "fullName": "Aarav Patel",
            "email": "invalid-email-address",
            "service": "IT & Digital Solutions",
            "message": "Valid description message exceeding ten characters."
        }
        """;

        mockMvc.perform(post("/api/services/enquiries")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonPayload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.email").exists());
    }
}

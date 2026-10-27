package com.dkp.contact;

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
class ContactControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("POST /api/contact with valid payload should return 201 Created")
    void testValidContactSubmission() throws Exception {
        String jsonPayload = """
        {
            "fullName": "Rahul Sharma",
            "email": "rahul.sharma@example.com",
            "phone": "+91 98765 43210",
            "service": "Website Design & Development",
            "message": "Looking for a redesign of our corporate brand website and SEO audit."
        }
        """;

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonPayload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.referenceId", containsString("DKP-CNT-")));
    }

    @Test
    @DisplayName("POST /api/contact with message less than 10 characters should return 400 Bad Request")
    void testShortMessageRejection() throws Exception {
        String jsonPayload = """
        {
            "fullName": "Rahul Sharma",
            "email": "rahul.sharma@example.com",
            "service": "Website Design & Development",
            "message": "Too short"
        }
        """;

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonPayload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.message").exists());
    }
}

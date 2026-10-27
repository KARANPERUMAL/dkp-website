package com.dkp.contact;

import com.dkp.email.EmailEventType;
import com.dkp.email.EmailOutbox;
import com.dkp.email.EmailOutboxRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
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

    @Autowired
    private ContactSubmissionRepository contactRepo;

    @Autowired
    private EmailOutboxRepository outboxRepo;

    @Test
    @DisplayName("POST /api/contact with valid service enquiry payload returns 201 Created and queues admin/client emails")
    void testValidServiceEnquirySubmission() throws Exception {
        String jsonPayload = """
        {
            "fullName": "Rahul Sharma",
            "email": "rahul.sharma@example.com",
            "phone": "+91 98765 43210",
            "service": "IT & Digital Solutions",
            "message": "We require a cloud migration strategy and architecture roadmap for our fintech application."
        }
        """;

        String responseBody = mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonPayload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.referenceId", containsString("DKP-CNT-")))
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Verify entity in contact_submissions
        List<ContactSubmission> submissions = contactRepo.findByEmailOrderByCreatedAtDesc("rahul.sharma@example.com");
        assertThat(submissions).isNotEmpty();
        ContactSubmission latest = submissions.get(0);
        assertThat(latest.getService()).isEqualTo("IT & Digital Solutions");
        assertThat(latest.getFullName()).isEqualTo("Rahul Sharma");

        // Verify email outbox events: CONTACT_ADMIN_NOTIFICATION and CONTACT_CLIENT_ACK
        List<EmailOutbox> outboxList = outboxRepo.findByReferenceId(latest.getReferenceId());
        assertThat(outboxList).hasSize(2);
        assertThat(outboxList)
                .extracting(EmailOutbox::getEventType)
                .containsExactlyInAnyOrder(EmailEventType.CONTACT_ADMIN_NOTIFICATION, EmailEventType.CONTACT_CLIENT_ACK);
    }

    @Test
    @DisplayName("POST /api/contact without service field (general contact inquiry) succeeds")
    void testGeneralContactSubmissionWithoutService() throws Exception {
        String jsonPayload = """
        {
            "fullName": "Priya Nair",
            "email": "priya.nair@example.com",
            "phone": "+91 91234 56789",
            "message": "I would like to connect with your leadership team regarding partnership opportunities."
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

    @Test
    @DisplayName("POST /api/contact with honeypot triggered should return 400 Bad Request")
    void testHoneypotRejection() throws Exception {
        String jsonPayload = """
        {
            "fullName": "Bot Spammer",
            "email": "spammer@bot.com",
            "honeypot": "I am a malicious bot filling hidden fields",
            "message": "Spam message here that is sufficiently long."
        }
        """;

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonPayload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("Your request could not be processed at this time")));
    }
}

package com.dkp.email;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class EmailOutboxTest {

    @Autowired
    private EmailOutboxRepository outboxRepository;

    @Autowired
    private EmailOutboxScheduler scheduler;

    @MockitoBean
    private ResendEmailClient resendClient;

    @Test
    @DisplayName("Should persist and process email outbox events with Excel attachment for admin")
    void testOutboxProcessing() {
        when(resendClient.sendEmail(anyString(), anyString(), anyString(), anyString()))
                .thenReturn("re_mock_provider_123");
        when(resendClient.sendEmailWithAttachment(anyString(), anyString(), anyString(), anyString(), anyString(), any(), anyString()))
                .thenReturn("re_mock_provider_123");

        EmailOutbox event = new EmailOutbox(
                EmailEventType.CONTACT_ADMIN_NOTIFICATION,
                "DKP-CNT-TEST-001",
                "admin@dkpinnovation.com",
                "Test Subject",
                "<p>Test HTML</p>",
                "Test Plain Text"
        );
        event.setNextAttemptAt(Instant.now().minusSeconds(10));
        outboxRepository.save(event);

        assertNotNull(event.getId());
        assertEquals(EmailOutboxStatus.PENDING, event.getStatus());

        // Run scheduler
        scheduler.processOutbox();

        EmailOutbox updated = outboxRepository.findById(event.getId()).orElseThrow();
        assertEquals(EmailOutboxStatus.SENT, updated.getStatus());
        assertEquals("re_mock_provider_123", updated.getProviderMessageId());
        assertEquals(1, updated.getAttemptCount());

        // Verify attachment was included for admin notification
        verify(resendClient, atLeastOnce()).sendEmailWithAttachment(
                eq("admin@dkpinnovation.com"),
                eq("Test Subject"),
                anyString(),
                anyString(),
                eq("DKP_Existing_Records.xlsx"),
                any(byte[].class),
                eq("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        );
    }

    @Test
    @DisplayName("Client and candidate acknowledgement events must NEVER include attachments")
    void testClientAckDoesNotIncludeAttachment() {
        when(resendClient.sendEmail(anyString(), anyString(), anyString(), anyString()))
                .thenReturn("re_mock_provider_client_789");

        EmailOutbox clientEvent = new EmailOutbox(
                EmailEventType.CONTACT_CLIENT_ACK,
                "DKP-CNT-CLIENT-002",
                "customer@example.com",
                "Acknowledgement Subject",
                "<p>Thank you for reaching out</p>",
                "Thank you for reaching out"
        );
        clientEvent.setNextAttemptAt(Instant.now().minusSeconds(10));
        outboxRepository.save(clientEvent);

        scheduler.processOutbox();

        EmailOutbox updated = outboxRepository.findById(clientEvent.getId()).orElseThrow();
        assertEquals(EmailOutboxStatus.SENT, updated.getStatus());
        assertEquals("re_mock_provider_client_789", updated.getProviderMessageId());

        // Verify client email was sent WITHOUT attachments
        verify(resendClient, atLeastOnce()).sendEmail(
                eq("customer@example.com"),
                eq("Acknowledgement Subject"),
                anyString(),
                anyString()
        );
        verify(resendClient, never()).sendEmailWithAttachment(
                eq("customer@example.com"),
                anyString(),
                anyString(),
                anyString(),
                anyString(),
                any(),
                anyString()
        );
    }
}


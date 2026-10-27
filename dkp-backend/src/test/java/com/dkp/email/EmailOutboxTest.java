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
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

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
    @DisplayName("Should persist and process email outbox events")
    void testOutboxProcessing() {
        when(resendClient.sendEmail(anyString(), anyString(), anyString(), anyString()))
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
    }
}


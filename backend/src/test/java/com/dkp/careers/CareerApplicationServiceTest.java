package com.dkp.careers;

import com.dkp.careers.dto.CareerApplicationRequest;
import com.dkp.common.ReferenceGenerator;
import com.dkp.config.AppProperties;
import com.dkp.email.EmailOutboxRepository;
import com.dkp.email.EmailTemplateService;
import com.dkp.email.ResendEmailClient;
import com.dkp.security.SpamProtectionService;
import com.dkp.storage.FileValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.mock.web.MockMultipartFile;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CareerApplicationServiceTest {

    @Mock
    private JobApplicationRepository repository;

    @Mock
    private EmailOutboxRepository outboxRepository;

    @Mock
    private ResendEmailClient resendClient;

    @Spy
    private FileValidator fileValidator = new FileValidator();

    @Spy
    private EmailTemplateService emailTemplateService = new EmailTemplateService();

    @Spy
    private ReferenceGenerator referenceGenerator = new ReferenceGenerator();

    @Spy
    private SpamProtectionService spamProtectionService = new SpamProtectionService();

    @Spy
    private AppProperties appProperties = new AppProperties();

    @InjectMocks
    private CareerApplicationService service;

    private CareerApplicationRequest validRequest;
    private MockMultipartFile validFile;

    @BeforeEach
    void setup() {
        validRequest = new CareerApplicationRequest();
        validRequest.setFullName("Rohan Verma");
        validRequest.setEmail("rohan@example.com");
        validRequest.setPhone("+91 98765 43210");
        validRequest.setPosition("Full Stack Engineer");
        validRequest.setDepartment("IT & Digital Solutions");
        validRequest.setExperienceLevel("3–5 Years");
        validRequest.setWorkArrangement("Hybrid");
        validRequest.setKeySkills("Java, Spring Boot, React");
        validRequest.setCoverLetter("I am a passionate software engineer with extensive experience in cloud architecture.");
        validRequest.setPrivacyConsent(true);

        byte[] pdfBytes = new byte[]{0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x35};
        validFile = new MockMultipartFile("resume", "rohan_cv.pdf", "application/pdf", pdfBytes);
    }

    @Test
    @DisplayName("When database save throws DataAccessException, email dispatch must NEVER occur")
    void testDatabaseFailurePreventsEmailDispatch() {
        when(repository.saveAndFlush(any(JobApplication.class)))
                .thenThrow(new DataIntegrityViolationException("Database constraint violation"));

        assertThatThrownBy(() -> service.processApplication(validRequest, validFile))
                .isInstanceOf(DataIntegrityViolationException.class);

        verify(resendClient, never()).sendEmailWithAttachment(anyString(), anyString(), anyString(), anyString(), anyString(), any(), anyString());
        verify(outboxRepository, never()).save(any());
    }

    @Test
    @DisplayName("When Resend email delivery fails, exception is thrown and success is not returned")
    void testEmailDeliveryFailureThrows() {
        when(repository.saveAndFlush(any(JobApplication.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(resendClient.sendEmailWithAttachment(anyString(), anyString(), anyString(), anyString(), anyString(), any(byte[].class), anyString()))
                .thenThrow(new ResendEmailClient.TransientEmailException("Network timeout contacting Resend"));

        assertThatThrownBy(() -> service.processApplication(validRequest, validFile))
                .isInstanceOf(ResendEmailClient.TransientEmailException.class);

        verify(outboxRepository, never()).save(any());
    }
}

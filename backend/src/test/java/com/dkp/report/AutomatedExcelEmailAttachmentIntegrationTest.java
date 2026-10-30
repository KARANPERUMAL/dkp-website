package com.dkp.report;

import com.dkp.careers.CareerApplicationService;
import com.dkp.careers.JobApplication;
import com.dkp.careers.JobApplicationRepository;
import com.dkp.careers.dto.CareerApplicationRequest;
import com.dkp.common.ApiResponse;
import com.dkp.config.AppProperties;
import com.dkp.contact.ContactService;
import com.dkp.contact.ContactSubmission;
import com.dkp.contact.ContactSubmissionRepository;
import com.dkp.contact.dto.ContactRequest;
import com.dkp.email.EmailOutbox;
import com.dkp.email.EmailOutboxRepository;
import com.dkp.email.EmailOutboxScheduler;
import com.dkp.email.ResendEmailClient;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class AutomatedExcelEmailAttachmentIntegrationTest {

    @Autowired
    private ContactService contactService;

    @Autowired
    private CareerApplicationService careerApplicationService;

    @Autowired
    private ContactSubmissionRepository contactRepo;

    @Autowired
    private JobApplicationRepository careerRepo;

    @Autowired
    private EmailOutboxRepository outboxRepo;

    @Autowired
    private EmailOutboxScheduler outboxScheduler;

    @Autowired
    private AppProperties appProperties;

    @MockitoBean
    private ResendEmailClient resendClient;

    private final byte[] samplePdfBytes = new byte[]{0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x35};

    @BeforeEach
    void setupMocks() {
        when(resendClient.sendEmail(anyString(), anyString(), anyString(), anyString()))
                .thenReturn("msg_mock_email_123");
        when(resendClient.sendEmailWithAttachment(anyString(), anyString(), anyString(), anyString(), anyString(), any(), anyString()))
                .thenReturn("msg_mock_attachment_456");
        when(resendClient.sendEmailWithMultipleAttachments(anyString(), anyString(), anyString(), anyString(), anyList()))
                .thenReturn("msg_mock_multi_789");
    }

    @Test
    @DisplayName("Contact Us workflow: Admin receives DKP_Existing_Records.xlsx attachment; client receives no attachment")
    void testContactUsWorkflowEmailAttachmentSeparation() throws IOException {
        ContactRequest request = new ContactRequest();
        request.setFullName("Siddharth Rao");
        request.setEmail("siddharth.rao@example.com");
        request.setPhone("+91 98888 77777");
        request.setService("IT & Digital Solutions");
        request.setMessage("We require an enterprise digital transformation consultation.");

        ApiResponse response = contactService.processSubmission(request);
        assertTrue(response.isSuccess());
        String refId = response.getReferenceId();

        // Process queued outbox events
        outboxScheduler.processOutbox();

        // 1. Verify admin notification received the Excel workbook
        ArgumentCaptor<byte[]> excelBytesCaptor = ArgumentCaptor.forClass(byte[].class);
        verify(resendClient, atLeastOnce()).sendEmailWithAttachment(
                eq(appProperties.getEmail().getContactTo()),
                contains(refId),
                anyString(),
                anyString(),
                eq(ExcelReportService.EXCEL_FILENAME),
                excelBytesCaptor.capture(),
                eq(ExcelReportService.EXCEL_CONTENT_TYPE)
        );

        byte[] capturedExcel = excelBytesCaptor.getValue();
        assertNotNull(capturedExcel);
        assertTrue(capturedExcel.length > 0);

        // Verify the Excel content contains the new submission
        try (XSSFWorkbook wb = new XSSFWorkbook(new ByteArrayInputStream(capturedExcel))) {
            Sheet contactSheet = wb.getSheet(ExcelReportService.SHEET_CONTACT_US);
            assertNotNull(contactSheet);
            boolean found = false;
            for (int r = 1; r <= contactSheet.getLastRowNum(); r++) {
                Row row = contactSheet.getRow(r);
                if (row != null && row.getCell(1) != null && refId.equals(row.getCell(1).getStringCellValue())) {
                    found = true;
                    assertEquals("Siddharth Rao", row.getCell(2).getStringCellValue());
                    assertEquals("siddharth.rao@example.com", row.getCell(3).getStringCellValue());
                    break;
                }
            }
            assertTrue(found, "The administrator Excel report must contain the newly submitted Contact Us record");
        }

        // 2. Verify client acknowledgement was sent WITHOUT any attachment
        verify(resendClient, atLeastOnce()).sendEmail(
                eq("siddharth.rao@example.com"),
                contains(refId),
                anyString(),
                anyString()
        );
        verify(resendClient, never()).sendEmailWithAttachment(
                eq("siddharth.rao@example.com"),
                anyString(),
                anyString(),
                anyString(),
                anyString(),
                any(),
                anyString()
        );
        verify(resendClient, never()).sendEmailWithMultipleAttachments(
                eq("siddharth.rao@example.com"),
                anyString(),
                anyString(),
                anyString(),
                anyList()
        );
    }

    @Test
    @DisplayName("Careers workflow: Admin receives resume AND DKP_Existing_Records.xlsx; applicant receives no attachment")
    void testCareersWorkflowEmailAttachmentSeparation() throws IOException {
        CareerApplicationRequest req = new CareerApplicationRequest();
        req.setFullName("Ananya Deshmukh");
        req.setEmail("ananya.d@example.com");
        req.setPhone("+91 97777 66666");
        req.setPosition("Creative Director");
        req.setDepartment("Creative Production & Advertising");
        req.setExperienceLevel("5+ Years");
        req.setWorkArrangement("On-site");
        req.setKeySkills("Direction, Brand Strategy, Cinematography");
        req.setCoverLetter("Experienced creative leader with 8 years in commercial advertising campaigns.");
        req.setPrivacyConsent(true);

        MockMultipartFile resume = new MockMultipartFile("resume", "ananya_portfolio_cv.pdf", "application/pdf", samplePdfBytes);

        ApiResponse response = careerApplicationService.processApplication(req, resume);
        assertTrue(response.isSuccess());
        String refId = response.getReferenceId();

        // 1. Verify admin email was sent with BOTH resume attachment and Excel workbook
        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<ResendEmailClient.EmailAttachment>> attachmentsCaptor = ArgumentCaptor.forClass(List.class);

        verify(resendClient, times(1)).sendEmailWithMultipleAttachments(
                eq(appProperties.getEmail().getCareersTo()),
                contains("Creative Director"),
                anyString(),
                anyString(),
                attachmentsCaptor.capture()
        );

        List<ResendEmailClient.EmailAttachment> attachments = attachmentsCaptor.getValue();
        assertEquals(2, attachments.size(), "Careers admin email must have exactly 2 attachments: resume and Excel workbook");

        ResendEmailClient.EmailAttachment resumeAttachment = attachments.stream()
                .filter(a -> "ananya_portfolio_cv.pdf".equals(a.filename()))
                .findFirst().orElse(null);
        assertNotNull(resumeAttachment, "Resume attachment must be present");
        assertArrayEquals(samplePdfBytes, resumeAttachment.content(), "Resume binary bytes must match original upload");
        assertEquals("application/pdf", resumeAttachment.contentType());

        ResendEmailClient.EmailAttachment excelAttachment = attachments.stream()
                .filter(a -> ExcelReportService.EXCEL_FILENAME.equals(a.filename()))
                .findFirst().orElse(null);
        assertNotNull(excelAttachment, "Excel report attachment must be present");
        assertEquals(ExcelReportService.EXCEL_CONTENT_TYPE, excelAttachment.contentType());
        assertTrue(excelAttachment.content().length > 0);

        // Verify the newly created application is in the Excel workbook
        try (XSSFWorkbook wb = new XSSFWorkbook(new ByteArrayInputStream(excelAttachment.content()))) {
            Sheet careerSheet = wb.getSheet(ExcelReportService.SHEET_CAREERS);
            assertNotNull(careerSheet);
            boolean found = false;
            for (int r = 1; r <= careerSheet.getLastRowNum(); r++) {
                Row row = careerSheet.getRow(r);
                if (row != null && row.getCell(1) != null && refId.equals(row.getCell(1).getStringCellValue())) {
                    found = true;
                    assertEquals("Ananya Deshmukh", row.getCell(2).getStringCellValue());
                    assertEquals("ananya.d@example.com", row.getCell(3).getStringCellValue());
                    assertEquals("Creative Director", row.getCell(5).getStringCellValue());
                    assertEquals("ananya_portfolio_cv.pdf", row.getCell(13).getStringCellValue());
                    break;
                }
            }
            assertTrue(found, "The administrator Excel report must contain the newly submitted Careers record");
        }

        // 2. Process candidate acknowledgement outbox
        outboxScheduler.processOutbox();

        verify(resendClient, atLeastOnce()).sendEmail(
                eq("ananya.d@example.com"),
                contains(refId),
                anyString(),
                anyString()
        );
        verify(resendClient, never()).sendEmailWithAttachment(
                eq("ananya.d@example.com"),
                anyString(),
                anyString(),
                anyString(),
                anyString(),
                any(),
                anyString()
        );
        verify(resendClient, never()).sendEmailWithMultipleAttachments(
                eq("ananya.d@example.com"),
                anyString(),
                anyString(),
                anyString(),
                anyList()
        );
    }
}

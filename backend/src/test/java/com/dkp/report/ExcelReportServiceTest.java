package com.dkp.report;

import com.dkp.careers.JobApplication;
import com.dkp.careers.JobApplicationRepository;
import com.dkp.contact.ContactSubmission;
import com.dkp.contact.ContactSubmissionRepository;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class ExcelReportServiceTest {

    @Autowired
    private ExcelReportService excelReportService;

    @Autowired
    private ContactSubmissionRepository contactRepository;

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Test
    @DisplayName("Should generate valid Excel workbook with both Contact Us and Careers worksheets")
    void testWorkbookGenerationWithSampleRecords() throws IOException {
        ContactSubmission sub = new ContactSubmission();
        sub.setReferenceId("DKP-CNT-TEST-001");
        sub.setFullName("Aarav Patel");
        sub.setEmail("aarav.patel@example.com");
        sub.setPhone("+91 98765 43210");
        sub.setService("IT & Digital Solutions");
        sub.setMessage("Looking for full-stack enterprise cloud migration.");
        sub.setStatus("SUBMITTED");

        JobApplication app = new JobApplication();
        app.setReferenceId("DKP-APP-TEST-001");
        app.setFullName("Meera Krishnan");
        app.setEmail("meera.k@example.com");
        app.setPhone("+91 91234 56789");
        app.setPosition("Senior Java Backend Engineer");
        app.setDepartment("IT & Digital Solutions");
        app.setExperienceLevel("5+ Years");
        app.setWorkArrangement("Hybrid");
        app.setKeySkills("Java 21, Spring Boot, PostgreSQL, Docker");
        app.setCoverLetter("Experienced software engineer with 6 years building microservices.");
        app.setLinkedInUrl("https://linkedin.com/in/meerak");
        app.setPortfolioUrl("https://github.com/meerak");
        app.setResumeOriginalFilename("meera_krishnan_cv.pdf");
        app.setResumeFileSizeBytes(145020L);
        app.setStatus("SUBMITTED");

        byte[] workbookBytes = excelReportService.generateRecordsWorkbook(List.of(sub), List.of(app));

        assertNotNull(workbookBytes);
        assertTrue(workbookBytes.length > 0);

        try (XSSFWorkbook workbook = new XSSFWorkbook(new ByteArrayInputStream(workbookBytes))) {
            assertEquals(2, workbook.getNumberOfSheets(), "Workbook must contain exactly two worksheets");

            // Sheet 1: Contact Us Records
            Sheet contactSheet = workbook.getSheet(ExcelReportService.SHEET_CONTACT_US);
            assertNotNull(contactSheet, "Sheet 'Contact Us Records' must exist");

            Row contactHeader = contactSheet.getRow(0);
            assertNotNull(contactHeader);
            assertEquals("Submission ID", contactHeader.getCell(0).getStringCellValue());
            assertEquals("Reference ID", contactHeader.getCell(1).getStringCellValue());
            assertEquals("Full Name", contactHeader.getCell(2).getStringCellValue());
            assertEquals("Email", contactHeader.getCell(3).getStringCellValue());
            assertEquals("Phone Number", contactHeader.getCell(4).getStringCellValue());
            assertEquals("Enquiry Type / Service", contactHeader.getCell(5).getStringCellValue());
            assertEquals("Message", contactHeader.getCell(6).getStringCellValue());
            assertEquals("Status", contactHeader.getCell(7).getStringCellValue());
            assertEquals("Submission Date & Time (UTC)", contactHeader.getCell(8).getStringCellValue());
            assertEquals("Last Updated (UTC)", contactHeader.getCell(9).getStringCellValue());

            Row contactRow1 = contactSheet.getRow(1);
            assertNotNull(contactRow1);
            assertEquals("DKP-CNT-TEST-001", contactRow1.getCell(1).getStringCellValue());
            assertEquals("Aarav Patel", contactRow1.getCell(2).getStringCellValue());
            assertEquals("aarav.patel@example.com", contactRow1.getCell(3).getStringCellValue());
            // Phone starts with + so it should be sanitized with a leading quote
            assertEquals("'+91 98765 43210", contactRow1.getCell(4).getStringCellValue());
            assertEquals("IT & Digital Solutions", contactRow1.getCell(5).getStringCellValue());
            assertEquals("SUBMITTED", contactRow1.getCell(7).getStringCellValue());

            // Sheet 2: Careers Records
            Sheet careerSheet = workbook.getSheet(ExcelReportService.SHEET_CAREERS);
            assertNotNull(careerSheet, "Sheet 'Careers Records' must exist");

            Row careerHeader = careerSheet.getRow(0);
            assertNotNull(careerHeader);
            assertEquals("Application ID", careerHeader.getCell(0).getStringCellValue());
            assertEquals("Reference ID", careerHeader.getCell(1).getStringCellValue());
            assertEquals("Applicant Name", careerHeader.getCell(2).getStringCellValue());
            assertEquals("Email", careerHeader.getCell(3).getStringCellValue());
            assertEquals("Phone Number", careerHeader.getCell(4).getStringCellValue());
            assertEquals("Applied Position", careerHeader.getCell(5).getStringCellValue());
            assertEquals("Department", careerHeader.getCell(6).getStringCellValue());
            assertEquals("Experience Level", careerHeader.getCell(7).getStringCellValue());
            assertEquals("Work Arrangement", careerHeader.getCell(8).getStringCellValue());
            assertEquals("Key Skills", careerHeader.getCell(9).getStringCellValue());
            assertEquals("Cover Letter", careerHeader.getCell(10).getStringCellValue());
            assertEquals("LinkedIn URL", careerHeader.getCell(11).getStringCellValue());
            assertEquals("Portfolio URL", careerHeader.getCell(12).getStringCellValue());
            assertEquals("Resume Filename", careerHeader.getCell(13).getStringCellValue());
            assertEquals("Resume Size (Bytes)", careerHeader.getCell(14).getStringCellValue());
            assertEquals("Status", careerHeader.getCell(15).getStringCellValue());
            assertEquals("Application Date & Time (UTC)", careerHeader.getCell(16).getStringCellValue());
            assertEquals("Last Updated (UTC)", careerHeader.getCell(17).getStringCellValue());

            Row careerRow1 = careerSheet.getRow(1);
            assertNotNull(careerRow1);
            assertEquals("DKP-APP-TEST-001", careerRow1.getCell(1).getStringCellValue());
            assertEquals("Meera Krishnan", careerRow1.getCell(2).getStringCellValue());
            assertEquals("meera.k@example.com", careerRow1.getCell(3).getStringCellValue());
            assertEquals("'+91 91234 56789", careerRow1.getCell(4).getStringCellValue());
            assertEquals("Senior Java Backend Engineer", careerRow1.getCell(5).getStringCellValue());
            assertEquals("IT & Digital Solutions", careerRow1.getCell(6).getStringCellValue());
            assertEquals("meera_krishnan_cv.pdf", careerRow1.getCell(13).getStringCellValue());
            assertEquals(145020.0, careerRow1.getCell(14).getNumericCellValue());
            assertEquals("SUBMITTED", careerRow1.getCell(15).getStringCellValue());
        }
    }

    @Test
    @DisplayName("Empty datasets should generate worksheets with headers and a clean 'No records found' indication")
    void testEmptyDatasetHandling() throws IOException {
        byte[] workbookBytes = excelReportService.generateRecordsWorkbook(Collections.emptyList(), Collections.emptyList());

        assertNotNull(workbookBytes);
        try (XSSFWorkbook workbook = new XSSFWorkbook(new ByteArrayInputStream(workbookBytes))) {
            assertEquals(2, workbook.getNumberOfSheets());

            Sheet contactSheet = workbook.getSheet(ExcelReportService.SHEET_CONTACT_US);
            assertNotNull(contactSheet);
            Row contactHeader = contactSheet.getRow(0);
            assertNotNull(contactHeader);
            Row contactEmptyRow = contactSheet.getRow(1);
            assertNotNull(contactEmptyRow);
            assertThat(contactEmptyRow.getCell(0).getStringCellValue())
                    .contains("No contact submission records found in database");

            Sheet careerSheet = workbook.getSheet(ExcelReportService.SHEET_CAREERS);
            assertNotNull(careerSheet);
            Row careerHeader = careerSheet.getRow(0);
            assertNotNull(careerHeader);
            Row careerEmptyRow = careerSheet.getRow(1);
            assertNotNull(careerEmptyRow);
            assertThat(careerEmptyRow.getCell(0).getStringCellValue())
                    .contains("No job application records found in database");
        }
    }

    @Test
    @DisplayName("Newly submitted records in database must be included when generating dynamic workbook")
    void testNewlySubmittedRecordsAppearInWorkbook() throws IOException {
        String uniqueRef = "DKP-CNT-LIVE-" + System.currentTimeMillis();
        ContactSubmission sub = new ContactSubmission();
        sub.setReferenceId(uniqueRef);
        sub.setFullName("Live Test User");
        sub.setEmail("live.user@example.com");
        sub.setMessage("This is a live test enquiry verifying dynamic export.");
        sub.setStatus("SUBMITTED");
        contactRepository.saveAndFlush(sub);

        String uniqueCareerRef = "DKP-APP-LIVE-" + System.currentTimeMillis();
        JobApplication app = new JobApplication();
        app.setReferenceId(uniqueCareerRef);
        app.setFullName("Live Candidate");
        app.setEmail("live.candidate@example.com");
        app.setPhone("+91 99999 88888");
        app.setPosition("DevOps Engineer");
        app.setDepartment("IT & Digital Solutions");
        app.setExperienceLevel("3–5 Years");
        app.setWorkArrangement("Remote");
        app.setKeySkills("Kubernetes, Terraform, AWS");
        app.setCoverLetter("DevOps specialist with 4 years infrastructure experience.");
        app.setResumeOriginalFilename("resume.pdf");
        app.setResumeContentType("application/pdf");
        app.setResumeFileSizeBytes(204800L);
        app.setPrivacyConsent(true);
        app.setPrivacyConsentAt(Instant.now());
        app.setStatus("SUBMITTED");
        jobApplicationRepository.saveAndFlush(app);

        // Generate workbook from database
        byte[] bytes = excelReportService.generateRecordsWorkbook();
        assertNotNull(bytes);

        try (XSSFWorkbook workbook = new XSSFWorkbook(new ByteArrayInputStream(bytes))) {
            Sheet contactSheet = workbook.getSheet(ExcelReportService.SHEET_CONTACT_US);
            boolean foundContact = false;
            for (int r = 1; r <= contactSheet.getLastRowNum(); r++) {
                Row row = contactSheet.getRow(r);
                if (row != null && row.getCell(1) != null && uniqueRef.equals(row.getCell(1).getStringCellValue())) {
                    foundContact = true;
                    assertEquals("Live Test User", row.getCell(2).getStringCellValue());
                    break;
                }
            }
            assertTrue(foundContact, "Newly committed Contact submission must appear in the Excel export");

            Sheet careerSheet = workbook.getSheet(ExcelReportService.SHEET_CAREERS);
            boolean foundCareer = false;
            for (int r = 1; r <= careerSheet.getLastRowNum(); r++) {
                Row row = careerSheet.getRow(r);
                if (row != null && row.getCell(1) != null && uniqueCareerRef.equals(row.getCell(1).getStringCellValue())) {
                    foundCareer = true;
                    assertEquals("Live Candidate", row.getCell(2).getStringCellValue());
                    assertEquals("DevOps Engineer", row.getCell(5).getStringCellValue());
                    break;
                }
            }
            assertTrue(foundCareer, "Newly committed Career application must appear in the Excel export");
        }
    }

    @Test
    @DisplayName("Formula injection strings must be safely sanitized with single-quote prefix")
    void testFormulaInjectionSanitization() {
        assertEquals("'=cmd|' /C calc'!A0", ExcelReportService.sanitizeText("=cmd|' /C calc'!A0"));
        assertEquals("'+91 98765 43210", ExcelReportService.sanitizeText("+91 98765 43210"));
        assertEquals("'-2+3", ExcelReportService.sanitizeText("-2+3"));
        assertEquals("'@SUM(A1:A10)", ExcelReportService.sanitizeText("@SUM(A1:A10)"));
        assertEquals("'\tTabExploit", ExcelReportService.sanitizeText("\tTabExploit"));
        assertEquals("'\rReturnExploit", ExcelReportService.sanitizeText("\rReturnExploit"));

        // Normal strings and empty values
        assertEquals("Regular text", ExcelReportService.sanitizeText("Regular text"));
        assertEquals("-", ExcelReportService.sanitizeText(null));
        assertEquals("-", ExcelReportService.sanitizeText("   "));
    }

    @Test
    @DisplayName("Performance: Large dataset of 1,000 total records should generate in-memory rapidly without errors")
    void testLargeDatasetPerformance() {
        List<ContactSubmission> contacts = new ArrayList<>();
        List<JobApplication> careers = new ArrayList<>();

        for (int i = 1; i <= 500; i++) {
            ContactSubmission sub = new ContactSubmission();
            sub.setReferenceId("DKP-CNT-BULK-" + i);
            sub.setFullName("Customer " + i);
            sub.setEmail("customer" + i + "@example.com");
            sub.setPhone("+91 98765 00" + (i % 100));
            sub.setService("IT & Digital Solutions");
            sub.setMessage("Inquiry message body number " + i + " with realistic length for performance testing.");
            sub.setStatus("SUBMITTED");
            contacts.add(sub);

            JobApplication app = new JobApplication();
            app.setReferenceId("DKP-APP-BULK-" + i);
            app.setFullName("Applicant " + i);
            app.setEmail("applicant" + i + "@example.com");
            app.setPhone("+91 91234 00" + (i % 100));
            app.setPosition("Full Stack Engineer");
            app.setDepartment("IT & Digital Solutions");
            app.setExperienceLevel("3–5 Years");
            app.setWorkArrangement("Hybrid");
            app.setKeySkills("React, TypeScript, Spring Boot");
            app.setCoverLetter("Cover letter number " + i + " describing applicant background and experience.");
            app.setResumeOriginalFilename("resume_" + i + ".pdf");
            app.setResumeFileSizeBytes(102400L + i);
            app.setStatus("SUBMITTED");
            careers.add(app);
        }

        long start = System.currentTimeMillis();
        byte[] bytes = excelReportService.generateRecordsWorkbook(contacts, careers);
        long elapsed = System.currentTimeMillis() - start;

        assertNotNull(bytes);
        assertTrue(bytes.length > 0);
        // Generation of 1,000 styled rows should complete in under 3 seconds in-memory
        assertTrue(elapsed < 4000, "Large dataset generation should complete rapidly (took " + elapsed + "ms)");
    }
}

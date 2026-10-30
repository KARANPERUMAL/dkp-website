package com.dkp.report;

import com.dkp.careers.JobApplication;
import com.dkp.careers.JobApplicationRepository;
import com.dkp.contact.ContactSubmission;
import com.dkp.contact.ContactSubmissionRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.DefaultIndexedColorMap;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Service responsible for dynamically generating the consolidated administrator Excel workbook
 * (DKP_Existing_Records.xlsx) containing all historical Contact Us and Careers records.
 */
@Service
public class ExcelReportService {

    private static final Logger log = LoggerFactory.getLogger(ExcelReportService.class);

    public static final String EXCEL_FILENAME = "DKP_Existing_Records.xlsx";
    public static final String EXCEL_CONTENT_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    public static final String SHEET_CONTACT_US = "Contact Us Records";
    public static final String SHEET_CAREERS = "Careers Records";

    private static final DateTimeFormatter DATE_TIME_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss 'UTC'").withZone(ZoneOffset.UTC);

    private static final String[] CONTACT_HEADERS = {
            "Submission ID",
            "Reference ID",
            "Full Name",
            "Email",
            "Phone Number",
            "Enquiry Type / Service",
            "Message",
            "Status",
            "Submission Date & Time (UTC)",
            "Last Updated (UTC)"
    };

    private static final String[] CAREER_HEADERS = {
            "Application ID",
            "Reference ID",
            "Applicant Name",
            "Email",
            "Phone Number",
            "Applied Position",
            "Department",
            "Experience Level",
            "Work Arrangement",
            "Key Skills",
            "Cover Letter",
            "LinkedIn URL",
            "Portfolio URL",
            "Resume Filename",
            "Resume Size (Bytes)",
            "Status",
            "Application Date & Time (UTC)",
            "Last Updated (UTC)"
    };

    private final ContactSubmissionRepository contactRepository;
    private final JobApplicationRepository jobApplicationRepository;

    public ExcelReportService(ContactSubmissionRepository contactRepository,
                              JobApplicationRepository jobApplicationRepository) {
        this.contactRepository = contactRepository;
        this.jobApplicationRepository = jobApplicationRepository;
    }

    /**
     * Generates the complete Excel workbook using the latest database records from PostgreSQL.
     *
     * @return in-memory byte array of the .xlsx workbook
     */
    @Transactional(readOnly = true)
    public byte[] generateRecordsWorkbook() {
        List<ContactSubmission> contactList = contactRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        List<JobApplication> careerList = jobApplicationRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));

        return generateRecordsWorkbook(contactList, careerList);
    }

    /**
     * Generates the Excel workbook from supplied in-memory record lists.
     *
     * @param contactList list of contact submissions
     * @param careerList  list of job applications
     * @return in-memory byte array of the .xlsx workbook
     */
    public byte[] generateRecordsWorkbook(List<ContactSubmission> contactList, List<JobApplication> careerList) {
        try (XSSFWorkbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            WorkbookStyles styles = createStyles(workbook);

            // Sheet 1: Contact Us Records
            buildContactUsSheet(workbook, styles, contactList);

            // Sheet 2: Careers Records
            buildCareersSheet(workbook, styles, careerList);

            workbook.write(baos);
            byte[] bytes = baos.toByteArray();
            log.info("Successfully generated {} [size={} bytes, contacts={}, careers={}]",
                    EXCEL_FILENAME, bytes.length,
                    contactList != null ? contactList.size() : 0,
                    careerList != null ? careerList.size() : 0);
            return bytes;
        } catch (IOException e) {
            log.error("Failed to build Excel records workbook: {}", e.getMessage(), e);
            throw new ExcelReportException("Failed to generate Excel records workbook: " + e.getMessage(), e);
        }
    }

    private void buildContactUsSheet(XSSFWorkbook workbook, WorkbookStyles styles, List<ContactSubmission> records) {
        Sheet sheet = workbook.createSheet(SHEET_CONTACT_US);
        sheet.setDisplayGridlines(true);

        // Header Row (Row 0)
        Row headerRow = sheet.createRow(0);
        headerRow.setHeightInPoints(28);

        for (int i = 0; i < CONTACT_HEADERS.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(CONTACT_HEADERS[i]);
            cell.setCellStyle(styles.headerStyle);
        }

        // Freeze top header row
        sheet.createFreezePane(0, 1);

        if (records == null || records.isEmpty()) {
            Row emptyRow = sheet.createRow(1);
            emptyRow.setHeightInPoints(22);
            Cell emptyCell = emptyRow.createCell(0);
            emptyCell.setCellValue("No contact submission records found in database.");
            emptyCell.setCellStyle(styles.emptyStyle);

            sheet.addMergedRegion(new CellRangeAddress(1, 1, 0, CONTACT_HEADERS.length - 1));
        } else {
            int rowIdx = 1;
            for (ContactSubmission sub : records) {
                Row row = sheet.createRow(rowIdx);
                row.setHeightInPoints(20);
                boolean isStriped = (rowIdx % 2 != 0);

                CellStyle textStyle = isStriped ? styles.stripedTextStyle : styles.regularTextStyle;
                CellStyle numStyle = isStriped ? styles.stripedNumStyle : styles.regularNumStyle;
                CellStyle centerStyle = isStriped ? styles.stripedCenterStyle : styles.regularCenterStyle;

                // 0: Submission ID
                Cell c0 = row.createCell(0);
                if (sub.getId() != null) {
                    c0.setCellValue(sub.getId());
                    c0.setCellStyle(numStyle);
                } else {
                    c0.setCellValue("-");
                    c0.setCellStyle(centerStyle);
                }

                // 1: Reference ID
                Cell c1 = row.createCell(1);
                c1.setCellValue(sanitizeText(sub.getReferenceId()));
                c1.setCellStyle(centerStyle);

                // 2: Full Name
                Cell c2 = row.createCell(2);
                c2.setCellValue(sanitizeText(sub.getFullName()));
                c2.setCellStyle(textStyle);

                // 3: Email
                Cell c3 = row.createCell(3);
                c3.setCellValue(sanitizeText(sub.getEmail()));
                c3.setCellStyle(textStyle);

                // 4: Phone Number
                Cell c4 = row.createCell(4);
                c4.setCellValue(sanitizeText(sub.getPhone()));
                c4.setCellStyle(centerStyle);

                // 5: Enquiry Type / Service
                Cell c5 = row.createCell(5);
                c5.setCellValue(sanitizeText(sub.getService()));
                c5.setCellStyle(textStyle);

                // 6: Message
                Cell c6 = row.createCell(6);
                c6.setCellValue(sanitizeText(sub.getMessage()));
                c6.setCellStyle(textStyle);

                // 7: Status
                Cell c7 = row.createCell(7);
                c7.setCellValue(sanitizeText(sub.getStatus()));
                c7.setCellStyle(centerStyle);

                // 8: Submission Date & Time (UTC)
                Cell c8 = row.createCell(8);
                c8.setCellValue(formatInstant(sub.getCreatedAt()));
                c8.setCellStyle(centerStyle);

                // 9: Last Updated (UTC)
                Cell c9 = row.createCell(9);
                c9.setCellValue(formatInstant(sub.getUpdatedAt()));
                c9.setCellStyle(centerStyle);

                rowIdx++;
            }

            // Auto-filter across header and populated rows
            sheet.setAutoFilter(new CellRangeAddress(0, rowIdx - 1, 0, CONTACT_HEADERS.length - 1));
        }

        // Auto-fit column widths with min and max bounds
        adjustColumnWidths(sheet, CONTACT_HEADERS.length);
    }

    private void buildCareersSheet(XSSFWorkbook workbook, WorkbookStyles styles, List<JobApplication> records) {
        Sheet sheet = workbook.createSheet(SHEET_CAREERS);
        sheet.setDisplayGridlines(true);

        // Header Row (Row 0)
        Row headerRow = sheet.createRow(0);
        headerRow.setHeightInPoints(28);

        for (int i = 0; i < CAREER_HEADERS.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(CAREER_HEADERS[i]);
            cell.setCellStyle(styles.headerStyle);
        }

        // Freeze top header row
        sheet.createFreezePane(0, 1);

        if (records == null || records.isEmpty()) {
            Row emptyRow = sheet.createRow(1);
            emptyRow.setHeightInPoints(22);
            Cell emptyCell = emptyRow.createCell(0);
            emptyCell.setCellValue("No job application records found in database.");
            emptyCell.setCellStyle(styles.emptyStyle);

            sheet.addMergedRegion(new CellRangeAddress(1, 1, 0, CAREER_HEADERS.length - 1));
        } else {
            int rowIdx = 1;
            for (JobApplication app : records) {
                Row row = sheet.createRow(rowIdx);
                row.setHeightInPoints(20);
                boolean isStriped = (rowIdx % 2 != 0);

                CellStyle textStyle = isStriped ? styles.stripedTextStyle : styles.regularTextStyle;
                CellStyle numStyle = isStriped ? styles.stripedNumStyle : styles.regularNumStyle;
                CellStyle centerStyle = isStriped ? styles.stripedCenterStyle : styles.regularCenterStyle;

                // 0: Application ID
                Cell c0 = row.createCell(0);
                if (app.getId() != null) {
                    c0.setCellValue(app.getId());
                    c0.setCellStyle(numStyle);
                } else {
                    c0.setCellValue("-");
                    c0.setCellStyle(centerStyle);
                }

                // 1: Reference ID
                Cell c1 = row.createCell(1);
                c1.setCellValue(sanitizeText(app.getReferenceId()));
                c1.setCellStyle(centerStyle);

                // 2: Applicant Name
                Cell c2 = row.createCell(2);
                c2.setCellValue(sanitizeText(app.getFullName()));
                c2.setCellStyle(textStyle);

                // 3: Email
                Cell c3 = row.createCell(3);
                c3.setCellValue(sanitizeText(app.getEmail()));
                c3.setCellStyle(textStyle);

                // 4: Phone Number
                Cell c4 = row.createCell(4);
                c4.setCellValue(sanitizeText(app.getPhone()));
                c4.setCellStyle(centerStyle);

                // 5: Applied Position
                Cell c5 = row.createCell(5);
                c5.setCellValue(sanitizeText(app.getPosition()));
                c5.setCellStyle(textStyle);

                // 6: Department
                Cell c6 = row.createCell(6);
                c6.setCellValue(sanitizeText(app.getDepartment()));
                c6.setCellStyle(textStyle);

                // 7: Experience Level
                Cell c7 = row.createCell(7);
                c7.setCellValue(sanitizeText(app.getExperienceLevel()));
                c7.setCellStyle(centerStyle);

                // 8: Work Arrangement
                Cell c8 = row.createCell(8);
                c8.setCellValue(sanitizeText(app.getWorkArrangement()));
                c8.setCellStyle(centerStyle);

                // 9: Key Skills
                Cell c9 = row.createCell(9);
                c9.setCellValue(sanitizeText(app.getKeySkills()));
                c9.setCellStyle(textStyle);

                // 10: Cover Letter
                Cell c10 = row.createCell(10);
                c10.setCellValue(sanitizeText(app.getCoverLetter()));
                c10.setCellStyle(textStyle);

                // 11: LinkedIn URL
                Cell c11 = row.createCell(11);
                c11.setCellValue(sanitizeText(app.getLinkedInUrl()));
                c11.setCellStyle(textStyle);

                // 12: Portfolio URL
                Cell c12 = row.createCell(12);
                c12.setCellValue(sanitizeText(app.getPortfolioUrl()));
                c12.setCellStyle(textStyle);

                // 13: Resume Filename
                Cell c13 = row.createCell(13);
                c13.setCellValue(sanitizeText(app.getResumeOriginalFilename()));
                c13.setCellStyle(textStyle);

                // 14: Resume Size (Bytes)
                Cell c14 = row.createCell(14);
                c14.setCellValue(app.getResumeFileSizeBytes());
                c14.setCellStyle(numStyle);

                // 15: Status
                Cell c15 = row.createCell(15);
                c15.setCellValue(sanitizeText(app.getStatus()));
                c15.setCellStyle(centerStyle);

                // 16: Application Date & Time (UTC)
                Cell c16 = row.createCell(16);
                c16.setCellValue(formatInstant(app.getCreatedAt()));
                c16.setCellStyle(centerStyle);

                // 17: Last Updated (UTC)
                Cell c17 = row.createCell(17);
                c17.setCellValue(formatInstant(app.getUpdatedAt()));
                c17.setCellStyle(centerStyle);

                rowIdx++;
            }

            // Auto-filter across header and populated rows
            sheet.setAutoFilter(new CellRangeAddress(0, rowIdx - 1, 0, CAREER_HEADERS.length - 1));
        }

        // Auto-fit column widths with min and max bounds
        adjustColumnWidths(sheet, CAREER_HEADERS.length);
    }

    private void adjustColumnWidths(Sheet sheet, int columnCount) {
        for (int col = 0; col < columnCount; col++) {
            sheet.autoSizeColumn(col);
            int currentWidth = sheet.getColumnWidth(col);
            int minWidth = 14 * 256; // ~14 characters
            int maxWidth = 55 * 256; // ~55 characters max
            sheet.setColumnWidth(col, Math.min(Math.max(currentWidth + 1200, minWidth), maxWidth));
        }
    }

    /**
     * Sanitizes user-provided text to prevent CSV/Excel formula injection (CWE-1236).
     * If the string starts with '=', '+', '-', '@', Tab, or Carriage Return, it is prefixed with a single quote.
     */
    public static String sanitizeText(String text) {
        if (text == null) {
            return "-";
        }
        if (text.isEmpty()) {
            return "-";
        }
        char rawFirst = text.charAt(0);
        if (rawFirst == '\t' || rawFirst == '\r') {
            return "'" + text;
        }
        String trimmed = text.trim();
        if (trimmed.isEmpty()) {
            return "-";
        }
        char first = trimmed.charAt(0);
        if (first == '=' || first == '+' || first == '-' || first == '@') {
            return "'" + trimmed;
        }
        return trimmed;
    }

    private String formatInstant(Instant instant) {
        if (instant == null) {
            return "-";
        }
        return DATE_TIME_FORMATTER.format(instant);
    }

    private WorkbookStyles createStyles(XSSFWorkbook workbook) {
        WorkbookStyles styles = new WorkbookStyles();

        // 1. Header Font & Style
        XSSFFont headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerFont.setFontHeightInPoints((short) 11);
        headerFont.setFontName("Segoe UI");
        headerFont.setColor(IndexedColors.WHITE.getIndex());

        styles.headerStyle = workbook.createCellStyle();
        styles.headerStyle.setFont(headerFont);
        // Primary DKP Blue: #004D86 (RGB 0, 77, 134)
        styles.headerStyle.setFillForegroundColor(new XSSFColor(new java.awt.Color(0, 77, 134), new DefaultIndexedColorMap()));
        styles.headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        styles.headerStyle.setAlignment(HorizontalAlignment.CENTER);
        styles.headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        styles.headerStyle.setBorderTop(BorderStyle.THIN);
        styles.headerStyle.setBorderBottom(BorderStyle.MEDIUM);
        styles.headerStyle.setBorderLeft(BorderStyle.THIN);
        styles.headerStyle.setBorderRight(BorderStyle.THIN);
        styles.headerStyle.setTopBorderColor(IndexedColors.GREY_40_PERCENT.getIndex());
        styles.headerStyle.setBottomBorderColor(IndexedColors.GREY_50_PERCENT.getIndex());
        styles.headerStyle.setLeftBorderColor(IndexedColors.GREY_40_PERCENT.getIndex());
        styles.headerStyle.setRightBorderColor(IndexedColors.GREY_40_PERCENT.getIndex());

        // 2. Regular Fonts
        XSSFFont regularFont = workbook.createFont();
        regularFont.setFontHeightInPoints((short) 10);
        regularFont.setFontName("Segoe UI");

        XSSFFont italicFont = workbook.createFont();
        italicFont.setFontHeightInPoints((short) 10);
        italicFont.setFontName("Segoe UI");
        italicFont.setItalic(true);
        italicFont.setColor(IndexedColors.GREY_50_PERCENT.getIndex());

        // 3. Data Styles
        styles.regularTextStyle = createDataStyle(workbook, regularFont, HorizontalAlignment.LEFT, null);
        styles.regularNumStyle = createDataStyle(workbook, regularFont, HorizontalAlignment.RIGHT, null);
        styles.regularCenterStyle = createDataStyle(workbook, regularFont, HorizontalAlignment.CENTER, null);

        // Striped color: subtle cool grey #F8FAFC
        java.awt.Color stripeColor = new java.awt.Color(248, 250, 252);
        styles.stripedTextStyle = createDataStyle(workbook, regularFont, HorizontalAlignment.LEFT, stripeColor);
        styles.stripedNumStyle = createDataStyle(workbook, regularFont, HorizontalAlignment.RIGHT, stripeColor);
        styles.stripedCenterStyle = createDataStyle(workbook, regularFont, HorizontalAlignment.CENTER, stripeColor);

        // Empty row style
        styles.emptyStyle = workbook.createCellStyle();
        styles.emptyStyle.setFont(italicFont);
        styles.emptyStyle.setAlignment(HorizontalAlignment.CENTER);
        styles.emptyStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        styles.emptyStyle.setBorderTop(BorderStyle.THIN);
        styles.emptyStyle.setBorderBottom(BorderStyle.THIN);
        styles.emptyStyle.setBorderLeft(BorderStyle.THIN);
        styles.emptyStyle.setBorderRight(BorderStyle.THIN);
        styles.emptyStyle.setTopBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
        styles.emptyStyle.setBottomBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
        styles.emptyStyle.setLeftBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
        styles.emptyStyle.setRightBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());

        return styles;
    }

    private XSSFCellStyle createDataStyle(XSSFWorkbook workbook, XSSFFont font, HorizontalAlignment align, java.awt.Color bg) {
        XSSFCellStyle style = workbook.createCellStyle();
        style.setFont(font);
        style.setAlignment(align);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setTopBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setBottomBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setLeftBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setRightBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());

        if (bg != null) {
            style.setFillForegroundColor(new XSSFColor(bg, new DefaultIndexedColorMap()));
            style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        }
        return style;
    }

    private static class WorkbookStyles {
        XSSFCellStyle headerStyle;
        XSSFCellStyle regularTextStyle;
        XSSFCellStyle regularNumStyle;
        XSSFCellStyle regularCenterStyle;
        XSSFCellStyle stripedTextStyle;
        XSSFCellStyle stripedNumStyle;
        XSSFCellStyle stripedCenterStyle;
        XSSFCellStyle emptyStyle;
    }

    public static class ExcelReportException extends RuntimeException {
        public ExcelReportException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}

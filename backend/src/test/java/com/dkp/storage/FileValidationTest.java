package com.dkp.storage;

import com.dkp.common.InvalidFileException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import static org.junit.jupiter.api.Assertions.*;

class FileValidationTest {

    private FileValidator validator;

    @BeforeEach
    void setUp() {
        validator = new FileValidator();
    }

    @Test
    @DisplayName("Should accept valid PDF file with %PDF magic bytes")
    void testValidPdf() {
        byte[] pdfContent = new byte[]{0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x34};
        MockMultipartFile file = new MockMultipartFile("resume", "resume.pdf", "application/pdf", pdfContent);
        assertDoesNotThrow(() -> validator.validateResumeFile(file));
    }

    @Test
    @DisplayName("Should accept valid DOCX file with PK.. magic bytes")
    void testValidDocx() {
        byte[] docxContent = new byte[]{0x50, 0x4B, 0x03, 0x04, 0x14, 0x00, 0x06, 0x00};
        MockMultipartFile file = new MockMultipartFile("resume", "cv.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", docxContent);
        assertDoesNotThrow(() -> validator.validateResumeFile(file));
    }

    @Test
    @DisplayName("Should accept valid DOC file with OLE2 magic bytes")
    void testValidDoc() {
        byte[] docContent = new byte[]{(byte) 0xD0, (byte) 0xCF, 0x11, (byte) 0xE0, (byte) 0xA1, (byte) 0xB1, 0x1A, (byte) 0xE1};
        MockMultipartFile file = new MockMultipartFile("resume", "cv.doc", "application/msword", docContent);
        assertDoesNotThrow(() -> validator.validateResumeFile(file));
    }

    @Test
    @DisplayName("Should reject empty file")
    void testEmptyFile() {
        MockMultipartFile file = new MockMultipartFile("resume", "resume.pdf", "application/pdf", new byte[0]);
        InvalidFileException ex = assertThrows(InvalidFileException.class, () -> validator.validateResumeFile(file));
        assertTrue(ex.getMessage().contains("required"));
    }

    @Test
    @DisplayName("Should reject file exceeding 5 MB limit")
    void testOversizedFile() {
        byte[] largeBytes = new byte[5 * 1024 * 1024 + 10];
        largeBytes[0] = 0x25;
        largeBytes[1] = 0x50;
        largeBytes[2] = 0x44;
        largeBytes[3] = 0x46;
        MockMultipartFile file = new MockMultipartFile("resume", "large.pdf", "application/pdf", largeBytes);
        InvalidFileException ex = assertThrows(InvalidFileException.class, () -> validator.validateResumeFile(file));
        assertTrue(ex.getMessage().contains("exceeds 5 MB"));
    }

    @Test
    @DisplayName("Should reject executable disguised with .pdf extension")
    void testDisguisedExecutable() {
        // MZ header for DOS/PE executable
        byte[] exeBytes = new byte[]{0x4D, 0x5A, 0x00, 0x00, 0x01, 0x02};
        MockMultipartFile file = new MockMultipartFile("resume", "malicious.pdf", "application/pdf", exeBytes);
        InvalidFileException ex = assertThrows(InvalidFileException.class, () -> validator.validateResumeFile(file));
        assertTrue(ex.getMessage().contains("file signature does not match") || ex.getMessage().contains("not an authentic PDF"));
    }

    @Test
    @DisplayName("Should reject disallowed file extensions")
    void testDisallowedExtension() {
        byte[] bytes = new byte[]{0x25, 0x50, 0x44, 0x46};
        MockMultipartFile file = new MockMultipartFile("resume", "script.sh", "text/plain", bytes);
        InvalidFileException ex = assertThrows(InvalidFileException.class, () -> validator.validateResumeFile(file));
        assertTrue(ex.getMessage().contains("Unsupported file type"));
    }

    @Test
    @DisplayName("Should reject path traversal attempts in filename")
    void testPathTraversal() {
        byte[] bytes = new byte[]{0x25, 0x50, 0x44, 0x46};
        MockMultipartFile file = new MockMultipartFile("resume", "../../etc/passwd.pdf", "application/pdf", bytes);
        InvalidFileException ex = assertThrows(InvalidFileException.class, () -> validator.validateResumeFile(file));
        assertTrue(ex.getMessage().contains("Invalid filename pattern"));
    }
}

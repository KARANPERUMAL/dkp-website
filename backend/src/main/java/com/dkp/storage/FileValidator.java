package com.dkp.storage;

import com.dkp.common.InvalidFileException;
import com.dkp.config.AppProperties;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;

@Component
public class FileValidator {

    public static final long DEFAULT_MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
    public static final List<String> DEFAULT_ALLOWED_EXTENSIONS = List.of(".pdf", ".docx", ".doc");

    // Magic bytes for supported document types
    private static final byte[] PDF_MAGIC = new byte[]{0x25, 0x50, 0x44, 0x46}; // %PDF
    private static final byte[] DOCX_MAGIC = new byte[]{0x50, 0x4B, 0x03, 0x04}; // PK.. (ZIP archive)
    private static final byte[] DOC_MAGIC = new byte[]{(byte) 0xD0, (byte) 0xCF, 0x11, (byte) 0xE0}; // OLE2 container

    private final AppProperties appProperties;

    public FileValidator(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    public FileValidator() {
        this.appProperties = new AppProperties();
    }

    public void validateResumeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("Resume file is required. Please upload your CV or resume.");
        }

        long maxBytes = (appProperties != null && appProperties.getUpload() != null)
                ? appProperties.getUpload().getMaxFileSizeBytes()
                : DEFAULT_MAX_FILE_SIZE_BYTES;

        if (file.getSize() > maxBytes) {
            long maxMb = maxBytes / (1024 * 1024);
            throw new InvalidFileException("File size exceeds " + maxMb + " MB limit. Provided: " + (file.getSize() / 1024 / 1024) + " MB.");
        }

        String originalFilename = file.getOriginalFilename();
        if (!StringUtils.hasText(originalFilename)) {
            throw new InvalidFileException("Filename cannot be empty.");
        }

        // Sanitize path traversal attempts
        if (originalFilename.contains("..") || originalFilename.contains("/") || originalFilename.contains("\\")) {
            throw new InvalidFileException("Invalid filename pattern detected.");
        }

        String lowerName = originalFilename.toLowerCase();
        List<String> allowedExtensions = (appProperties != null && appProperties.getUpload() != null)
                ? appProperties.getUpload().getAllowedExtensions()
                : DEFAULT_ALLOWED_EXTENSIONS;

        boolean validExtension = allowedExtensions.stream().anyMatch(lowerName::endsWith);
        if (!validExtension) {
            throw new InvalidFileException("Unsupported file type. Please upload a PDF, DOCX, or DOC document.");
        }

        // Magic bytes validation to prevent disguised executable or malicious uploads
        try (InputStream is = file.getInputStream()) {
            byte[] header = new byte[4];
            int read = is.read(header);
            if (read < 4) {
                throw new InvalidFileException("Malformed or unreadable file content.");
            }

            boolean isPdf = Arrays.equals(header, PDF_MAGIC);
            boolean isDocx = Arrays.equals(header, DOCX_MAGIC);
            boolean isDoc = Arrays.equals(header, DOC_MAGIC);

            if (!isPdf && !isDocx && !isDoc) {
                throw new InvalidFileException("The file signature does not match an authentic PDF, DOCX, or DOC file.");
            }

            // Ensure extension matches the inspected signature
            if (lowerName.endsWith(".pdf") && !isPdf) {
                throw new InvalidFileException("The file has a .pdf extension but is not an authentic PDF document.");
            }
            if (lowerName.endsWith(".docx") && !isDocx) {
                throw new InvalidFileException("The file has a .docx extension but is not an authentic OpenXML document.");
            }
            if (lowerName.endsWith(".doc") && !isDoc) {
                throw new InvalidFileException("The file has a .doc extension but is not an authentic Microsoft Word document.");
            }
        } catch (IOException e) {
            throw new InvalidFileException("Failed to read and verify uploaded file: " + e.getMessage());
        }
    }

    public String sanitizeFilename(String originalFilename) {
        if (!StringUtils.hasText(originalFilename)) {
            return "resume.pdf";
        }
        String clean = originalFilename.trim().replaceAll("[^a-zA-Z0-9._-]", "_");
        if (clean.length() > 100) {
            int extIdx = clean.lastIndexOf('.');
            String ext = extIdx > 0 ? clean.substring(extIdx) : ".pdf";
            String base = extIdx > 0 ? clean.substring(0, Math.min(80, extIdx)) : clean.substring(0, 80);
            clean = base + ext;
        }
        return clean;
    }
}

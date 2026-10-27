package com.dkp.storage;

import com.dkp.common.InvalidFileException;
import com.dkp.config.AppProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Optional;
import java.util.UUID;

public class LocalResumeStorageService implements ResumeStorageService {

    private static final Logger log = LoggerFactory.getLogger(LocalResumeStorageService.class);
    private final Path storageDirectory;
    private final FileValidator fileValidator;

    public LocalResumeStorageService(AppProperties appProperties, FileValidator fileValidator) {
        this.storageDirectory = Paths.get(appProperties.getStorage().getLocalDir()).toAbsolutePath().normalize();
        this.fileValidator = fileValidator;
        try {
            Files.createDirectories(this.storageDirectory);
            log.info("Initialized LocalResumeStorageService at: {}", this.storageDirectory);
        } catch (IOException e) {
            throw new IllegalStateException("Could not create local resume storage directory at " + this.storageDirectory, e);
        }
    }

    @Override
    public StoredResumeMetadata store(MultipartFile file) {
        fileValidator.validateResumeFile(file);

        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume.pdf";
        String extension = "";
        int dotIdx = originalFilename.lastIndexOf('.');
        if (dotIdx > 0) {
            extension = originalFilename.substring(dotIdx).toLowerCase();
        }

        String storageKey = UUID.randomUUID().toString() + extension;
        Path targetPath = this.storageDirectory.resolve(storageKey);

        try (InputStream is = file.getInputStream()) {
            Files.copy(is, targetPath, StandardCopyOption.REPLACE_EXISTING);
            log.info("Securely stored resume locally with storage key: {}", storageKey);
            return new StoredResumeMetadata(
                    storageKey,
                    originalFilename,
                    file.getContentType() != null ? file.getContentType() : "application/octet-stream",
                    file.getSize()
            );
        } catch (IOException e) {
            log.error("Failed to store uploaded file locally: {}", e.getMessage());
            throw new InvalidFileException("Could not save the uploaded resume. Please try again.");
        }
    }

    @Override
    public Optional<InputStream> get(String storageKey) {
        try {
            Path targetPath = this.storageDirectory.resolve(storageKey).normalize();
            if (!targetPath.startsWith(this.storageDirectory)) {
                log.warn("Path traversal attempt in storage get: {}", storageKey);
                return Optional.empty();
            }
            File f = targetPath.toFile();
            if (f.exists() && f.isFile()) {
                return Optional.of(new FileInputStream(f));
            }
        } catch (IOException e) {
            log.error("Error reading stored resume file {}: {}", storageKey, e.getMessage());
        }
        return Optional.empty();
    }

    @Override
    public void delete(String storageKey) {
        try {
            Path targetPath = this.storageDirectory.resolve(storageKey).normalize();
            if (targetPath.startsWith(this.storageDirectory)) {
                Files.deleteIfExists(targetPath);
                log.info("Deleted stored resume file: {}", storageKey);
            }
        } catch (IOException e) {
            log.warn("Failed to delete stored resume file {}: {}", storageKey, e.getMessage());
        }
    }
}

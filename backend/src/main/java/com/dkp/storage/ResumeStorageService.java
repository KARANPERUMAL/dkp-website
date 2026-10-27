package com.dkp.storage;

import org.springframework.web.multipart.MultipartFile;
import java.io.InputStream;
import java.util.Optional;

public interface ResumeStorageService {

    StoredResumeMetadata store(MultipartFile file);

    Optional<InputStream> get(String storageKey);

    void delete(String storageKey);
}

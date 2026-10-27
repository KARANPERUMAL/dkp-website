package com.dkp.storage;

public class StoredResumeMetadata {

    private final String storageKey;
    private final String originalFilename;
    private final String contentType;
    private final long fileSizeBytes;

    public StoredResumeMetadata(String storageKey, String originalFilename, String contentType, long fileSizeBytes) {
        this.storageKey = storageKey;
        this.originalFilename = originalFilename;
        this.contentType = contentType;
        this.fileSizeBytes = fileSizeBytes;
    }

    public String getStorageKey() {
        return storageKey;
    }

    public String getOriginalFilename() {
        return originalFilename;
    }

    public String getContentType() {
        return contentType;
    }

    public long getFileSizeBytes() {
        return fileSizeBytes;
    }
}

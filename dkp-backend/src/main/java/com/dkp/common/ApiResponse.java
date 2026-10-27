package com.dkp.common;

import java.time.Instant;

public class ApiResponse {

    private boolean success;
    private String referenceId;
    private String message;
    private Instant timestamp;

    public ApiResponse() {
        this.timestamp = Instant.now();
    }

    public ApiResponse(boolean success, String referenceId, String message) {
        this.success = success;
        this.referenceId = referenceId;
        this.message = message;
        this.timestamp = Instant.now();
    }

    public static ApiResponse ok(String referenceId, String message) {
        return new ApiResponse(true, referenceId, message);
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(String referenceId) {
        this.referenceId = referenceId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
}

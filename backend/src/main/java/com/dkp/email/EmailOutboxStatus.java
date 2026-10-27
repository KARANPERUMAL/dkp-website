package com.dkp.email;

public enum EmailOutboxStatus {
    PENDING,
    PROCESSING,
    SENT,
    FAILED,
    PERMANENT_FAILURE
}

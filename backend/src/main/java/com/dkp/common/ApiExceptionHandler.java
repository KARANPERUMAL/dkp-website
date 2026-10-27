package com.dkp.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(ApiExceptionHandler.class);

    private String getCorrelationId() {
        String id = MDC.get(CorrelationIdFilter.MDC_KEY);
        return id != null ? id : "unknown";
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }

        log.warn("Validation failure: {} errors [correlationId={}]", errors.size(), getCorrelationId());

        ApiError apiError = new ApiError(
                HttpStatus.BAD_REQUEST.value(),
                "Bad Request",
                "Form validation failed. Please correct the highlighted errors and try again.",
                getCorrelationId(),
                errors
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiError);
    }

    @ExceptionHandler(InvalidFileException.class)
    public ResponseEntity<ApiError> handleInvalidFile(InvalidFileException ex) {
        log.warn("Invalid file upload rejected: {} [correlationId={}]", ex.getMessage(), getCorrelationId());
        ApiError apiError = new ApiError(
                HttpStatus.BAD_REQUEST.value(),
                "Invalid File",
                ex.getMessage(),
                getCorrelationId()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiError);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ApiError> handleMaxSizeException(MaxUploadSizeExceededException ex) {
        log.warn("Upload size limit exceeded [correlationId={}]", getCorrelationId());
        ApiError apiError = new ApiError(
                HttpStatus.PAYLOAD_TOO_LARGE.value(),
                "Payload Too Large",
                "The uploaded file exceeds the maximum allowed size limit of 5 MB.",
                getCorrelationId()
        );
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(apiError);
    }

    @ExceptionHandler(RateLimitExceededException.class)
    public ResponseEntity<ApiError> handleRateLimit(RateLimitExceededException ex) {
        log.warn("Rate limit triggered: {} [correlationId={}]", ex.getMessage(), getCorrelationId());
        ApiError apiError = new ApiError(
                HttpStatus.TOO_MANY_REQUESTS.value(),
                "Too Many Requests",
                "You have submitted too many requests recently. Please wait a few moments before trying again.",
                getCorrelationId()
        );
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(apiError);
    }

    @ExceptionHandler(SpamDetectedException.class)
    public ResponseEntity<ApiError> handleSpam(SpamDetectedException ex) {
        log.warn("Spam attempt filtered [correlationId={}]", getCorrelationId());
        ApiError apiError = new ApiError(
                HttpStatus.BAD_REQUEST.value(),
                "Bad Request",
                "Your request could not be processed at this time.",
                getCorrelationId()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiError);
    }

    @ExceptionHandler(com.dkp.email.ResendEmailClient.TransientEmailException.class)
    public ResponseEntity<ApiError> handleTransientEmail(com.dkp.email.ResendEmailClient.TransientEmailException ex) {
        log.error("Transient email gateway failure [correlationId={}]: {}", getCorrelationId(), ex.getMessage());
        ApiError apiError = new ApiError(
                HttpStatus.SERVICE_UNAVAILABLE.value(),
                "Service Unavailable",
                "Email delivery service temporarily unavailable. Your application could not be dispatched. Please try again in a few moments or email your resume directly to careers@dkpinnovation.com.",
                getCorrelationId()
        );
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(apiError);
    }

    @ExceptionHandler(com.dkp.email.ResendEmailClient.PermanentEmailException.class)
    public ResponseEntity<ApiError> handlePermanentEmail(com.dkp.email.ResendEmailClient.PermanentEmailException ex) {
        log.error("Permanent email gateway failure [correlationId={}]: {}", getCorrelationId(), ex.getMessage());
        ApiError apiError = new ApiError(
                HttpStatus.BAD_GATEWAY.value(),
                "Bad Gateway",
                "Email gateway rejected the application message. Please ensure your contact details are valid or submit your resume directly to careers@dkpinnovation.com.",
                getCorrelationId()
        );
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(apiError);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleIllegalArgument(IllegalArgumentException ex) {
        log.warn("Illegal argument: {} [correlationId={}]", ex.getMessage(), getCorrelationId());
        ApiError apiError = new ApiError(
                HttpStatus.BAD_REQUEST.value(),
                "Bad Request",
                ex.getMessage(),
                getCorrelationId()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiError);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGenericException(Exception ex) {
        log.error("Unhandled internal server error [correlationId={}]: {}", getCorrelationId(), ex.getMessage(), ex);
        ApiError apiError = new ApiError(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error",
                "An unexpected server error occurred. Your request could not be completed. Please try again later.",
                getCorrelationId()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiError);
    }
}

package com.dkp.careers;

import com.dkp.careers.dto.CareerApplicationRequest;
import com.dkp.common.ApiResponse;
import com.dkp.security.RateLimitService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/careers")
@Tag(name = "Careers", description = "Endpoints for job application submissions and resume processing")
public class CareerApplicationController {

    private final CareerApplicationService service;
    private final RateLimitService rateLimitService;

    public CareerApplicationController(CareerApplicationService service, RateLimitService rateLimitService) {
        this.service = service;
        this.rateLimitService = rateLimitService;
    }

    @PostMapping(value = {"/applications", "/apply"}, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Submit a job application", description = "Accepts candidate details and resume document (PDF, DOCX, DOC up to 5 MB)")
    public ResponseEntity<ApiResponse> submitApplication(
            @Valid @ModelAttribute CareerApplicationRequest form,
            @RequestPart("resume") MultipartFile resume,
            HttpServletRequest request
    ) {
        rateLimitService.checkRateLimit(request, "/api/careers/applications");
        ApiResponse response = service.processApplication(form, resume);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

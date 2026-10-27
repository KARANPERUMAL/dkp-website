package com.dkp.services;

import com.dkp.common.ApiResponse;
import com.dkp.security.RateLimitService;
import com.dkp.services.dto.ServiceEnquiryRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/services")
@Tag(name = "Services", description = "Endpoints for client service enquiries and project proposals")
public class ServiceEnquiryController {

    private final ServiceEnquiryService service;
    private final RateLimitService rateLimitService;

    public ServiceEnquiryController(ServiceEnquiryService service, RateLimitService rateLimitService) {
        this.service = service;
        this.rateLimitService = rateLimitService;
    }

    @PostMapping("/enquiries")
    @Operation(summary = "Submit a service enquiry", description = "Accepts client contact details, selected capability, and project scope")
    public ResponseEntity<ApiResponse> submitEnquiry(
            @Valid @RequestBody ServiceEnquiryRequest request,
            HttpServletRequest httpRequest
    ) {
        rateLimitService.checkRateLimit(httpRequest, "/api/services/enquiries");
        ApiResponse response = service.processEnquiry(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

package com.dkp.contact;

import com.dkp.common.ApiResponse;
import com.dkp.contact.dto.ContactRequest;
import com.dkp.security.RateLimitService;
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
@RequestMapping("/api/contact")
@Tag(name = "Contact", description = "Endpoints for general contact inquiries and consultation requests")
public class ContactController {

    private final ContactService service;
    private final RateLimitService rateLimitService;

    public ContactController(ContactService service, RateLimitService rateLimitService) {
        this.service = service;
        this.rateLimitService = rateLimitService;
    }

    @PostMapping
    @Operation(summary = "Submit a contact form message", description = "Accepts direct inquiries from the Contact Us page")
    public ResponseEntity<ApiResponse> submitContact(
            @Valid @RequestBody ContactRequest request,
            HttpServletRequest httpRequest
    ) {
        rateLimitService.checkRateLimit(httpRequest, "/api/contact");
        ApiResponse response = service.processSubmission(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

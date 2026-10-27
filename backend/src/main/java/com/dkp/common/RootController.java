package com.dkp.common;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@Tag(name = "Root", description = "Root service health and status endpoints")
public class RootController {

    @GetMapping(value = "/", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "API Root", description = "Returns service status and API identification")
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("name", "DKP Innovations API");
        body.put("status", "UP");
        body.put("message", "DKP Innovations REST API service is running.");
        body.put("timestamp", Instant.now().toString());
        return ResponseEntity.ok(body);
    }

    @GetMapping("/favicon.ico")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Favicon", description = "Graceful no-content response for browser icon requests")
    public ResponseEntity<Void> favicon() {
        return ResponseEntity.noContent().build();
    }
}

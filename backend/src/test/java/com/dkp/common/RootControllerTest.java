package com.dkp.common;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class RootControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("GET / should return 200 OK with service identification JSON")
    void testRootEndpointReturnsServiceInfo() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.name").value("DKP Innovations API"))
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.message", containsString("running")))
                .andExpect(jsonPath("$.timestamp", notNullValue()))
                .andExpect(header().exists(CorrelationIdFilter.CORRELATION_ID_HEADER));
    }

    @Test
    @DisplayName("GET /favicon.ico should return 204 No Content")
    void testFaviconEndpointReturnsNoContent() throws Exception {
        mockMvc.perform(get("/favicon.ico"))
                .andExpect(status().isNoContent())
                .andExpect(content().string(""))
                .andExpect(header().exists(CorrelationIdFilter.CORRELATION_ID_HEADER));
    }

    @Test
    @DisplayName("GET unknown root path should return 404 Not Found rather than 500")
    void testUnknownRouteReturns404() throws Exception {
        mockMvc.perform(get("/nonexistent-endpoint-xyz"))
                .andExpect(status().isNotFound())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message", containsString("not found")))
                .andExpect(jsonPath("$.correlationId", notNullValue()));
    }

    @Test
    @DisplayName("GET unknown API subpath should return 404 Not Found rather than 500")
    void testUnknownApiSubpathReturns404() throws Exception {
        mockMvc.perform(get("/api/unknown-service-route"))
                .andExpect(status().isNotFound())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message", containsString("not found")));
    }

    @Test
    @DisplayName("POST / on GET-only root should return 405 Method Not Allowed rather than 500")
    void testMethodNotAllowedReturns405() throws Exception {
        mockMvc.perform(post("/"))
                .andExpect(status().isMethodNotAllowed())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value(405))
                .andExpect(jsonPath("$.error").value("Method Not Allowed"));
    }
}

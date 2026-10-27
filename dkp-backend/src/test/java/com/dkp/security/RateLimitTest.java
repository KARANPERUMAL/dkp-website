package com.dkp.security;

import com.dkp.common.RateLimitExceededException;
import com.dkp.config.AppProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class RateLimitTest {

    private RateLimitService rateLimitService;
    private AppProperties appProperties;

    @BeforeEach
    void setUp() {
        appProperties = new AppProperties();
        appProperties.getRateLimit().setEnabled(true);
        appProperties.getRateLimit().setCapacity(3);
        appProperties.getRateLimit().setRefillTokens(3);
        appProperties.getRateLimit().setRefillPeriodSeconds(60);
        appProperties.getSecurity().setTrustedProxies(List.of("127.0.0.1"));

        rateLimitService = new RateLimitService(appProperties);
    }

    @Test
    @DisplayName("Should allow requests within capacity and block subsequent requests")
    void testRateLimitEnforcement() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRemoteAddr("192.168.1.100");

        // First 3 requests should pass
        assertDoesNotThrow(() -> rateLimitService.checkRateLimit(request, "/api/contact"));
        assertDoesNotThrow(() -> rateLimitService.checkRateLimit(request, "/api/contact"));
        assertDoesNotThrow(() -> rateLimitService.checkRateLimit(request, "/api/contact"));

        // 4th request must throw RateLimitExceededException
        assertThrows(RateLimitExceededException.class, () -> rateLimitService.checkRateLimit(request, "/api/contact"));
    }

    @Test
    @DisplayName("Should isolate rate limits across different routes")
    void testRouteIsolation() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRemoteAddr("192.168.1.101");

        // Consume all tokens for /api/contact
        assertDoesNotThrow(() -> rateLimitService.checkRateLimit(request, "/api/contact"));
        assertDoesNotThrow(() -> rateLimitService.checkRateLimit(request, "/api/contact"));
        assertDoesNotThrow(() -> rateLimitService.checkRateLimit(request, "/api/contact"));
        assertThrows(RateLimitExceededException.class, () -> rateLimitService.checkRateLimit(request, "/api/contact"));

        // Route /api/careers should still have full quota for this IP
        assertDoesNotThrow(() -> rateLimitService.checkRateLimit(request, "/api/careers"));
    }

    @Test
    @DisplayName("Should inspect X-Forwarded-For only when remote address is trusted proxy")
    void testTrustedProxyResolution() {
        MockHttpServletRequest trustedReq = new MockHttpServletRequest();
        trustedReq.setRemoteAddr("127.0.0.1"); // trusted proxy
        trustedReq.addHeader("X-Forwarded-For", "203.0.113.195, 10.0.0.1");

        String resolved = rateLimitService.resolveClientIp(trustedReq);
        assertEquals("203.0.113.195", resolved);

        MockHttpServletRequest untrustedReq = new MockHttpServletRequest();
        untrustedReq.setRemoteAddr("198.51.100.22"); // untrusted direct client
        untrustedReq.addHeader("X-Forwarded-For", "spoofed.ip.address");

        String untrustedResolved = rateLimitService.resolveClientIp(untrustedReq);
        assertEquals("198.51.100.22", untrustedResolved);
    }
}

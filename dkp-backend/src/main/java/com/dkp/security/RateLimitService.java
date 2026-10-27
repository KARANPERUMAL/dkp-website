package com.dkp.security;

import com.dkp.common.RateLimitExceededException;
import com.dkp.config.AppProperties;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class RateLimitService {

    private final AppProperties appProperties;
    private final Map<String, TokenBucket> buckets = new ConcurrentHashMap<>();

    public RateLimitService(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    public void checkRateLimit(HttpServletRequest request, String route) {
        if (!appProperties.getRateLimit().isEnabled()) {
            return;
        }

        String clientIp = resolveClientIp(request);
        String bucketKey = route + ":" + clientIp;

        int capacity = appProperties.getRateLimit().getCapacity();
        long refillPeriodNanos = (long) appProperties.getRateLimit().getRefillPeriodSeconds() * 1_000_000_000L;
        int refillTokens = appProperties.getRateLimit().getRefillTokens();

        TokenBucket bucket = buckets.computeIfAbsent(bucketKey, k -> new TokenBucket(capacity, refillTokens, refillPeriodNanos));

        if (!bucket.tryConsume()) {
            throw new RateLimitExceededException("Rate limit exceeded for route: " + route);
        }

        // Periodic cleanup if map grows too large (> 10000 entries)
        if (buckets.size() > 10000) {
            long now = System.nanoTime();
            buckets.entrySet().removeIf(entry -> entry.getValue().isStale(now, refillPeriodNanos * 2));
        }
    }

    public String resolveClientIp(HttpServletRequest request) {
        String remoteAddr = request.getRemoteAddr();
        var trusted = appProperties.getSecurity().getTrustedProxies();

        // Only inspect X-Forwarded-For if request came from a trusted reverse proxy (e.g. Render/Cloudflare)
        if (trusted != null && (trusted.contains(remoteAddr) || trusted.contains("*"))) {
            String xff = request.getHeader("X-Forwarded-For");
            if (StringUtils.hasText(xff)) {
                // Return first hop in X-Forwarded-For
                String[] parts = xff.split(",");
                if (parts.length > 0 && StringUtils.hasText(parts[0].trim())) {
                    return parts[0].trim();
                }
            }
        }
        return remoteAddr != null ? remoteAddr : "unknown";
    }

    private static class TokenBucket {
        private final int capacity;
        private final int refillTokens;
        private final long refillPeriodNanos;
        private final AtomicInteger tokens;
        private final AtomicLong lastRefillTime;

        public TokenBucket(int capacity, int refillTokens, long refillPeriodNanos) {
            this.capacity = capacity;
            this.refillTokens = refillTokens;
            this.refillPeriodNanos = refillPeriodNanos;
            this.tokens = new AtomicInteger(capacity);
            this.lastRefillTime = new AtomicLong(System.nanoTime());
        }

        public synchronized boolean tryConsume() {
            refill();
            int current = tokens.get();
            if (current > 0) {
                tokens.decrementAndGet();
                return true;
            }
            return false;
        }

        private void refill() {
            long now = System.nanoTime();
            long last = lastRefillTime.get();
            long elapsed = now - last;

            if (elapsed >= refillPeriodNanos) {
                long refills = elapsed / refillPeriodNanos;
                int added = (int) Math.min(capacity, refills * refillTokens);
                tokens.set(Math.min(capacity, tokens.get() + added));
                lastRefillTime.set(now);
            }
        }

        public boolean isStale(long now, long staleThresholdNanos) {
            return (now - lastRefillTime.get()) > staleThresholdNanos && tokens.get() == capacity;
        }
    }
}

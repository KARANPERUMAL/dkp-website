package com.dkp.services;

import org.springframework.stereotype.Component;
import java.util.Set;

@Component
public class ServiceCatalogue {

    private static final Set<String> KNOWN_CATEGORIES = Set.of(
            "IT & Digital Solutions",
            "Digital Marketing & Lead Generation",
            "Branding, PR & Influencer Marketing",
            "Creative Production & Advertising",
            "Business Registration & Corporate Compliance",
            "General Inquiry",
            "Other"
    );

    public boolean isValidService(String service) {
        if (service == null || service.trim().isEmpty()) {
            return false;
        }
        String clean = service.trim();
        // Allow if it matches or contains any known category, or is a specific valid service name
        return clean.length() >= 3 && clean.length() <= 150;
    }
}

package com.dkp.common;

import org.springframework.stereotype.Component;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Component
public class ReferenceGenerator {

    private static final String ALPHANUMERIC = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // exclude easily confused chars (0, 1, I, O)
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd");
    private final SecureRandom random = new SecureRandom();

    public String generateCareerReference() {
        return generate("APP");
    }

    public String generateServiceReference() {
        return generate("SRV");
    }

    public String generateContactReference() {
        return generate("CNT");
    }

    private String generate(String prefix) {
        String datePart = LocalDate.now().format(DATE_FORMATTER);
        StringBuilder suffix = new StringBuilder(6);
        for (int i = 0; i < 6; i++) {
            suffix.append(ALPHANUMERIC.charAt(random.nextInt(ALPHANUMERIC.length())));
        }
        return "DKP-" + prefix + "-" + datePart + "-" + suffix;
    }
}

package com.dkp.common;

import ch.qos.logback.classic.pattern.MessageConverter;
import ch.qos.logback.classic.spi.ILoggingEvent;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class DataMaskingConverter extends MessageConverter {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("(?i)[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}");
    private static final Pattern PHONE_PATTERN = Pattern.compile("\\+?[0-9]{1,4}?[-.\\s]?(\\(?[0-9]{2,5}\\)?[-.\\s]?){1,3}[0-9]{3,5}");

    @Override
    public String convert(ILoggingEvent event) {
        String message = event.getFormattedMessage();
        if (message == null || message.isEmpty()) {
            return message;
        }

        // Mask emails
        Matcher emailMatcher = EMAIL_PATTERN.matcher(message);
        if (emailMatcher.find()) {
            message = emailMatcher.replaceAll("[EMAIL_REDACTED]");
        }

        // Mask phone numbers (length >= 8)
        Matcher phoneMatcher = PHONE_PATTERN.matcher(message);
        if (phoneMatcher.find()) {
            message = phoneMatcher.replaceAll("[PHONE_REDACTED]");
        }

        return message;
    }
}

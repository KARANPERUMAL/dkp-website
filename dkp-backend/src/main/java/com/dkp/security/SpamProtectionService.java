package com.dkp.security;

import com.dkp.common.SpamDetectedException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class SpamProtectionService {

    public void validateHoneypot(String honeypotValue) {
        if (StringUtils.hasText(honeypotValue)) {
            throw new SpamDetectedException("Automated bot submission detected via honeypot field.");
        }
    }
}

package com.dkp.contact.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ContactRequest {

    @NotBlank(message = "Please enter your full name.")
    @Size(min = 2, max = 150, message = "Full name must be between 2 and 150 characters.")
    private String fullName;

    @NotBlank(message = "Please provide your email address.")
    @Email(message = "Please enter a valid email address.")
    @Size(max = 150, message = "Email address must not exceed 150 characters.")
    private String email;

    @Pattern(regexp = "^$|^[0-9+()\\-\\s]{7,25}$", message = "Please enter a valid telephone number.")
    private String phone;

    @Size(max = 150, message = "Service name must not exceed 150 characters.")
    private String service;

    @NotBlank(message = "Please share a brief description of your project requirements.")
    @Size(min = 10, max = 5000, message = "Message must be between 10 and 5000 characters.")
    private String message;

    // Honeypot field for bot detection (must remain empty)
    private String honeypot;

    public ContactRequest() {}

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getHoneypot() {
        return honeypot;
    }

    public void setHoneypot(String honeypot) {
        this.honeypot = honeypot;
    }
}

package com.dkp.careers.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class CareerApplicationRequest {

    @NotBlank(message = "Full Name is required.")
    @Size(min = 2, max = 150, message = "Full Name must be between 2 and 150 characters.")
    private String fullName;

    @NotBlank(message = "Email address is required.")
    @Email(message = "Please provide a valid email address.")
    @Size(max = 150, message = "Email address must not exceed 150 characters.")
    private String email;

    @NotBlank(message = "Phone number is required.")
    @Pattern(regexp = "^[0-9+()\\-\\s]{7,25}$", message = "Please provide a valid telephone number with country code.")
    private String phone;

    @NotBlank(message = "Position is required.")
    @Size(max = 100, message = "Position must not exceed 100 characters.")
    private String position;

    @NotBlank(message = "Department of interest is required.")
    @Size(max = 100, message = "Department must not exceed 100 characters.")
    private String department;

    @NotBlank(message = "Experience level is required.")
    @Size(max = 50, message = "Experience level must not exceed 50 characters.")
    private String experienceLevel;

    @NotBlank(message = "Preferred work arrangement is required.")
    @Size(max = 50, message = "Work arrangement must not exceed 50 characters.")
    private String workArrangement;

    @NotBlank(message = "Key skills are required.")
    @Size(min = 2, max = 2000, message = "Key skills must be between 2 and 2000 characters.")
    private String keySkills;

    @NotBlank(message = "Cover letter or introduction is required.")
    @Size(min = 20, max = 5000, message = "Cover letter must be between 20 and 5000 characters.")
    private String coverLetter;

    @Size(max = 255, message = "LinkedIn URL must not exceed 255 characters.")
    private String linkedInUrl;

    @Size(max = 255, message = "Portfolio URL must not exceed 255 characters.")
    private String portfolioUrl;

    @AssertTrue(message = "You must consent to recruitment processing to submit your application.")
    private boolean privacyConsent;

    // Honeypot field for bot detection (must remain empty)
    private String honeypot;

    public CareerApplicationRequest() {}

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

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getExperienceLevel() {
        return experienceLevel;
    }

    public void setExperienceLevel(String experienceLevel) {
        this.experienceLevel = experienceLevel;
    }

    public String getWorkArrangement() {
        return workArrangement;
    }

    public void setWorkArrangement(String workArrangement) {
        this.workArrangement = workArrangement;
    }

    public String getKeySkills() {
        return keySkills;
    }

    public void setKeySkills(String keySkills) {
        this.keySkills = keySkills;
    }

    public String getCoverLetter() {
        return coverLetter;
    }

    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }

    public String getLinkedInUrl() {
        return linkedInUrl;
    }

    public void setLinkedInUrl(String linkedInUrl) {
        this.linkedInUrl = linkedInUrl;
    }

    public String getPortfolioUrl() {
        return portfolioUrl;
    }

    public void setPortfolioUrl(String portfolioUrl) {
        this.portfolioUrl = portfolioUrl;
    }

    public boolean isPrivacyConsent() {
        return privacyConsent;
    }

    public void setPrivacyConsent(boolean privacyConsent) {
        this.privacyConsent = privacyConsent;
    }

    public String getHoneypot() {
        return honeypot;
    }

    public void setHoneypot(String honeypot) {
        this.honeypot = honeypot;
    }
}

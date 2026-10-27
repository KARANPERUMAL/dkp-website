package com.dkp.careers;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "job_applications", indexes = {
        @Index(name = "idx_job_app_email", columnList = "email"),
        @Index(name = "idx_job_app_status", columnList = "status"),
        @Index(name = "idx_job_app_created", columnList = "created_at")
})
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reference_id", nullable = false, unique = true, length = 64)
    private String referenceId;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(name = "email", nullable = false, length = 150)
    private String email;

    @Column(name = "phone", nullable = false, length = 30)
    private String phone;

    @Column(name = "position", nullable = false, length = 100)
    private String position;

    @Column(name = "department", nullable = false, length = 100)
    private String department;

    @Column(name = "experience_level", nullable = false, length = 50)
    private String experienceLevel;

    @Column(name = "work_arrangement", nullable = false, length = 50)
    private String workArrangement;

    @Column(name = "key_skills", nullable = false, columnDefinition = "TEXT")
    private String keySkills;

    @Column(name = "cover_letter", nullable = false, columnDefinition = "TEXT")
    private String coverLetter;

    @Column(name = "linkedin_url", length = 255)
    private String linkedInUrl;

    @Column(name = "portfolio_url", length = 255)
    private String portfolioUrl;

    @Column(name = "privacy_consent", nullable = false)
    private boolean privacyConsent;

    @Column(name = "privacy_consent_at", nullable = false)
    private Instant privacyConsentAt;

    @Column(name = "resume_storage_key", nullable = false, length = 255)
    private String resumeStorageKey;

    @Column(name = "resume_original_filename", nullable = false, length = 255)
    private String resumeOriginalFilename;

    @Column(name = "resume_content_type", nullable = false, length = 100)
    private String resumeContentType;

    @Column(name = "resume_file_size_bytes", nullable = false)
    private long resumeFileSizeBytes;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "SUBMITTED";

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public JobApplication() {}

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public String getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(String referenceId) {
        this.referenceId = referenceId;
    }

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

    public Instant getPrivacyConsentAt() {
        return privacyConsentAt;
    }

    public void setPrivacyConsentAt(Instant privacyConsentAt) {
        this.privacyConsentAt = privacyConsentAt;
    }

    public String getResumeStorageKey() {
        return resumeStorageKey;
    }

    public void setResumeStorageKey(String resumeStorageKey) {
        this.resumeStorageKey = resumeStorageKey;
    }

    public String getResumeOriginalFilename() {
        return resumeOriginalFilename;
    }

    public void setResumeOriginalFilename(String resumeOriginalFilename) {
        this.resumeOriginalFilename = resumeOriginalFilename;
    }

    public String getResumeContentType() {
        return resumeContentType;
    }

    public void setResumeContentType(String resumeContentType) {
        this.resumeContentType = resumeContentType;
    }

    public long getResumeFileSizeBytes() {
        return resumeFileSizeBytes;
    }

    public void setResumeFileSizeBytes(long resumeFileSizeBytes) {
        this.resumeFileSizeBytes = resumeFileSizeBytes;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}

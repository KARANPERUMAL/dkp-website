-- ==============================================================================
-- DKP Innovations Database Schema
-- Initial Migration: V1__init_schema.sql
-- Neon PostgreSQL Compatible
-- ==============================================================================

-- 1. Job Applications Table
CREATE TABLE IF NOT EXISTS job_applications (
    id BIGSERIAL PRIMARY KEY,
    reference_id VARCHAR(64) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    position VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    experience_level VARCHAR(50) NOT NULL,
    work_arrangement VARCHAR(50) NOT NULL,
    key_skills TEXT NOT NULL,
    cover_letter TEXT NOT NULL,
    linkedin_url VARCHAR(255),
    portfolio_url VARCHAR(255),
    privacy_consent BOOLEAN NOT NULL DEFAULT FALSE,
    privacy_consent_at TIMESTAMP WITH TIME ZONE NOT NULL,
    resume_storage_key VARCHAR(255) NOT NULL,
    resume_original_filename VARCHAR(255) NOT NULL,
    resume_content_type VARCHAR(100) NOT NULL,
    resume_file_size_bytes BIGINT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_job_applications_ref UNIQUE (reference_id)
);

CREATE INDEX IF NOT EXISTS idx_job_app_email ON job_applications (email);
CREATE INDEX IF NOT EXISTS idx_job_app_status ON job_applications (status);
CREATE INDEX IF NOT EXISTS idx_job_app_created ON job_applications (created_at DESC);

-- 2. Service Enquiries Table
CREATE TABLE IF NOT EXISTS service_enquiries (
    id BIGSERIAL PRIMARY KEY,
    reference_id VARCHAR(64) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    company_name VARCHAR(150),
    service VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    privacy_consent BOOLEAN NOT NULL DEFAULT TRUE,
    privacy_consent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_service_enquiries_ref UNIQUE (reference_id)
);

CREATE INDEX IF NOT EXISTS idx_service_enq_email ON service_enquiries (email);
CREATE INDEX IF NOT EXISTS idx_service_enq_status ON service_enquiries (status);
CREATE INDEX IF NOT EXISTS idx_service_enq_created ON service_enquiries (created_at DESC);

-- 3. Contact Submissions Table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id BIGSERIAL PRIMARY KEY,
    reference_id VARCHAR(64) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    service VARCHAR(150),
    message TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_contact_submissions_ref UNIQUE (reference_id)
);

CREATE INDEX IF NOT EXISTS idx_contact_sub_email ON contact_submissions (email);
CREATE INDEX IF NOT EXISTS idx_contact_sub_status ON contact_submissions (status);
CREATE INDEX IF NOT EXISTS idx_contact_sub_created ON contact_submissions (created_at DESC);

-- 4. Transactional Email Outbox Table
CREATE TABLE IF NOT EXISTS email_outbox (
    id BIGSERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    reference_id VARCHAR(64) NOT NULL,
    recipient_email VARCHAR(150) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body_html TEXT NOT NULL,
    body_text TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    attempt_count INT NOT NULL DEFAULT 0,
    max_attempts INT NOT NULL DEFAULT 5,
    last_attempt_at TIMESTAMP WITH TIME ZONE,
    next_attempt_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    provider_message_id VARCHAR(100),
    last_error TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_email_outbox_queue ON email_outbox (status, next_attempt_at);
CREATE INDEX IF NOT EXISTS idx_email_outbox_ref ON email_outbox (reference_id);

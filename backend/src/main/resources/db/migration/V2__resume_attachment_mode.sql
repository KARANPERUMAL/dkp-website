-- ==============================================================================
-- DKP Innovations Database Schema
-- Migration: V2__resume_attachment_mode.sql
-- Resumes are delivered via Resend email attachments directly without object storage.
-- Make resume_storage_key nullable and default to 'EMAIL_ATTACHMENT'.
-- ==============================================================================

ALTER TABLE job_applications ALTER COLUMN resume_storage_key DROP NOT NULL;
ALTER TABLE job_applications ALTER COLUMN resume_storage_key SET DEFAULT 'EMAIL_ATTACHMENT';

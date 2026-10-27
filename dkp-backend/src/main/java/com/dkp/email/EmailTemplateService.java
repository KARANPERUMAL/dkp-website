package com.dkp.email;

import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

@Service
public class EmailTemplateService {

    public String escape(String input) {
        if (input == null) return "";
        return HtmlUtils.htmlEscape(input);
    }

    // =========================================================================
    // 1. Career Form Email Templates
    // =========================================================================

    public String buildCareerAdminHtml(String refId, String fullName, String email, String phone,
                                       String position, String department, String expLevel,
                                       String arrangement, String skills, String coverLetter,
                                       String filename, String storageKey) {
        return """
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"/></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; padding: 24px;">
          <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
            <div style="background: #0f172a; padding: 24px; color: #ffffff; border-bottom: 3px solid #ea580c;">
              <h2 style="margin: 0 0 4px 0; font-size: 20px; font-weight: 700; color: #ffffff;">DKP Innovations — New Career Application</h2>
              <p style="margin: 0; font-size: 13px; color: #fb923c;">Reference ID: %s</p>
            </div>
            <div style="padding: 24px;">
              <table style="width: 100%%; border-collapse: collapse; margin-bottom: 20px;">
                <tr><td style="padding: 8px 0; font-weight: 600; width: 140px; color: #64748b; font-size: 13px;">Applicant Name:</td><td style="padding: 8px 0; font-weight: 700; color: #0f172a;">%s</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600; color: #64748b; font-size: 13px;">Email Address:</td><td style="padding: 8px 0;"><a href="mailto:%s" style="color: #ea580c; text-decoration: none;">%s</a></td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600; color: #64748b; font-size: 13px;">Phone Number:</td><td style="padding: 8px 0; color: #0f172a;">%s</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600; color: #64748b; font-size: 13px;">Position Applied:</td><td style="padding: 8px 0; font-weight: 700; color: #0f172a;">%s</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600; color: #64748b; font-size: 13px;">Department:</td><td style="padding: 8px 0; color: #0f172a;">%s</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600; color: #64748b; font-size: 13px;">Experience Level:</td><td style="padding: 8px 0; color: #0f172a;">%s</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600; color: #64748b; font-size: 13px;">Work Arrangement:</td><td style="padding: 8px 0; color: #0f172a;">%s</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600; color: #64748b; font-size: 13px;">Resume Document:</td><td style="padding: 8px 0; font-weight: 600; color: #0f172a;">%s (Key: %s)</td></tr>
              </table>
              <div style="margin-top: 16px; padding: 16px; background: #f1f5f9; border-radius: 8px; border-left: 4px solid #ea580c;">
                <h4 style="margin: 0 0 6px 0; font-size: 13px; color: #334155; text-transform: uppercase;">Key Skills</h4>
                <p style="margin: 0; font-size: 14px; color: #0f172a;">%s</p>
              </div>
              <div style="margin-top: 16px; padding: 16px; background: #f1f5f9; border-radius: 8px; border-left: 4px solid #64748b;">
                <h4 style="margin: 0 0 6px 0; font-size: 13px; color: #334155; text-transform: uppercase;">Cover Letter / Introduction</h4>
                <p style="margin: 0; font-size: 14px; color: #0f172a; white-space: pre-wrap;">%s</p>
              </div>
            </div>
            <div style="background: #f8fafc; padding: 16px 24px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center;">
              DKP Innovations Automated Recruiting Pipeline
            </div>
          </div>
        </body>
        </html>
        """.formatted(
                escape(refId), escape(fullName), escape(email), escape(email),
                escape(phone), escape(position), escape(department), escape(expLevel),
                escape(arrangement), escape(filename), escape(storageKey),
                escape(skills), escape(coverLetter)
        );
    }

    public String buildCareerAdminText(String refId, String fullName, String email, String phone,
                                       String position, String department, String expLevel,
                                       String arrangement, String skills, String coverLetter,
                                       String filename, String storageKey) {
        return """
        DKP Innovations — New Career Application
        Reference ID: %s
        
        Applicant: %s
        Email: %s
        Phone: %s
        Position: %s
        Department: %s
        Experience: %s
        Work Arrangement: %s
        Resume File: %s (Key: %s)
        
        Key Skills:
        %s
        
        Cover Letter:
        %s
        """.formatted(refId, fullName, email, phone, position, department, expLevel, arrangement, filename, storageKey, skills, coverLetter);
    }

    public String buildCareerCandidateHtml(String refId, String fullName, String position) {
        return """
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"/></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; padding: 24px;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
            <div style="background: #0f172a; padding: 28px; text-align: center; border-bottom: 3px solid #ea580c;">
              <h2 style="margin: 0 0 6px 0; font-size: 22px; font-weight: 800; color: #ffffff;">DKP Innovations</h2>
              <p style="margin: 0; font-size: 14px; color: #ea580c; font-weight: 600;">Application Received</p>
            </div>
            <div style="padding: 28px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155;">Hello <strong>%s</strong>,</p>
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #475569;">
                Thank you for applying for the position of <strong>%s</strong> at DKP Innovations. We have received your application materials and resume securely.
              </p>
              <div style="margin: 20px 0; padding: 14px 18px; background: #fff7ed; border-radius: 8px; border: 1px solid #fed7aa; text-align: center;">
                <span style="font-size: 12px; color: #9a3412; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 4px;">Application Reference ID</span>
                <span style="font-size: 18px; font-weight: 800; color: #ea580c; font-family: monospace;">%s</span>
              </div>
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #475569;">
                Our talent acquisition team will review your qualifications against our active requirements. If your profile matches what we're looking for, we will reach out to discuss next steps.
              </p>
              <p style="margin: 0; font-size: 14px; color: #334155; font-weight: 600;">
                Warm regards,<br/>The Talent Acquisition Team<br/>DKP Innovations
              </p>
            </div>
            <div style="background: #f8fafc; padding: 16px 24px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
              This is an automated notification. Please keep your reference ID for any future correspondence.
            </div>
          </div>
        </body>
        </html>
        """.formatted(escape(fullName), escape(position), escape(refId));
    }

    public String buildCareerCandidateText(String refId, String fullName, String position) {
        return """
        Hello %s,
        
        Thank you for applying for the position of %s at DKP Innovations. We have received your application and resume.
        
        Your Application Reference ID: %s
        
        Our talent acquisition team will review your qualifications against our current requirements and connect with you if there is a strong match.
        
        Warm regards,
        Talent Acquisition Team
        DKP Innovations
        """.formatted(fullName, position, refId);
    }

    // =========================================================================
    // 2. Contact & Service Enquiry Form Email Templates (Unified Form Workflow)
    // =========================================================================

    public String buildContactAdminHtml(String refId, String fullName, String email, String phone,
                                        String service, String message) {
        String serviceDisplay = (service != null && !service.isBlank()) ? service : "General Inquiry";
        String phoneDisplay = (phone != null && !phone.isBlank()) ? phone : "Not provided";

        return """
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"/></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; padding: 24px;">
          <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
            <div style="background: #0f172a; padding: 24px; color: #ffffff; border-bottom: 3px solid #ea580c;">
              <h2 style="margin: 0 0 4px 0; font-size: 20px; font-weight: 700; color: #ffffff;">DKP Innovations — New Contact / Services Submission</h2>
              <p style="margin: 0; font-size: 13px; color: #fb923c;">Reference ID: %s</p>
            </div>
            <div style="padding: 24px;">
              <table style="width: 100%%; border-collapse: collapse; margin-bottom: 20px;">
                <tr><td style="padding: 8px 0; font-weight: 600; width: 140px; color: #64748b; font-size: 13px;">Contact Name:</td><td style="padding: 8px 0; font-weight: 700; color: #0f172a;">%s</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600; color: #64748b; font-size: 13px;">Email Address:</td><td style="padding: 8px 0;"><a href="mailto:%s" style="color: #ea580c; text-decoration: none;">%s</a></td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600; color: #64748b; font-size: 13px;">Phone:</td><td style="padding: 8px 0; color: #0f172a;">%s</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600; color: #64748b; font-size: 13px;">Service / Area:</td><td style="padding: 8px 0; font-weight: 700; color: #ea580c;">%s</td></tr>
              </table>
              <div style="margin-top: 16px; padding: 16px; background: #f1f5f9; border-radius: 8px; border-left: 4px solid #ea580c;">
                <h4 style="margin: 0 0 6px 0; font-size: 13px; color: #334155; text-transform: uppercase;">Message / Project Scope</h4>
                <p style="margin: 0; font-size: 14px; color: #0f172a; white-space: pre-wrap;">%s</p>
              </div>
            </div>
            <div style="background: #f8fafc; padding: 16px 24px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center;">
              DKP Innovations Automated Notifications
            </div>
          </div>
        </body>
        </html>
        """.formatted(
                escape(refId),
                escape(fullName),
                escape(email),
                escape(email),
                escape(phoneDisplay),
                escape(serviceDisplay),
                escape(message)
        );
    }

    public String buildContactAdminText(String refId, String fullName, String email, String phone,
                                        String service, String message) {
        String serviceDisplay = (service != null && !service.isBlank()) ? service : "General Inquiry";
        String phoneDisplay = (phone != null && !phone.isBlank()) ? phone : "Not provided";

        return """
        DKP Innovations — New Contact / Services Submission
        Reference ID: %s
        
        Contact: %s
        Email: %s
        Phone: %s
        Service / Area: %s
        
        Message / Project Scope:
        %s
        """.formatted(refId, fullName, email, phoneDisplay, serviceDisplay, message);
    }

    public String buildContactClientHtml(String refId, String fullName, String service) {
        String serviceMention = (service != null && !service.isBlank() && !service.equalsIgnoreCase("General Inquiry"))
                ? " regarding <strong>" + escape(service) + "</strong>"
                : "";

        return """
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"/></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; padding: 24px;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
            <div style="background: #0f172a; padding: 28px; text-align: center; border-bottom: 3px solid #ea580c;">
              <h2 style="margin: 0 0 6px 0; font-size: 22px; font-weight: 800; color: #ffffff;">DKP Innovations</h2>
              <p style="margin: 0; font-size: 14px; color: #ea580c; font-weight: 600;">Message Received</p>
            </div>
            <div style="padding: 28px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155;">Hello <strong>%s</strong>,</p>
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #475569;">
                Thank you for reaching out to DKP Innovations%s. We have received your message and details.
              </p>
              <div style="margin: 20px 0; padding: 14px 18px; background: #fff7ed; border-radius: 8px; border: 1px solid #fed7aa; text-align: center;">
                <span style="font-size: 12px; color: #9a3412; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 4px;">Inquiry Reference ID</span>
                <span style="font-size: 18px; font-weight: 800; color: #ea580c; font-family: monospace;">%s</span>
              </div>
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #475569;">
                Our team is reviewing your inquiry and will connect with you shortly. If you have any additional details to share, please reply with your reference ID.
              </p>
              <p style="margin: 0; font-size: 14px; color: #334155; font-weight: 600;">
                Warm regards,<br/>The Team at DKP Innovations
              </p>
            </div>
            <div style="background: #f8fafc; padding: 16px 24px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
              This is an automated confirmation of receipt. Please keep your reference ID for your records.
            </div>
          </div>
        </body>
        </html>
        """.formatted(escape(fullName), serviceMention, escape(refId));
    }

    public String buildContactClientText(String refId, String fullName, String service) {
        String serviceMention = (service != null && !service.isBlank() && !service.equalsIgnoreCase("General Inquiry"))
                ? " regarding " + service
                : "";

        return """
        Hello %s,
        
        Thank you for reaching out to DKP Innovations%s. We have received your message.
        
        Inquiry Reference ID: %s
        
        Our team is reviewing your inquiry and will connect with you shortly.
        
        Warm regards,
        The Team at DKP Innovations
        """.formatted(fullName, serviceMention, refId);
    }
}

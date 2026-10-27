import { getApiBaseUrl, parseResponse } from './apiClient';

export interface JobApplicationPayload {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  experienceLevel: string;
  workArrangement: string;
  keySkills: string;
  coverLetter: string;
  linkedInUrl?: string;
  portfolioUrl?: string;
  privacyConsent: boolean;
  resumeFile: File;
  honeypot?: string;
}

export interface CareerSubmissionResult {
  success: boolean;
  message?: string;
  applicationId?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
  isNetworkError?: boolean;
}

/**
 * Career application submission service.
 * Connects to the Spring Boot backend API endpoint (POST /api/careers/applications).
 */
export async function submitCareerApplication(
  payload: JobApplicationPayload
): Promise<CareerSubmissionResult> {
  const baseUrl = getApiBaseUrl();
  const endpoint = import.meta.env.VITE_CAREERS_API_URL || `${baseUrl}/api/careers/applications`;

  const formData = new FormData();
  formData.append('fullName', payload.fullName.trim());
  formData.append('email', payload.email.trim());
  formData.append('phone', payload.phone.trim());
  formData.append('position', payload.position.trim());
  formData.append('department', payload.department.trim());
  formData.append('experienceLevel', payload.experienceLevel.trim());
  formData.append('workArrangement', payload.workArrangement.trim());
  formData.append('keySkills', payload.keySkills.trim());
  formData.append('coverLetter', payload.coverLetter.trim());
  if (payload.linkedInUrl?.trim()) {
    formData.append('linkedInUrl', payload.linkedInUrl.trim());
  }
  if (payload.portfolioUrl?.trim()) {
    formData.append('portfolioUrl', payload.portfolioUrl.trim());
  }
  formData.append('privacyConsent', String(payload.privacyConsent));
  formData.append('resume', payload.resumeFile, payload.resumeFile.name);
  if (payload.honeypot) {
    formData.append('honeypot', payload.honeypot);
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        // Note: Do NOT set Content-Type header manually for FormData so the browser generates the multipart boundary
      },
      body: formData,
    });

    const parsed = await parseResponse(response);

    if (parsed.success) {
      return {
        success: true,
        applicationId: parsed.data.referenceId,
        message: parsed.data.message,
      };
    } else {
      return {
        success: false,
        error: parsed.error.message,
        fieldErrors: parsed.error.fieldErrors,
      };
    }
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error ? err.message : 'Unknown network failure';
    return {
      success: false,
      isNetworkError: true,
      error: `Unable to connect to the careers application server (${endpoint}). The backend service is currently offline or unconfigured. Please try again later or email your resume directly to careers@dkpinnovation.com. (${errorMsg})`,
    };
  }
}

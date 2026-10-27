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
}

export interface CareerSubmissionResult {
  success: boolean;
  message?: string;
  applicationId?: string;
  error?: string;
  isNetworkError?: boolean;
}

/**
 * Career application submission service.
 * Connects to the configured backend API endpoint.
 *
 * Backend Requirements:
 * - Method: POST
 * - Content-Type: multipart/form-data
 * - Expected Endpoint: /api/careers/apply (or VITE_CAREERS_API_URL)
 * - Payload:
 *   - fullName, email, phone, position, department, experienceLevel,
 *     workArrangement, keySkills, coverLetter, linkedInUrl, portfolioUrl,
 *     privacyConsent, and resume (binary file).
 * - Expected Success Response: 200/201 JSON { success: true, applicationId: string, message: string }
 */
export async function submitCareerApplication(
  payload: JobApplicationPayload
): Promise<CareerSubmissionResult> {
  const endpoint = import.meta.env.VITE_CAREERS_API_URL || '/api/careers/apply';

  const formData = new FormData();
  formData.append('fullName', payload.fullName.trim());
  formData.append('email', payload.email.trim());
  formData.append('phone', payload.phone.trim());
  formData.append('position', payload.position);
  formData.append('department', payload.department);
  formData.append('experienceLevel', payload.experienceLevel);
  formData.append('workArrangement', payload.workArrangement);
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

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = `Server error (${response.status})`;
      try {
        const errorData = await response.json();
        if (errorData.message) errorMessage = errorData.message;
        else if (errorData.error) errorMessage = errorData.error;
      } catch {
        // Response is non-JSON
      }
      return {
        success: false,
        error: errorMessage,
      };
    }

    const data = await response.json().catch(() => ({}));
    return {
      success: true,
      applicationId: data.applicationId || data.id || `APP-${Date.now()}`,
      message: data.message || 'Your application has been successfully submitted.',
    };
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

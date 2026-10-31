import { getApiBaseUrl, parseResponse } from './apiClient';

export interface ContactSubmissionPayload {
  fullName: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  honeypot?: string;
}

export interface ContactSubmissionResult {
  success: boolean;
  referenceId?: string;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
  isNetworkError?: boolean;
}

/**
 * Submit contact message or consultation enquiry to backend POST /api/contact
 */
export async function submitContactMessage(
  payload: ContactSubmissionPayload
): Promise<ContactSubmissionResult> {
  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/api/contact`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        fullName: payload.fullName.trim(),
        email: payload.email.trim(),
        phone: payload.phone?.trim() || undefined,
        service: payload.service?.trim() || undefined,
        message: payload.message.trim(),
        honeypot: payload.honeypot || undefined,
      }),
    });

    const parsed = await parseResponse(response);

    if (parsed.success) {
      return {
        success: true,
        referenceId: parsed.data.referenceId,
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
    const errorMsg = err instanceof Error ? err.message : 'Network error';
    return {
      success: false,
      isNetworkError: true,
      error: `Unable to connect to the server at ${endpoint}. The backend service is currently unreachable. Please check your internet connection or email us directly at dkpinnovations20251@gmail.com. (${errorMsg})`,
    };
  }
}

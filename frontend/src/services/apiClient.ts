/**
 * Centralized API Client for DKP Innovations Frontend.
 * Automatically resolves the backend API Base URL based on environment configuration.
 *
 * In local development: defaults to '' (allowing Vite dev proxy to /api/*) or http://localhost:8080.
 * In production on Render: configure VITE_API_BASE_URL=https://<your-render-backend>.onrender.com
 */

export const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, '');
  }
  return '';
};

export interface ApiSuccessResponse {
  success: boolean;
  referenceId: string;
  message: string;
  timestamp?: string;
}

export interface ApiErrorResponse {
  success: false;
  status?: number;
  error?: string;
  message: string;
  correlationId?: string;
  fieldErrors?: Record<string, string>;
  isNetworkError?: boolean;
}

export type ApiResponse<T = ApiSuccessResponse> =
  | { success: true; data: T }
  | { success: false; error: ApiErrorResponse };

export async function parseResponse<T = ApiSuccessResponse>(response: Response): Promise<ApiResponse<T>> {
  let json: any = null;
  try {
    json = await response.json();
  } catch {
    // Non-JSON response
  }

  if (response.ok) {
    return {
      success: true,
      data: json as T,
    };
  }

  const status = response.status;
  const message = json?.message || `Server returned error (${status})`;
  const fieldErrors = json?.fieldErrors || undefined;
  const correlationId = json?.correlationId || undefined;

  return {
    success: false,
    error: {
      success: false,
      status,
      error: json?.error || response.statusText,
      message,
      correlationId,
      fieldErrors,
    },
  };
}

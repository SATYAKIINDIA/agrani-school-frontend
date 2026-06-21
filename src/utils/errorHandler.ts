import { AxiosError } from 'axios';
import { toast } from 'sonner';

export type ApiError = {
  message: string;
  code?: string;
  status?: number;
  details?: any;
};

export function isAxiosError(error: any): error is AxiosError {
  return error?.isAxiosError === true;
}

export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    // Server responded with error
    if (error.response) {
      const data = error.response.data as any;
      
      // Check for custom error message from backend
      if (data?.message) {
        return data.message;
      }
      
      // Check for validation errors
      if (data?.errors) {
        if (Array.isArray(data.errors)) {
          return data.errors.join(', ');
        }
        return JSON.stringify(data.errors);
      }
      
      // Default status-based messages
      const status = error.response.status;
      switch (status) {
        case 400:
          return 'Invalid request. Please check your input.';
        case 401:
          return 'Authentication required. Please log in.';
        case 403:
          return 'You do not have permission to perform this action.';
        case 404:
          return 'The requested resource was not found.';
        case 409:
          return 'This resource already exists or conflicts with existing data.';
        case 422:
          return 'Validation failed. Please check your input.';
        case 429:
          return 'Too many requests. Please try again later.';
        case 500:
          return 'Server error. Please try again later.';
        case 503:
          return 'Service unavailable. Please try again later.';
        default:
          return `Request failed with status ${status}`;
      }
    }
    
    // Request made but no response (network error)
    if (error.request) {
      return 'Network error. Please check your connection.';
    }
    
    // Error in request configuration
    return 'Request configuration error.';
  }
  
  // Non-Axios errors
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred.';
}

export function handleApiError(error: unknown, context?: string): ApiError {
  const message = getErrorMessage(error);
  const status = isAxiosError(error) ? error.response?.status : undefined;
  
  // Show toast notification
  toast.error(context ? `${context}: ${message}` : message);
  
  // Log error for debugging
  console.error('API Error:', {
    message,
    status,
    error,
    context,
  });
  
  return {
    message,
    status,
    code: isAxiosError(error) ? error.code : undefined,
    details: isAxiosError(error) ? error.response?.data : undefined,
  };
}

export function handleMutationError(error: unknown, errorMessage?: string) {
  const message = errorMessage || getErrorMessage(error);
  toast.error(message);
  console.error('Mutation Error:', error);
  throw error;
}

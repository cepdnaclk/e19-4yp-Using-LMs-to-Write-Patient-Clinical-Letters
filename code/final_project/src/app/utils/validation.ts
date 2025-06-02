// Utility functions for form validation

/**
 * Validates if a string is empty
 * @param value - The string to check
 * @returns boolean - True if the string is not empty
 */
export const isNotEmpty = (value: string): boolean => {
  return value !== undefined && value !== null && value.trim() !== '';
};

/**
 * Validates if a string is a valid email format
 * @param email - The email string to validate
 * @returns boolean - True if the email format is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates if a string is a valid date format (YYYY-MM-DD)
 * @param dateString - The date string to validate
 * @returns boolean - True if the date format is valid
 */
export const isValidDate = (dateString: string): boolean => {
  if (!dateString) return false;
  
  // Check format
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  // Check if it's a valid date
  const date = new Date(dateString);
  const timestamp = date.getTime();
  if (isNaN(timestamp)) return false;
  
  return date.toISOString().slice(0, 10) === dateString;
};

/**
 * Validates if a patient ID is in the correct format (P-XXXX)
 * @param patientId - The patient ID to validate
 * @returns boolean - True if the patient ID format is valid
 */
export const isValidPatientId = (patientId: string): boolean => {
  const patientIdRegex = /^P-\d{4}$/;
  return patientIdRegex.test(patientId);
};

/**
 * Formats a date string to a more readable format
 * @param dateString - The date string in YYYY-MM-DD format
 * @returns string - Formatted date string (e.g., "June 2, 2025")
 */
export const formatDate = (dateString: string): string => {
  if (!isValidDate(dateString)) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Generates a PDF filename based on patient information and letter type
 * @param patientName - The patient's name
 * @param patientId - The patient's ID
 * @param letterType - The type of letter
 * @returns string - A formatted filename
 */
export const generatePdfFilename = (
  patientName: string,
  patientId: string,
  letterType: string
): string => {
  const sanitizedName = patientName.replace(/\s+/g, '_');
  const date = new Date().toISOString().slice(0, 10);
  return `${sanitizedName}_${patientId}_${letterType}_${date}.pdf`;
};

/**
 * Handles API errors and returns a user-friendly error message
 * @param error - The error object from the API call
 * @returns string - A user-friendly error message
 */
export const handleApiError = (error: any): string => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    if (error.response.status === 401) {
      return 'Authentication failed. Please log in again.';
    } else if (error.response.status === 403) {
      return 'You do not have permission to perform this action.';
    } else if (error.response.status === 404) {
      return 'The requested resource was not found.';
    } else if (error.response.status >= 500) {
      return 'Server error. Please try again later.';
    }
    return error.response.data.message || 'An error occurred. Please try again.';
  } else if (error.request) {
    // The request was made but no response was received
    return 'No response from server. Please check your internet connection.';
  } else {
    // Something happened in setting up the request that triggered an Error
    return 'An error occurred. Please try again.';
  }
};

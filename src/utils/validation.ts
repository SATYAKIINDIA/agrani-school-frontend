/**
 * Validation Utilities
 * 
 * Provides real-time validation helpers for form fields.
 * Supports validation on blur and change events.
 */

export interface ValidationRule {
  validate: (value: string, allValues?: Record<string, string>) => boolean;
  message: string;
}

export interface ValidationRules {
  [field: string]: ValidationRule[];
}

export interface ValidationErrors {
  [field: string]: string;
}

/**
 * Validate a single field against rules
 * @param value - Field value
 * @param rules - Validation rules
 * @returns Error message or empty string if valid
 */
export function validateField(value: string, rules: ValidationRule[]): string {
  for (const rule of rules) {
    if (!rule.validate(value)) {
      return rule.message;
    }
  }
  return '';
}

/**
 * Validate all fields in a form
 * @param values - Form values
 * @param rules - Validation rules for each field
 * @returns Validation errors object
 */
export function validateForm(values: Record<string, string>, rules: ValidationRules): ValidationErrors {
  const errors: ValidationErrors = {};
  
  for (const [field, fieldRules] of Object.entries(rules)) {
    const error = validateField(values[field] || '', fieldRules);
    if (error) {
      errors[field] = error;
    }
  }
  
  return errors;
}

/**
 * Common validation rules
 */
export const validationRules = {
  required: (message = 'This field is required'): ValidationRule => ({
    validate: (value) => value.trim().length > 0,
    message,
  }),
  
  email: (message = 'Please enter a valid email address'): ValidationRule => ({
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message,
  }),
  
  minLength: (min: number, message?: string): ValidationRule => ({
    validate: (value) => value.length >= min,
    message: message || `Must be at least ${min} characters`,
  }),
  
  maxLength: (max: number, message?: string): ValidationRule => ({
    validate: (value) => value.length <= max,
    message: message || `Must be no more than ${max} characters`,
  }),
  
  pattern: (regex: RegExp, message = 'Invalid format'): ValidationRule => ({
    validate: (value) => regex.test(value),
    message,
  }),
  
  match: (fieldToMatch: string, message = 'Passwords do not match'): ValidationRule => ({
    validate: (value, allValues) => allValues ? value === allValues[fieldToMatch] : false,
    message,
  }),
};

/**
 * Hook-like validation state management
 * Can be used in class components or with useState
 */
export class ValidationManager {
  private errors: ValidationErrors = {};
  private touched: Set<string> = new Set();
  
  constructor(private rules: ValidationRules) {}
  
  /**
   * Validate a single field on blur
   */
  validateOnBlur(field: string, value: string): string {
    this.touched.add(field);
    const error = validateField(value, this.rules[field] || []);
    if (error) {
      this.errors[field] = error;
    } else {
      delete this.errors[field];
    }
    return error;
  }
  
  /**
   * Validate a single field on change (only if already touched)
   */
  validateOnChange(field: string, value: string): string {
    if (!this.touched.has(field)) {
      return '';
    }
    return this.validateOnBlur(field, value);
  }
  
  /**
   * Validate all fields
   */
  validateAll(values: Record<string, string>): ValidationErrors {
    this.errors = validateForm(values, this.rules);
    Object.keys(this.rules).forEach(field => this.touched.add(field));
    return this.errors;
  }
  
  /**
   * Get error for a field
   */
  getError(field: string): string {
    return this.errors[field] || '';
  }
  
  /**
   * Check if field has been touched
   */
  isTouched(field: string): boolean {
    return this.touched.has(field);
  }
  
  /**
   * Check if form has any errors
   */
  hasErrors(): boolean {
    return Object.keys(this.errors).length > 0;
  }
  
  /**
   * Reset validation state
   */
  reset(): void {
    this.errors = {};
    this.touched.clear();
  }
}

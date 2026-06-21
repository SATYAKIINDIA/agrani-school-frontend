/**
 * FormField Component
 * 
 * A wrapper component for form fields with label, error, and helper text.
 * Wraps any form input component to provide consistent styling.
 * 
 * @example
 * ```tsx
 * <FormField label="Email" error={errors.email} required>
 *   <Input type="email" name="email" />
 * </FormField>
 * ```
 */
interface FormFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function FormField({
  label,
  error,
  helperText,
  required = false,
  children,
  className = '',
}: FormFieldProps) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

/**
 * Password Strength Validator
 * 
 * Validates password strength and provides visual feedback.
 * Based on common security best practices.
 */

export interface PasswordStrengthResult {
  score: number; // 0-4
  label: string;
  color: string;
  feedback: string[];
}

/**
 * Calculate password strength
 * @param password - Password to validate
 * @returns Password strength result
 */
export function calculatePasswordStrength(password: string): PasswordStrengthResult {
  const feedback: string[] = [];
  let score = 0;

  if (!password) {
    return {
      score: 0,
      label: 'Very Weak',
      color: 'red',
      feedback: ['Password is required'],
    };
  }

  // Length check
  if (password.length < 8) {
    feedback.push('At least 8 characters');
  } else if (password.length >= 12) {
    score += 1;
  } else {
    score += 0.5;
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('At least one uppercase letter');
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('At least one lowercase letter');
  }

  // Number check
  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('At least one number');
  }

  // Special character check
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('At least one special character');
  }

  // Normalize score to 0-4
  const normalizedScore = Math.min(4, Math.floor(score));

  return {
    score: normalizedScore,
    label: getStrengthLabel(normalizedScore),
    color: getStrengthColor(normalizedScore),
    feedback: normalizedScore === 4 ? [] : feedback,
  };
}

/**
 * Get strength label based on score
 */
function getStrengthLabel(score: number): string {
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  return labels[score];
}

/**
 * Get strength color based on score
 */
function getStrengthColor(score: number): string {
  const colors = ['red', 'orange', 'yellow', 'blue', 'green'];
  return colors[score];
}

/**
 * Validate password meets minimum requirements
 * @param password - Password to validate
 * @returns true if password meets minimum requirements
 */
export function isValidPassword(password: string): boolean {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)
  );
}

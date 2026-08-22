export interface PasswordRuleResult {
  hasMinLength: boolean;
  hasLower: boolean;
  hasUpper: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  noRepeating: boolean;
  hasMixed: boolean;
  score: number;
  label: 'Weak' | 'Medium' | 'Strong' | 'Secure';
  color: string;
  feedback: string;
  isUnlocked: boolean;
}

export function evaluatePasswordStrength(password: string): PasswordRuleResult {
  const hasMinLength = password.length >= 8;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // Check no consecutive repeating characters (e.g., "aa", "11")
  const noRepeating = password.length > 0 && !/(.)\1/.test(password);

  // Mixed combination check
  const typesCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  const hasMixed = typesCount >= 3;

  // Calculate score (0 - 100%)
  let lengthScore = 0;
  if (password.length >= 12) {
    lengthScore = 30;
  } else if (password.length >= 8) {
    lengthScore = 15;
  }

  let diversityScore = 0;
  if (hasLower) diversityScore += 12.5;
  if (hasUpper) diversityScore += 12.5;
  if (hasNumber) diversityScore += 12.5;
  if (hasSpecial) diversityScore += 12.5;

  let patternScore = 0;
  if (noRepeating) patternScore += 10;
  if (hasMixed) patternScore += 10;

  const score = Math.min(100, Math.round(lengthScore + diversityScore + patternScore));

  const allBaselineMet = hasMinLength && hasLower && hasUpper && hasNumber && hasSpecial;
  const isUnlocked = allBaselineMet && score > 50;

  let label: PasswordRuleResult['label'] = 'Weak';
  let color = '#E5484D'; // Rose
  let feedback = 'Critical security issues. Your password must meet all baseline safety guidelines.';

  if (score > 80 && allBaselineMet) {
    label = 'Secure';
    color = '#006837'; // Align Green
    feedback = 'Excellent security alignment! Your password is exceptionally strong.';
  } else if (score > 50 && allBaselineMet) {
    label = 'Strong';
    color = '#34D399'; // Fresh Mint
    feedback = 'Safe password. Meets all security requirements.';
  } else if (score > 30) {
    label = 'Medium';
    color = '#F2994A'; // Amber
    feedback = 'Basic complexity met, but too short or predictable. Please improve complexity.';
  }

  return {
    hasMinLength,
    hasLower,
    hasUpper,
    hasNumber,
    hasSpecial,
    noRepeating,
    hasMixed,
    score,
    label,
    color,
    feedback,
    isUnlocked,
  };
}

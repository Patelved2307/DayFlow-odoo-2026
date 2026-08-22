import { useMemo } from 'react';
import { evaluatePasswordStrength, PasswordRuleResult } from '../utils/passwordRules';

export function usePasswordStrength(password: string): PasswordRuleResult {
  return useMemo(() => evaluatePasswordStrength(password), [password]);
}

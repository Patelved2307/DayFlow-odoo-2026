import React from 'react';
import { PasswordRuleResult } from '../../utils/passwordRules';
import { Check, X, ShieldAlert, ShieldCheck } from 'lucide-react';

interface PasswordStrengthMeterProps {
  result: PasswordRuleResult;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ result }) => {
  if (!result) return null;

  return (
    <div className="space-y-2 mt-2 select-none">
      {/* Visual Progress Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-300 rounded-full"
            style={{
              width: `${result.score}%`,
              backgroundColor: result.color,
            }}
          />
        </div>
        <span
          className="text-xs font-bold font-mono px-2 py-0.5 rounded text-white shrink-0"
          style={{ backgroundColor: result.color }}
        >
          {result.score}% {result.label}
        </span>
      </div>

      {/* Feedback Message */}
      <div className="flex items-start gap-1.5 text-[11px] text-gray-600 font-medium">
        {result.isUnlocked ? (
          <ShieldCheck className="w-3.5 h-3.5 text-[#006837] shrink-0 mt-0.5" />
        ) : (
          <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
        )}
        <span className={result.isUnlocked ? 'text-[#006837]' : 'text-gray-600'}>
          {result.feedback}
        </span>
      </div>

      {/* 5 Baseline Rules Checklist */}
      <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
        <div className={`flex items-center gap-1 font-semibold ${result.hasMinLength ? 'text-[#006837]' : 'text-gray-400'}`}>
          {result.hasMinLength ? <Check className="w-3 h-3 text-[#006837]" /> : <X className="w-3 h-3 text-gray-300" />}
          <span>≥ 8 Characters</span>
        </div>
        <div className={`flex items-center gap-1 font-semibold ${result.hasLower ? 'text-[#006837]' : 'text-gray-400'}`}>
          {result.hasLower ? <Check className="w-3 h-3 text-[#006837]" /> : <X className="w-3 h-3 text-gray-300" />}
          <span>Lowercase [a-z]</span>
        </div>
        <div className={`flex items-center gap-1 font-semibold ${result.hasUpper ? 'text-[#006837]' : 'text-gray-400'}`}>
          {result.hasUpper ? <Check className="w-3 h-3 text-[#006837]" /> : <X className="w-3 h-3 text-gray-300" />}
          <span>Uppercase [A-Z]</span>
        </div>
        <div className={`flex items-center gap-1 font-semibold ${result.hasNumber ? 'text-[#006837]' : 'text-gray-400'}`}>
          {result.hasNumber ? <Check className="w-3 h-3 text-[#006837]" /> : <X className="w-3 h-3 text-gray-300" />}
          <span>Number [0-9]</span>
        </div>
        <div className={`flex items-center gap-1 font-semibold ${result.hasSpecial ? 'text-[#006837]' : 'text-gray-400'}`}>
          {result.hasSpecial ? <Check className="w-3 h-3 text-[#006837]" /> : <X className="w-3 h-3 text-gray-300" />}
          <span>Special Symbol</span>
        </div>
      </div>
    </div>
  );
};

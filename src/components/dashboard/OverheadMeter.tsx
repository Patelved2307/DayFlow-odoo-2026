import React, { useState } from 'react';
import { Clock, TrendingUp, Sparkles, ChevronRight, Zap, CheckCircle2 } from 'lucide-react';

export const OverheadMeter: React.FC = () => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#144933] text-white p-6 shadow-2xs h-full flex flex-col justify-between transition-all duration-200">
      {/* Background glow */}
      <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-[#7EC9A0]/15 blur-2xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-white/70">Efficiency & Automation</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-[#7EC9A0]">
            <TrendingUp className="w-3 h-3 text-[#7EC9A0]" />
            +18% this month
          </span>
        </div>

        <div className="mt-4">
          <div className="text-xs font-semibold text-[#7EC9A0] uppercase tracking-wider">
            Overhead Reduction
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold tracking-tight text-white">48.5</span>
            <span className="text-sm font-semibold text-white/80">Hours Saved</span>
          </div>
          <p className="mt-2 text-xs text-white/70 leading-relaxed">
            Automated conflict resolution, instant emergency leave approvals, and one-click payroll math.
          </p>
        </div>
      </div>

      <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between">
        <button
          onClick={() => setShowBreakdown(true)}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#7EC9A0] hover:text-white transition-colors cursor-pointer"
        >
          <span>View breakdown</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <span className="font-mono text-[10px] text-white/50">Auto-calculated</span>
      </div>

      {/* Breakdown Modal */}
      {showBreakdown && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-[#1C1F1E] shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#1F6D4D]/10 flex items-center justify-center text-[#1F6D4D]">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-[#1C1F1E]">
                    Automated Overhead Breakdown
                  </h4>
                  <p className="text-xs text-[#6B7280]">August 2026 Workday Efficiency</p>
                </div>
              </div>
              <button
                onClick={() => setShowBreakdown(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-start justify-between rounded-xl bg-[#F4F6F5] p-3">
                <div className="flex gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1F6D4D] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-[#1C1F1E]">
                      Auto Payroll & Tax Math
                    </div>
                    <div className="text-[11px] text-[#6B7280]">
                      Cross-referenced 100+ attendance days & LOP without spreadsheets.
                    </div>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-[#1F6D4D]">22.0 hrs</span>
              </div>

              <div className="flex items-start justify-between rounded-xl bg-[#F4F6F5] p-3">
                <div className="flex gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1F6D4D] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-[#1C1F1E]">
                      Emergency Flow & Auto-Balance
                    </div>
                    <div className="text-[11px] text-[#6B7280]">
                      Instant bypass reduced manual manager approvals for urgent leaves.
                    </div>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-[#1F6D4D]">14.5 hrs</span>
              </div>

              <div className="flex items-start justify-between rounded-xl bg-[#F4F6F5] p-3">
                <div className="flex gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1F6D4D] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-[#1C1F1E]">
                      Geofenced Punch Validation
                    </div>
                    <div className="text-[11px] text-[#6B7280]">
                      Automated audit trail eliminated manual attendance log corrections.
                    </div>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-[#1F6D4D]">12.0 hrs</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowBreakdown(false)}
                className="rounded-xl bg-[#1F6D4D] px-4 py-2 text-xs font-bold text-white hover:bg-[#144933]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

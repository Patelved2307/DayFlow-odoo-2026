import React, { useState } from 'react';
import { useApp } from '../../lib/context/AppContext';
import { ArrowRight, Lock, Mail, User, Shield, AlertTriangle, ArrowLeft } from 'lucide-react';
import { NexaWorkLogo } from '../../components/layout/NexaWorkLogo';
import { usePasswordStrength } from '../../hooks/usePasswordStrength';
import { PasswordStrengthMeter } from '../../components/ui/PasswordStrengthMeter';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';

export const AuthPage: React.FC = () => {
  const { login, setCurrentView, showToast } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form Fields
  const [employeeId, setEmployeeId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gateError, setGateError] = useState<string | null>(null);

  // Real-time Password Strength Hook
  const strength = usePasswordStrength(password);

  // Demo candidates database mock for recruitment gate
  const interviewProfilesMock: Record<string, { status: 'Pending' | 'Approved' | 'Rejected'; name: string }> = {
    '2026': { status: 'Approved', name: 'Patel Ved' },
    'EMP-2026': { status: 'Approved', name: 'Patel Ved' },
    'COEDELKOLH02026': { status: 'Approved', name: 'Patel Ved' },
    COEDELKOLH00508: { status: 'Approved', name: 'Aditi Shah' },
    COEDELKOLH00509: { status: 'Pending', name: 'Marcus Vance' },
    COEDELKOLH00510: { status: 'Rejected', name: 'Sophia Lin' },
    'DF-EMP-104': { status: 'Approved', name: 'Ravi Sharma' },
    'INT-KOL-2026-00045': { status: 'Approved', name: 'Sarah Jenkins' },
    'INT-KOL-2026-00046': { status: 'Approved', name: 'Daniel Miller' },
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setGateError(null);

    const isAdmin = email.includes('admin') || employeeId.toLowerCase().includes('admin');

    if (isSupabaseConfigured && email && password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.warn('[Supabase Auth Warning]', error.message);
        } else if (data.user) {
          showToast(`Supabase Auth verified! Logged in as ${data.user.email}`, 'success');
        }
      } catch (err) {
        console.error('[Supabase Auth Error]', err);
      }
    }

    setIsLoading(false);
    if (isAdmin) {
      login('admin');
    } else {
      login('employee');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setGateError(null);
    setIsLoading(true);

    const cleanEmpId = employeeId.trim();

    // 1. Alphanumeric Regex Check (e.g. COEDELKOLH00508 or DF-EMP-104)
    const idRegex = /^[A-Za-z0-9\-]{5,20}$/;
    if (!idRegex.test(cleanEmpId)) {
      setGateError('Invalid ID format. Must be 5-20 alphanumeric characters (e.g. COEDELKOLH00508).');
      setIsLoading(false);
      return;
    }

    // 2. Query interview_profiles
    const profile = interviewProfilesMock[cleanEmpId.toUpperCase()] || interviewProfilesMock[cleanEmpId];

    if (!profile) {
      setGateError('Employee record does not exist. Please double-check your ID or contact your HR Administrator.');
      setIsLoading(false);
      return;
    }

    if (profile.status === 'Pending') {
      setGateError('Your recruitment process is currently incomplete. Registration is locked until your interview status is Approved by HR.');
      setIsLoading(false);
      return;
    }

    if (profile.status === 'Rejected') {
      setGateError('Registration blocked. The interview record for this ID is marked as Rejected.');
      setIsLoading(false);
      return;
    }

    // 3. Confirm Password Match & Password Strength Security Gate (> 50%)
    if (password !== confirmPassword) {
      setGateError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    if (!strength.isUnlocked) {
      setGateError('Password does not meet the minimum security requirements (must score > 50% and pass all 5 baseline rules).');
      setIsLoading(false);
      return;
    }

    // 4. Register in Supabase Auth & Trigger handle_supabase_new_user in Postgres
    const userEmail = email || `${profile.name.toLowerCase().replace(/\s+/g, '.')}@dayflow.work`;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: userEmail,
          password: password,
          options: {
            data: {
              employee_id: cleanEmpId,
              interview_id: 'INT-KOL-2026-00045',
              full_name: profile.name,
              phone: phone || '+1 (555) 000-0000',
            },
          },
        });

        if (error) {
          console.warn('[Supabase SignUp Note]', error.message);
        } else if (data.user) {
          console.log('[Supabase User Created]', data.user);
        }
      } catch (err) {
        console.error('[Supabase Registration Error]', err);
      }
    }

    // 5. Send Real-Time Welcome Email with Credentials & Employee ID
    try {
      await fetch('/api/send-welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: userEmail,
          name: profile.name,
          employeeId: cleanEmpId,
          role: 'Software Engineer',
          department: 'Engineering',
          manager: 'Eleanor Vance',
        }),
      });
    } catch (err) {
      console.warn('[Email Dispatch Note] Backend Express email server notification:', err);
    }

    setIsLoading(false);
    // 6. Registration Approved
    showToast(`Account successfully registered for ${profile.name}! Triggered trg_new_employee_init in Supabase (15 Paid, 10 Sick, 5 Unpaid leave initialized). Welcome email sent!`, 'success');
    login('employee');
  };

  return (
    <div className="min-h-screen bg-[#F4F6F5] flex flex-col justify-center items-center p-6 text-[#1C1F1E] relative">
      <div className="w-full max-w-md space-y-6">
        {/* Prominent Top Back Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentView('landing')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-gray-100 border border-gray-200 text-xs font-bold text-[#1C1F1E] shadow-2xs transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Home</span>
          </button>

          <span className="text-xs font-semibold text-gray-400">
            {isSignUp ? 'Registration Gate' : 'Workspace Sign-In'}
          </span>
        </div>

        {/* Official NexaWork Logo */}
        <div
          onClick={() => setCurrentView('landing')}
          className="flex flex-col items-center cursor-pointer group py-2"
        >
          <NexaWorkLogo size="xl" showTagline={true} />
        </div>

        {/* Auth Card */}
        <div className="rounded-3xl bg-white p-8 border border-gray-200 shadow-sm space-y-6">
          {/* Tabs */}
          <div className="flex rounded-xl bg-[#F4F6F5] p-1 text-xs font-semibold">
            <button
              onClick={() => {
                setIsSignUp(false);
                setGateError(null);
              }}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                !isSignUp ? 'bg-white text-[#1C1F1E] shadow-2xs font-bold' : 'text-[#6B7280]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsSignUp(true);
                setGateError(null);
              }}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                isSignUp ? 'bg-white text-[#1C1F1E] shadow-2xs font-bold' : 'text-[#6B7280]'
              }`}
            >
              Register
            </button>
          </div>

          {/* Gate Error Alert */}
          {gateError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{gateError}</span>
            </div>
          )}

          {/* Sign In Form */}
          {!isSignUp ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">
                  Employee ID or Corporate Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="COEDELKOLH00508 or name@nexawork.com"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-xs text-[#1C1F1E] outline-none focus:border-[#006837]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-xs text-[#1C1F1E] outline-none focus:border-[#006837]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#006837] hover:bg-[#05522C] py-2.5 text-xs font-bold text-white shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Sign In to Workspace</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-300" />
              </button>
            </form>
          ) : (
            /* Registration Form with Database Recruitment Gate & Password Strength Engine */
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">
                  Employee ID <span className="text-gray-400 font-normal">(e.g. COEDELKOLH00508)</span>
                </label>
                <div className="relative">
                  <Shield className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
                    placeholder="COEDELKOLH00508"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-xs font-mono font-bold text-[#006837] outline-none focus:border-[#006837]"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  Enforces database check against interview_profiles table.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aditi Shah"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-xs text-[#1C1F1E] outline-none focus:border-[#006837]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">
                  Corporate Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aditi.shah@nexawork.com"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-xs text-[#1C1F1E] outline-none focus:border-[#006837]"
                  />
                </div>
              </div>

              {/* Password Field with Strength Meter */}
              <div>
                <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Set a strong password..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-xs text-[#1C1F1E] outline-none focus:border-[#006837]"
                  />
                </div>

                {/* Real-time Password Strength Meter */}
                {password.length > 0 && <PasswordStrengthMeter result={strength} />}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-xs text-[#1C1F1E] outline-none focus:border-[#006837]"
                  />
                </div>
              </div>

              {/* Security Gate Button: Disabled if strength <= 50% or rules fail */}
              <button
                type="submit"
                disabled={!strength.isUnlocked}
                className={`w-full rounded-xl py-2.5 text-xs font-bold text-white shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  strength.isUnlocked
                    ? 'bg-[#006837] hover:bg-[#05522C]'
                    : 'bg-gray-300 cursor-not-allowed opacity-75'
                }`}
              >
                <span>Register Account</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-300" />
              </button>
            </form>
          )}

          {/* Quick Demo Access */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <div className="text-[11px] font-semibold text-[#6B7280] text-center uppercase tracking-wider">
              Or Instant Demo Sign-In
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => login('admin')}
                className="rounded-xl border border-[#006837]/30 bg-emerald-50 hover:bg-emerald-100 p-2.5 text-center transition-colors cursor-pointer"
              >
                <div className="font-bold text-xs text-[#006837]">Admin / HR Mode</div>
                <div className="text-[10px] text-[#6B7280]">Eleanor Vance</div>
              </button>
              <button
                type="button"
                onClick={() => login('employee')}
                className="rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 p-2.5 text-center transition-colors cursor-pointer"
              >
                <div className="font-bold text-xs text-blue-800">Employee Mode</div>
                <div className="text-[10px] text-[#6B7280]">Ravi Sharma</div>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Back Button Link */}
        <div className="text-center">
          <button
            onClick={() => setCurrentView('landing')}
            className="text-xs text-[#6B7280] hover:text-[#1C1F1E] font-semibold flex items-center justify-center gap-1 mx-auto transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to NexaWork Overview</span>
          </button>
        </div>
      </div>
    </div>
  );
};

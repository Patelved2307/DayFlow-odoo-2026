import React, { useState } from 'react';
import { useApp } from '../../lib/context/AppContext';
import { ArrowRight, Lock, Mail, User } from 'lucide-react';
import { NexaWorkLogo } from '../../components/layout/NexaWorkLogo';

export const AuthPage: React.FC = () => {
  const { login, setCurrentView } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('admin')) {
      login('admin');
    } else {
      login('employee');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F5] flex flex-col justify-center items-center p-6 text-[#1C1F1E]">
      <div className="w-full max-w-md space-y-6">
        {/* Official NexaWork Logo */}
        <div
          onClick={() => setCurrentView('landing')}
          className="flex flex-col items-center cursor-pointer group"
        >
          <NexaWorkLogo size="xl" showTagline={true} />
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-white p-8 border border-gray-200 shadow-sm space-y-6">
          {/* Tabs */}
          <div className="flex rounded-xl bg-[#F4F6F5] p-1 text-xs font-semibold">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 rounded-lg transition-all ${
                !isSignUp ? 'bg-white text-[#1C1F1E] shadow-2xs font-bold' : 'text-[#6B7280]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 rounded-lg transition-all ${
                isSignUp ? 'bg-white text-[#1C1F1E] shadow-2xs font-bold' : 'text-[#6B7280]'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
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
                    placeholder="Eleanor Vance"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-xs text-[#1C1F1E] outline-none focus:border-[#006837]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@nexawork.com"
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
              <span>{isSignUp ? 'Create NexaWork Account' : 'Sign In to Workspace'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-300" />
            </button>
          </form>

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

        <div className="text-center">
          <button
            onClick={() => setCurrentView('landing')}
            className="text-xs text-[#6B7280] hover:text-[#1C1F1E] font-medium"
          >
            ← Back to NexaWork Overview
          </button>
        </div>
      </div>
    </div>
  );
};

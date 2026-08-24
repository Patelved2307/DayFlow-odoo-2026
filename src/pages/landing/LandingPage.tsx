import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../lib/context/AppContext';
import { NexaWorkLogo } from '../../components/layout/NexaWorkLogo';
import { sendAutomatedEmail } from '../../lib/services/emailService';
import { WordsPullUp } from '../../components/ui/prisma-hero';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Camera,
  HeartHandshake,
  Award,
  Building2,
  Mail,
  Send,
  Globe,
  Star,
  ExternalLink,
  ChevronRight,
  Clock,
  MapPin,
  AlertTriangle,
  DollarSign,
  XCircle,
  Zap,
  Database,
  Lock,
} from 'lucide-react';
import { FoldText } from '../../components/ui/FoldText';
import LogoLoop, { LogoItem } from '../../components/ui/LogoLoop';

const enterprisePartners: LogoItem[] = [
  {
    node: (
      <div className="flex items-center gap-2.5 bg-[#0D261B] px-4 py-2 rounded-2xl border border-emerald-800/60 text-white shadow-sm hover:border-emerald-400 transition-colors shrink-0">
        <Award className="w-4 h-4 text-[#7EC9A0]" />
        <span className="font-display font-bold text-xs tracking-wide">Odoo Hackathon 2026</span>
      </div>
    ),
    title: 'Odoo Hackathon 2026',
  },
  {
    node: (
      <div className="flex items-center gap-2.5 bg-[#0D261B] px-4 py-2 rounded-2xl border border-emerald-800/60 text-white shadow-sm hover:border-emerald-400 transition-colors shrink-0">
        <Database className="w-4 h-4 text-[#7EC9A0]" />
        <span className="font-display font-bold text-xs tracking-wide">Supabase PostgreSQL</span>
      </div>
    ),
    title: 'Supabase Database',
  },
  {
    node: (
      <div className="flex items-center gap-2.5 bg-[#0D261B] px-4 py-2 rounded-2xl border border-emerald-800/60 text-white shadow-sm hover:border-emerald-400 transition-colors shrink-0">
        <ShieldCheck className="w-4 h-4 text-[#7EC9A0]" />
        <span className="font-display font-bold text-xs tracking-wide">ISO 27001 HR Security</span>
      </div>
    ),
    title: 'ISO Security',
  },
  {
    node: (
      <div className="flex items-center gap-2.5 bg-[#0D261B] px-4 py-2 rounded-2xl border border-emerald-800/60 text-white shadow-sm hover:border-emerald-400 transition-colors shrink-0">
        <Sparkles className="w-4 h-4 text-[#7EC9A0]" />
        <span className="font-display font-bold text-xs tracking-wide">AI Conflict Detector</span>
      </div>
    ),
    title: 'AI Copilot',
  },
  {
    node: (
      <div className="flex items-center gap-2.5 bg-[#0D261B] px-4 py-2 rounded-2xl border border-emerald-800/60 text-white shadow-sm hover:border-emerald-400 transition-colors shrink-0">
        <MapPin className="w-4 h-4 text-[#7EC9A0]" />
        <span className="font-display font-bold text-xs tracking-wide">GPS Geofence Radar</span>
      </div>
    ),
    title: 'Geofence Radar',
  },
  {
    node: (
      <div className="flex items-center gap-2.5 bg-[#0D261B] px-4 py-2 rounded-2xl border border-emerald-800/60 text-white shadow-sm hover:border-emerald-400 transition-colors shrink-0">
        <DollarSign className="w-4 h-4 text-[#7EC9A0]" />
        <span className="font-display font-bold text-xs tracking-wide">Auto-Payroll Engine</span>
      </div>
    ),
    title: 'Auto Payroll',
  },
  {
    node: (
      <div className="flex items-center gap-2.5 bg-[#0D261B] px-4 py-2 rounded-2xl border border-emerald-800/60 text-white shadow-sm hover:border-emerald-400 transition-colors shrink-0">
        <Lock className="w-4 h-4 text-[#7EC9A0]" />
        <span className="font-display font-bold text-xs tracking-wide">100% Tax Compliant</span>
      </div>
    ),
    title: 'Tax Compliant',
  },
];

export const LandingPage: React.FC = () => {
  const { setCurrentView, login, showToast, navigateToAuth } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [activeStoryStep, setActiveStoryStep] = useState<'09:00' | '01:30' | '04:00' | '06:00'>('09:00');
  const [simulatedBasicSalary, setSimulatedBasicSalary] = useState<number>(6500);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Live payroll math calculations for interactive simulator
  const hra = Math.round(simulatedBasicSalary * 0.15);
  const da = Math.round(simulatedBasicSalary * 0.05);
  const ta = Math.round(simulatedBasicSalary * 0.10);
  const special = Math.round(simulatedBasicSalary * 0.10);
  const totalAllowances = hra + da + ta + special;
  const pf = Math.round(simulatedBasicSalary * 0.12);
  const tax = 200;
  const totalDeductions = pf + tax;
  const netTakeHome = simulatedBasicSalary + totalAllowances - totalDeductions;

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address', 'warning');
      return;
    }

    showToast('Subscribing to NexaWork Insights...', 'info');

    await sendAutomatedEmail({
      to: newsletterEmail,
      subject: 'Welcome to NexaWork Insights & Operations Quarterly',
      type: 'NEWSLETTER',
      data: { email: newsletterEmail },
    });

    showToast('Subscription confirmed! A welcome email has been sent directly to your inbox.', 'success');
    setNewsletterEmail('');
  };

  return (
    <div className="min-h-screen bg-[#F4F6F5] text-[#1C1F1E] font-sans selection:bg-emerald-200 selection:text-[#006837]">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 sm:px-8 lg:px-12 py-3.5">
        <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between">
          <div onClick={() => setCurrentView('landing')} className="cursor-pointer">
            <NexaWorkLogo size="md" showTagline={true} />
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#6B7280]">
            <a href="#gallery" className="hover:text-[#006837] transition-colors">Workplace Culture</a>
            <a href="#impact" className="hover:text-[#006837] transition-colors">Impact & Stats</a>
            <a href="#testimonials" className="hover:text-[#006837] transition-colors">Enterprise Trust</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateToAuth('signin')}
              className="rounded-xl border border-gray-300 hover:border-gray-400 bg-white px-4 py-2 text-xs font-semibold text-[#1C1F1E] transition-colors cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => navigateToAuth('signup')}
              className="rounded-xl bg-[#006837] hover:bg-[#05522C] px-4.5 py-2 text-xs font-bold text-white shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Sign Up</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-300" />
            </button>
          </div>
        </div>
      </header>

      {/* 1. Page-Native Eco-Workspace Hero Section */}
      <section className="relative w-full min-h-[85vh] sm:min-h-[90vh] lg:min-h-[92vh] flex flex-col justify-center items-center overflow-hidden bg-[#0A1A14] text-white px-4 sm:px-8 lg:px-12 py-16 border-b border-emerald-950">

        {/* Integrated Eco-Friendly Modern Office Workspace Image */}
        <img
          src="/assets/office-hero.jpg"
          alt="NexaWork Eco-Friendly Office Workspace & Workforce Hub"
          className="absolute inset-0 h-full w-full object-cover scale-105 transition-all duration-1000 brightness-[0.72] contrast-[1.05]"
        />

        {/* Brand Theme Overlay Gradients (Align Green & Dark Forest Overlay) */}
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.40] mix-blend-overlay z-1" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0A1A14]/85 via-[#0A1A14]/45 to-[#0A1A14] z-1" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#006837]/30 rounded-full blur-3xl animate-pulse z-1" />

        {/* Main Hero Content Container (Centered) */}
        <div className="relative z-10 max-w-4xl w-full mx-auto text-center space-y-8 my-auto pt-6">

          {/* Centered Motion Title with 3D FoldText Animation */}
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.08] max-w-4xl mx-auto">
            <span className="block text-white">Every workday,</span>
            <span className="text-[#7EC9A0] block mt-1 sm:mt-2">
              <FoldText
                text="perfectly aligned."
                splitBy="char"
                hinge="top"
                trigger="mount"
                duration={0.7}
                stagger={0.035}
                color="#7EC9A0"
              />
            </span>
          </h1>

          {/* Centered Subtitle Description */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg text-emerald-100/85 leading-relaxed max-w-2xl mx-auto text-center font-normal"
          >
            NexaWork unites workforce attendance, instant emergency leave logging, conflict-aware approvals, and auto-synchronized payroll into one intuitive platform built for HR leaders and employees.
          </motion.p>

          {/* Centered Action Pill Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => navigateToAuth('signin')}
              className="group inline-flex items-center gap-3 rounded-full bg-[#006837] hover:bg-[#05522C] py-2.5 pl-7 pr-2.5 text-sm font-bold text-white shadow-2xl border border-emerald-400/40 transition-all cursor-pointer hover:gap-4 active:scale-95"
            >
              <span>Sign In to Workspace</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#006837] transition-transform group-hover:scale-110 shadow-sm">
                <ArrowRight className="h-4 w-4" />
              </span>
            </motion.button>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => navigateToAuth('signup')}
              className="group inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 backdrop-blur-md px-7 py-4 text-sm font-semibold text-white transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <span>Create Account</span>
              <ChevronRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </div>

          {/* Centered Feature Badges Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4 text-xs font-semibold text-emerald-100/90">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Geofenced Check-in</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Instant Emergency Half-Day</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Auto-Reconciled Payroll</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Impact Strip with Scroll Motion */}
      <section id="impact" className="bg-[#006837] text-white py-10 px-4 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/15"
        >
          <div className="pt-2 sm:pt-0">
            <div className="font-display text-4xl font-extrabold tracking-tight text-white">48.5 hrs</div>
            <div className="text-xs text-emerald-200 font-medium mt-1">
              HR administrative workload saved monthly
            </div>
          </div>
          <div className="pt-2 sm:pt-0 sm:pl-6">
            <div className="font-display text-4xl font-extrabold tracking-tight text-white">100%</div>
            <div className="text-xs text-emerald-200 font-medium mt-1">
              Leave conflict detection across departments
            </div>
          </div>
          <div className="pt-2 sm:pt-0 sm:pl-6">
            <div className="font-display text-4xl font-extrabold tracking-tight text-white">Zero</div>
            <div className="text-xs text-emerald-200 font-medium mt-1">
              Missed tax withholding or compliance deadlines
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. Creative & Informal "A Workday with NexaWork" Interactive Experience */}
      <section id="experience" className="py-20 px-4 sm:px-8 lg:px-12 max-w-[1400px] mx-auto space-y-12">
        {/* Section Header with Doodle Badges & Arrow Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-4 relative"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EBF5F0] px-4 py-1.5 text-xs font-bold text-[#006837] border border-emerald-300/60 shadow-2xs transform -rotate-1">
            <Zap className="w-4 h-4 text-[#006837] animate-pulse" />
            <span>Frankly Speaking • No Boring Sales Pitch</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#1C1F1E] tracking-tight leading-tight">
            How NexaWork Actually Works <br className="hidden sm:inline" />
            <span className="text-[#006837] relative inline-block underline decoration-emerald-400 decoration-wavy decoration-2">
              24 Hours in 60 Seconds
            </span>
          </h2>

          <p className="text-sm sm:text-base text-[#6B7280] max-w-2xl mx-auto font-normal leading-relaxed">
            Click through the workday steps below to test real-time geofencing, 1-click emergency leaves, AI Copilot answers, and live auto-reconciled payroll!
          </p>

          {/* Playful Hand-Drawn Arrow Callout */}
          <div className="hidden md:flex items-center justify-center gap-2 text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200 w-fit mx-auto transform rotate-2">
            <span>↳ Click any timeline step to test the live simulator!</span>
          </div>
        </motion.div>

        {/* Timeline Interactive Pill Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
          <button
            onClick={() => setActiveStoryStep('09:00')}
            className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${activeStoryStep === '09:00'
                ? 'bg-[#006837] text-white border-[#006837] shadow-lg scale-105 ring-4 ring-emerald-100'
                : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50'
              }`}
          >
            <Clock className="w-4 h-4" />
            <span>09:00 AM • Geofence Punch</span>
          </button>

          <button
            onClick={() => setActiveStoryStep('01:30')}
            className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${activeStoryStep === '01:30'
                ? 'bg-[#006837] text-white border-[#006837] shadow-lg scale-105 ring-4 ring-emerald-100'
                : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50'
              }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-300" />
            <span>01:30 PM • Emergency Fast-Track</span>
          </button>

          <button
            onClick={() => setActiveStoryStep('04:00')}
            className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${activeStoryStep === '04:00'
                ? 'bg-[#006837] text-white border-[#006837] shadow-lg scale-105 ring-4 ring-emerald-100'
                : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50'
              }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>04:00 PM • AI HR Copilot</span>
          </button>

          <button
            onClick={() => setActiveStoryStep('06:00')}
            className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${activeStoryStep === '06:00'
                ? 'bg-[#006837] text-white border-[#006837] shadow-lg scale-105 ring-4 ring-emerald-100'
                : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50'
              }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-300" />
            <span>06:00 PM • Auto-Payroll Run</span>
          </button>
        </div>

        {/* Live Simulator Canvas Card */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-white p-6 sm:p-10 border-2 border-dashed border-[#006837]/30 shadow-xl relative overflow-hidden transition-all">
          {/* Top Decorative Tag */}
          <div className="absolute top-4 right-4 bg-emerald-100 text-[#006837] font-mono text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-200">
            Interactive Simulator Mode
          </div>

          {/* STEP 1: 09:00 AM GEOFENCE PUNCH */}
          {activeStoryStep === '09:00' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#006837] flex items-center justify-center font-bold font-mono text-base">
                  09:00
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-[#1C1F1E]">
                    Geofenced Smart Arrival & Proxy Prevention
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    GPS Location verification within 50m office radius. Zero manual proxy clock-ins allowed.
                  </p>
                </div>
              </div>

              {/* Simulated GPS Widget */}
              <div className="p-5 rounded-2xl bg-[#0A1A14] text-white space-y-4 border border-emerald-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                    <MapPin className="w-4 h-4 text-emerald-400 animate-bounce" />
                    <span>GPS Geofence Radar Active</span>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                    STATUS: INSIDE RADIUS (32m)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                    <div className="text-[10px] text-emerald-200/70 uppercase">Allowed Radius</div>
                    <div className="font-bold text-white text-base font-mono">50 Meters</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                    <div className="text-[10px] text-emerald-200/70 uppercase">Your GPS Distance</div>
                    <div className="font-bold text-emerald-300 text-base font-mono">32.4 Meters</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                    <div className="text-[10px] text-emerald-200/70 uppercase">Punch Verified</div>
                    <div className="font-bold text-emerald-400 text-base font-mono">09:02:14 AM</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-emerald-200/80 pt-2 border-t border-white/10">
                  <span>✓ Device MAC & Location Signature Verified</span>
                  <span className="font-bold text-white">1-Tap Punch Success!</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: 01:30 PM EMERGENCY LEAVE */}
          {activeStoryStep === '01:30' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold font-mono text-base">
                  13:30
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-[#1C1F1E]">
                    1-Click Emergency Half-Day Fast-Track
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    Sudden personal or medical emergency? Pinned to HR control tower in Amber for 1-click resolution.
                  </p>
                </div>
              </div>

              {/* Simulated Emergency Card */}
              <div className="p-5 rounded-2xl bg-amber-500 text-white space-y-4 border border-amber-600 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-100">
                    <AlertTriangle className="w-4 h-4 text-white" />
                    <span>EMERGENCY LEAVE REQUEST LOGGED</span>
                  </div>
                  <span className="bg-white text-amber-900 font-mono text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-2xs">
                    PINNED TO HR TOP QUEUE
                  </span>
                </div>

                <div className="bg-white/10 p-4 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-amber-100">Employee:</span>
                    <span className="font-bold">Ravi Sharma (Senior Engineer)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-100">Category:</span>
                    <span className="font-bold">Urgent Family Medical Emergency</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-100">HR Resolution Time:</span>
                    <span className="font-mono font-bold text-white">45 Seconds (Auto-Approved)</span>
                  </div>
                </div>

                <div className="text-[11px] text-amber-100 flex items-center justify-between pt-1">
                  <span>⚡ Automatic balance deduction: -0.5 Emergency Leave Day</span>
                  <span className="font-bold text-white bg-amber-600 px-3 py-1 rounded-lg">Status: Approved ✓</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: 04:00 PM AI HR COPILOT */}
          {activeStoryStep === '04:00' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#006837] flex items-center justify-center font-bold font-mono text-base">
                  16:00
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-[#1C1F1E]">
                    24/7 AI HR Copilot & Instant Policy Resolver
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    Ask any question about leave balances, company policies, or payroll items without emailing HR.
                  </p>
                </div>
              </div>

              {/* Simulated AI Chat Window */}
              <div className="p-5 rounded-2xl bg-gray-900 text-white space-y-4 border border-gray-800 font-sans">
                <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
                  <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-white">NexaWork AI HR Assistant</span>
                </div>

                <div className="space-y-3 text-xs">
                  {/* User Query */}
                  <div className="flex justify-end">
                    <div className="bg-[#006837] text-white p-3 rounded-2xl rounded-tr-none max-w-sm">
                      "How many paid leaves do I have left, and can I take 2 days off next week?"
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-black font-bold flex items-center justify-center text-[10px] shrink-0">
                      AI
                    </div>
                    <div className="bg-gray-800 text-gray-200 p-3.5 rounded-2xl rounded-tl-none max-w-md space-y-1.5 leading-relaxed">
                      <p>
                        Hi Ravi! You currently have <strong className="text-emerald-400">14 Paid Leaves</strong> and <strong className="text-emerald-400">8 Sick Leaves</strong> remaining in your balance ledger.
                      </p>
                      <p className="text-[11px] text-gray-400">
                        ✓ Taking 2 days next week will leave you with 12 Paid Leaves. No calendar conflicts detected in the Engineering squad!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: 06:00 PM AUTOMATED PAYROLL RUN */}
          {activeStoryStep === '06:00' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#006837] flex items-center justify-center font-bold font-mono text-base">
                  18:00
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-[#1C1F1E]">
                    Automated Percentage-Based Payroll Engine
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    Drag the Basic Salary slider below to see real-time automated calculation of HRA, DA, TA, PF, Tax, and Net Pay!
                  </p>
                </div>
              </div>

              {/* Live Interactive Salary Calculator Slider */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950 to-[#0A1A14] text-white space-y-5 border border-emerald-900">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-emerald-200 font-semibold">Monthly Basic Salary (Adjust Slider):</span>
                    <span className="font-mono font-extrabold text-lg text-emerald-300">
                      ${simulatedBasicSalary.toLocaleString()} / mo
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3000"
                    max="15000"
                    step="500"
                    value={simulatedBasicSalary}
                    onChange={(e) => setSimulatedBasicSalary(Number(e.target.value))}
                    className="w-full accent-[#7EC9A0] cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
                  <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                    <div className="text-[10px] text-emerald-200/70">HRA (15%)</div>
                    <div className="font-bold text-white font-mono">${hra.toLocaleString()}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                    <div className="text-[10px] text-emerald-200/70">DA (5%) + TA (10%)</div>
                    <div className="font-bold text-white font-mono">${(da + ta).toLocaleString()}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                    <div className="text-[10px] text-rose-300/80">PF Deduction (12%)</div>
                    <div className="font-bold text-rose-300 font-mono">-${pf.toLocaleString()}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40">
                    <div className="text-[10px] text-emerald-300 font-bold uppercase">Net Take-Home</div>
                    <div className="font-extrabold text-emerald-300 text-lg font-mono">${netTakeHome.toLocaleString()}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-emerald-200/80 pt-1">
                  <span>✓ Auto-Generated Payslips Dispatched via Nodemailer</span>
                  <span className="font-mono text-white font-bold">100% Tax Compliant</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. "Frankly Speaking: Traditional HR vs NexaWork" Visual Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 pt-6"
        >
          {/* Old Way */}
          <div className="rounded-3xl bg-rose-50/70 p-6 sm:p-8 border border-rose-200 space-y-4 relative">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-200 text-rose-900 font-bold text-xs px-3.5 py-1">
              <XCircle className="w-4 h-4 text-rose-700" />
              <span>Traditional HR Overhead (The Old Way)</span>
            </div>

            <ul className="space-y-3 text-xs text-rose-950/80 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Paper leave forms lost under desk stacks & slow manual approvals.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Proxy attendance disputes and unverified manual log entries.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Excel formula errors causing delayed monthly payroll payouts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Unverified employee onboarding without HR recruitment approval gates.</span>
              </li>
            </ul>
          </div>

          {/* NexaWork Way */}
          <div className="rounded-3xl bg-[#EBF5F0] p-6 sm:p-8 border-2 border-[#006837] space-y-4 shadow-lg relative transform md:scale-105">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#006837] text-white font-bold text-xs px-3.5 py-1 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>NexaWork Engine (The Smart Way)</span>
            </div>

            <ul className="space-y-3 text-xs text-[#1C1F1E] font-semibold">
              <li className="flex items-start gap-2">
                <span className="text-[#006837] font-bold">✓</span>
                <span>Geofence GPS radius punch with real-time proxy anomaly shield.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#006837] font-bold">✓</span>
                <span>1-Click Amber Emergency Half-Day fast-track HR queue.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#006837] font-bold">✓</span>
                <span>Automated Postgres view math for live net salary calculations.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#006837] font-bold">✓</span>
                <span>Candidate Interview Verification Gate before account activation.</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </section>

      {/* 5. Client & Enterprise Testimonials Wall */}
      <section id="testimonials" className="bg-white py-20 px-4 sm:px-8 lg:px-12 border-y border-gray-200">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-[1400px] mx-auto space-y-12"
        >
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#006837]">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Enterprise Partner Feedback</span>
            </div>
            <h2 className="font-display font-bold text-3xl text-[#1C1F1E]">
              Trusted by progressive HR teams
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-[#F4F6F5] p-6 border border-gray-200 space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed italic">
                "NexaWork transformed our attendance & leave reconciliation. The Emergency Half-Day flow saved our managers hundreds of back-and-forth messages."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-9 h-9 rounded-full bg-[#006837] text-white font-bold flex items-center justify-center text-xs">
                  EV
                </div>
                <div>
                  <div className="font-bold text-xs text-gray-900">Eleanor Vance</div>
                  <div className="text-[11px] text-gray-500">Chief Human Resources Officer</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#F4F6F5] p-6 border border-gray-200 space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed italic">
                "The automatic email engine directly notifies our employees the second their leave is approved or payslip is ready. Zero confusion."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-9 h-9 rounded-full bg-[#006837] text-white font-bold flex items-center justify-center text-xs">
                  TM
                </div>
                <div>
                  <div className="font-bold text-xs text-gray-900">Totok Michael</div>
                  <div className="text-[11px] text-gray-500">VP of Engineering Operations</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#F4F6F5] p-6 border border-gray-200 space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed italic">
                "Having the exact dashboard UI reference adapted to real NexaWork workforce metrics gives our executive board absolute clarity."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-9 h-9 rounded-full bg-[#006837] text-white font-bold flex items-center justify-center text-xs">
                  RS
                </div>
                <div>
                  <div className="font-bold text-xs text-gray-900">Ravi Sharma</div>
                  <div className="text-[11px] text-gray-500">Senior Software Lead</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 5. Rich Multi-Column Footer */}
      <footer className="bg-[#0B1E17] text-white pt-16 pb-12 px-4 sm:px-8 lg:px-12 border-t border-emerald-950">
        <div className="max-w-[1400px] mx-auto space-y-12">
          {/* Top Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Col 1: Brand & Logo */}
            <div className="lg:col-span-2 space-y-4">
              <NexaWorkLogo size="lg" variant="white" showTagline={true} />
              <p className="text-xs text-emerald-100/70 leading-relaxed max-w-sm">
                NexaWork is the enterprise-grade workforce alignment platform bringing attendance tracking, emergency leaves, conflict-aware approvals, and auto-reconciled payroll together.
              </p>

              {/* Newsletter Subscription Box */}
              <form onSubmit={handleNewsletterSubmit} className="pt-2 max-w-md">
                <span className="text-xs font-bold text-emerald-300 block mb-2">
                  Subscribe to NexaWork Insights & Updates
                </span>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Enter employee email..."
                      className="w-full pl-9 pr-3 py-2 bg-white/10 border border-emerald-800/60 rounded-xl text-xs text-white placeholder-emerald-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#006837] hover:bg-[#0A7C46] text-white text-xs font-bold rounded-xl transition-colors shrink-0 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Subscribe</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Col 2: Product */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Product</h4>
              <ul className="space-y-2 text-emerald-100/70">
                <li><a href="#impact" className="hover:text-emerald-300 transition-colors">HR Dashboard</a></li>
                <li><a href="#impact" className="hover:text-emerald-300 transition-colors">Employee Portal</a></li>
                <li><a href="#impact" className="hover:text-emerald-300 transition-colors">Attendance Geofencing</a></li>
                <li><a href="#impact" className="hover:text-emerald-300 transition-colors">Emergency Half-Day</a></li>
                <li><a href="#impact" className="hover:text-emerald-300 transition-colors">Payroll Engine</a></li>
              </ul>
            </div>

            {/* Col 3: Company */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Company</h4>
              <ul className="space-y-2 text-emerald-100/70">
                <li><a href="#gallery" className="hover:text-emerald-300 transition-colors">Workplace Culture</a></li>
                <li><a href="#gallery" className="hover:text-emerald-300 transition-colors">Organization Galleries</a></li>
                <li><a href="#testimonials" className="hover:text-emerald-300 transition-colors">Customer Success</a></li>
                <li><a href="#impact" className="hover:text-emerald-300 transition-colors">Careers & Hiring</a></li>
              </ul>
            </div>

            {/* Col 4: Security & Compliance */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Security</h4>
              <ul className="space-y-2 text-emerald-100/70">
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SOC2 Type II Certified</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Geofence Proxy Shield</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Automated Tax Encrypt</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Legal & Copyright Bar */}
          <div className="pt-8 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-200/60">
            <div className="flex items-center gap-2">
              <span>© 2026 NexaWork Inc. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Security Overview</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Image Modal Lightbox */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer animate-in fade-in"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img src={selectedImage} alt="Enlarged Showcase" className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
};

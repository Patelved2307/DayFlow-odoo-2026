import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Quote,
  Heart,
  Compass,
  Lightbulb,
  ChevronLeft,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, login, showToast, navigateToAuth } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);

  const galleryImages = [
    {
      id: 'g-1',
      title: 'Eco-Friendly Biophilic Workspace Hub',
      category: 'tech',
      location: 'NexaWork Headquarters',
      image: '/assets/office-hero.jpg',
      description: 'Lush greenery, ergonomic pods, and eco-friendly workspace designed for high-performance workforce alignment.',
    },
    {
      id: 'g-2',
      title: 'Annual Workforce Excellence Summit',
      category: 'leadership',
      location: 'New York Tech Center',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
      description: 'Executive town hall sharing workforce alignment strategies and transparent culture roadmap.',
    },
    {
      id: 'g-3',
      title: 'Collaborative Open Workspace',
      category: 'culture',
      location: 'Austin Campus',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
      description: 'Designed for fluid communication, hybrid sync, and cross-departmental project squads.',
    },
    {
      id: 'g-4',
      title: 'Design Systems & UX Sprint',
      category: 'tech',
      location: 'Design Studio',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
      description: 'Pioneering accessible, ultra-clean UI design standards for enterprise workforce software.',
    },
    {
      id: 'g-5',
      title: 'Team Building & Culture Retreat',
      category: 'culture',
      location: 'Lake Tahoe Summit',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
      description: 'Fostering trust, mental wellness, and strong interpersonal alignment across teams.',
    },
    {
      id: 'g-6',
      title: 'Executive Leadership Panel',
      category: 'leadership',
      location: 'Global Operations',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
      description: 'Guiding enterprise HR policies, diversity metrics, and scalable employee success.',
    },
  ];

  const visionaryQuotes = [
    {
      id: 'q-1',
      quote: "Clients do not come first. Employees come first. If you take care of your employees, they will take care of the clients.",
      author: "Sir Richard Branson",
      title: "Founder, Virgin Group",
      category: "Workforce Philosophy",
      tag: "People First",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: 'q-2',
      quote: "A team is not a group of people who work together. A team is a group of people who trust each other.",
      author: "Simon Sinek",
      title: "Author & Organisational Thinker",
      category: "Culture & Trust",
      tag: "Radical Trust",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: 'q-3',
      quote: "Great things in business are never done by one person. They're done by a team of people aligned around a shared vision.",
      author: "Steve Jobs",
      title: "Co-Founder, Apple",
      category: "Leadership Alignment",
      tag: "Team Synergy",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: 'q-4',
      quote: "Efficiency is doing things right; effectiveness is doing the right things for your people.",
      author: "Peter Drucker",
      title: "Father of Modern Management",
      category: "Operational Excellence",
      tag: "Frictionless HR",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    },
  ];

  const manifestoPillars = [
    {
      number: '01',
      title: 'Empathy Over Bureaucracy',
      description: 'Emergency leave requests shouldn’t require multi-day paperwork. One-click Amber fast-track resolution respects human emergencies instantly.',
    },
    {
      number: '02',
      title: 'Radical Transparency',
      description: 'Automated percentage-based salary structures eliminate ambiguity. Live calculation preview builds 100% trust between management & teams.',
    },
    {
      number: '03',
      title: 'Trust-Based Geofencing',
      description: 'Respect location and shift timing without invasive micromanagement. Smart anomaly detection flags discrepancies fairly.',
    },
    {
      number: '04',
      title: 'Frictionless Automation',
      description: 'By replacing hours of repetitive HR data entry with automated views & email credentials, leaders focus on growing people.',
    },
  ];

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
          
          {/* Centered Motion Title */}
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.08] max-w-4xl mx-auto">
            <WordsPullUp text="Every workday," className="inline-block text-white" />
            <span className="text-[#7EC9A0] block mt-1 sm:mt-2">
              <WordsPullUp text="perfectly aligned." showAsterisk />
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

      {/* 2. Impact Strip */}
      <section id="impact" className="bg-[#006837] text-white py-10 px-4 sm:px-8 lg:px-12">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/15">
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
        </div>
      </section>

      {/* 3. Visionary Leadership Quotes & Workforce Manifesto */}
      <section id="gallery" className="py-20 px-4 sm:px-8 lg:px-12 max-w-[1400px] mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-[#006837] border border-emerald-200">
            <Quote className="w-3.5 h-3.5" />
            <span>Workforce Philosophy & Vision</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#1C1F1E]">
            Wisdom That Drives Modern Teams
          </h2>
          <p className="text-sm text-[#6B7280]">
            Grounding enterprise HR technology in timeless principles of human dignity, transparency, and organizational alignment.
          </p>
        </div>

        {/* Featured Visionary Quote Spotlight Card */}
        <div className="relative rounded-3xl bg-[#0A1A14] text-white p-8 sm:p-12 lg:p-14 overflow-hidden border border-emerald-900 shadow-2xl">
          {/* Subtle Background Glows */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#006837]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#7EC9A0]/10 rounded-full blur-2xl pointer-events-none" />

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pb-8 border-b border-emerald-900/80">
            <span className="rounded-full bg-emerald-900/60 border border-emerald-700/50 text-[#7EC9A0] text-xs font-bold px-3 py-1 uppercase tracking-wider">
              {visionaryQuotes[activeQuoteIndex].category} &bull; {visionaryQuotes[activeQuoteIndex].tag}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setActiveQuoteIndex((prev) => (prev === 0 ? visionaryQuotes.length - 1 : prev - 1))
                }
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Previous quote"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setActiveQuoteIndex((prev) => (prev === visionaryQuotes.length - 1 ? 0 : prev + 1))
                }
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Next quote"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quote Body with AnimatePresence */}
          <div className="py-8 min-h-[180px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={visionaryQuotes[activeQuoteIndex].id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 max-w-4xl"
              >
                <blockquote className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium text-emerald-50 leading-relaxed tracking-tight">
                  “{visionaryQuotes[activeQuoteIndex].quote}”
                </blockquote>

                <div className="flex items-center gap-4 pt-2">
                  <img
                    src={visionaryQuotes[activeQuoteIndex].avatar}
                    alt={visionaryQuotes[activeQuoteIndex].author}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#7EC9A0]"
                  />
                  <div>
                    <div className="font-bold text-base text-white">
                      {visionaryQuotes[activeQuoteIndex].author}
                    </div>
                    <div className="text-xs text-emerald-200/80">
                      {visionaryQuotes[activeQuoteIndex].title}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Quote Dots Bar */}
          <div className="flex items-center gap-2 pt-4">
            {visionaryQuotes.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setActiveQuoteIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === activeQuoteIndex ? 'w-8 bg-[#7EC9A0]' : 'w-2 bg-emerald-900 hover:bg-emerald-800'
                }`}
                aria-label={`Go to quote ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* NexaWork Core Manifesto Grid (4 Creative Pillars) */}
        <div className="space-y-8 pt-4">
          <div className="text-center max-w-xl mx-auto">
            <h3 className="font-display font-bold text-2xl text-[#1C1F1E]">
              The NexaWork Core Manifesto
            </h3>
            <p className="text-xs text-[#6B7280] mt-1">
              Four non-negotiable principles engineered into every line of code.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {manifestoPillars.map((pillar) => (
              <div
                key={pillar.number}
                className="rounded-2xl bg-white p-6 border border-gray-200 shadow-2xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="font-mono text-2xl font-extrabold text-[#006837] tracking-tight">
                    {pillar.number}
                  </div>
                  <h4 className="font-display font-bold text-base text-[#1C1F1E] mt-2">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed mt-2">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center gap-1.5 text-[10px] font-bold text-[#006837] uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Built-in Default</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Client & Enterprise Testimonials Wall */}
      <section id="testimonials" className="bg-white py-20 px-4 sm:px-8 lg:px-12 border-y border-gray-200">
        <div className="max-w-[1400px] mx-auto space-y-12">
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
        </div>
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

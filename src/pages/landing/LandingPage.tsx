import React, { useState } from 'react';
import { useApp } from '../../lib/context/AppContext';
import { NexaWorkLogo } from '../../components/layout/NexaWorkLogo';
import { sendAutomatedEmail } from '../../lib/services/emailService';
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
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, login, showToast } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [activeGalleryTab, setActiveGalleryTab] = useState<'all' | 'culture' | 'tech' | 'leadership'>('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galleryImages = [
    {
      id: 'g-1',
      title: 'Engineering Innovation Hub',
      category: 'tech',
      location: 'San Francisco HQ',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
      description: 'Our engineering team collaborating during the quarterly NexaWork product hackathon.',
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

  const filteredGallery =
    activeGalleryTab === 'all'
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeGalleryTab);

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
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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
              onClick={() => setCurrentView('auth')}
              className="rounded-xl border border-gray-300 hover:border-gray-400 bg-white px-4 py-2 text-xs font-semibold text-[#1C1F1E] transition-colors cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => setCurrentView('auth')}
              className="rounded-xl bg-[#006837] hover:bg-[#05522C] px-4.5 py-2 text-xs font-bold text-white shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Sign Up</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-300" />
            </button>
          </div>
        </div>
      </header>

      {/* 1. Hero Section (Overhauled - Speedometer Removed) */}
      <section className="relative overflow-hidden pt-16 pb-24 px-6 border-b border-gray-200 bg-gradient-to-b from-white to-[#F4F6F5]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-[#006837] border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-[#006837]" />
              <span>Next-Generation Workforce Alignment Suite</span>
            </div>

            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-[#1C1F1E] tracking-tight leading-[1.1]">
              Every workday, <br />
              <span className="text-[#006837]">perfectly aligned.</span>
            </h1>

            <p className="text-base text-[#6B7280] leading-relaxed max-w-xl">
              NexaWork unites workforce attendance, instant emergency leave logging, conflict-aware approvals, and auto-synchronized payroll into one intuitive platform built for HR leaders and employees.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setCurrentView('auth')}
                className="rounded-xl bg-[#006837] hover:bg-[#05522C] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Login</span>
                <ArrowRight className="w-4 h-4 text-emerald-300" />
              </button>
              <button
                onClick={() => setCurrentView('auth')}
                className="rounded-xl border border-gray-300 bg-white hover:bg-gray-50 px-6 py-3.5 text-sm font-semibold text-[#1C1F1E] transition-colors cursor-pointer shadow-2xs"
              >
                Sign Up
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-[#6B7280]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#006837]" />
                <span>Geofenced Check-in</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#006837]" />
                <span>Instant Emergency Half-Day</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#006837]" />
                <span>Auto-Reconciled Payroll</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Card Stack */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl bg-white p-6 border border-gray-200 shadow-xl space-y-4">
              {/* Header Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[11px] font-bold text-[#006837] bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Live Workforce Sync Active
                </span>
              </div>

              {/* Stat Preview Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#006837] to-[#0A522E] text-white">
                  <span className="text-[11px] text-emerald-100 font-semibold block">Total Workforce</span>
                  <strong className="font-display font-extrabold text-2xl">24 Active</strong>
                  <span className="text-[10px] text-emerald-200 block mt-1">+3 added this month</span>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <span className="text-[11px] text-gray-500 font-semibold block">Present Today</span>
                  <strong className="font-display font-extrabold text-2xl text-gray-900">95% On-Time</strong>
                  <span className="text-[10px] text-[#006837] font-bold block mt-1">Healthy Alignment</span>
                </div>
              </div>

              {/* Activity Item Mockup */}
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#006837] font-bold flex items-center justify-center">
                    AD
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Alexandra Deff</div>
                    <div className="text-[11px] text-gray-500">Task Completed • Github Repo Sync</div>
                  </div>
                </div>
                <span className="bg-emerald-100 text-[#006837] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Completed
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Impact Strip */}
      <section id="impact" className="bg-[#006837] text-white py-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/15">
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

      {/* 3. Organization Culture & Workplace Galleries */}
      <section id="gallery" className="py-20 px-6 max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#006837] border border-emerald-200">
            <Camera className="w-3.5 h-3.5" />
            <span>Workplace Culture & Life at NexaWork</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#1C1F1E]">
            Our Organization Galleries
          </h2>
          <p className="text-sm text-[#6B7280]">
            Take a visual tour inside our campuses, collaborative team hackathons, executive town halls, and modern engineering hubs.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setActiveGalleryTab('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeGalleryTab === 'all'
                  ? 'bg-[#006837] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Showcase
            </button>
            <button
              onClick={() => setActiveGalleryTab('tech')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeGalleryTab === 'tech'
                  ? 'bg-[#006837] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Engineering & Design
            </button>
            <button
              onClick={() => setActiveGalleryTab('culture')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeGalleryTab === 'culture'
                  ? 'bg-[#006837] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Culture & Retreats
            </button>
            <button
              onClick={() => setActiveGalleryTab('leadership')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeGalleryTab === 'leadership'
                  ? 'bg-[#006837] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Leadership & Summits
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item.image)}
              className="group rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-52 overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {item.location}
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-display font-bold text-base text-[#1C1F1E] group-hover:text-[#006837] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Client & Enterprise Testimonials Wall */}
      <section id="testimonials" className="bg-white py-20 px-6 border-y border-gray-200">
        <div className="max-w-7xl mx-auto space-y-12">
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
      <footer className="bg-[#0B1E17] text-white pt-16 pb-12 px-6 border-t border-emerald-950">
        <div className="max-w-7xl mx-auto space-y-12">
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

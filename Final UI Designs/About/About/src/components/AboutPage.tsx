import React, { useState } from 'react';
import {
  Brain,
  Users,
  Mic,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { ParticleBackground } from './ParticleBackground.tsx';
import { LogoSlider } from './LogoSlider.tsx';
import { BookingModal } from './BookingModal.tsx';

export const AboutPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'discovery' | 'speaking' | 'workshop'>('discovery');

  const openBooking = (type: 'discovery' | 'speaking' | 'workshop') => {
    setModalType(type);
    setModalOpen(true);
  };

  const portraitSrc = 'Public/NEW 2026_Paige Bradbury_03.jpg';

  return (
    <div className="w-full bg-white text-slate-900 overflow-x-hidden selection:bg-[#f8c51c] selection:text-[#0c2940]">
      {/* =========================================================================
          SECTION 1: HERO (Deep Navy band with 50% opacity particle animation BG)
          ========================================================================= */}
      <section className="relative w-full bg-[#0c2940] text-white overflow-hidden">
        <ParticleBackground />

        {/* Hero Content Area */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-14 pb-20 sm:pt-20 sm:pb-28">
          <div className="max-w-4xl space-y-6">
            {/* Kicker tag in mandatory #f8c51c colour */}
            <div className="inline-block">
              <span
                style={{ color: '#f8c51c' }}
                className="text-xs sm:text-sm font-extrabold uppercase tracking-widest font-h2 block"
              >
                AI LITERACY AND WORKFORCE TRAINING | METRO ATLANTA, GEORGIA
              </span>
            </div>

            {/* Main H1 Headline in Inter */}
            <h1 className="font-h1 text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-bold tracking-tight text-white leading-[1.08] text-balance">
              We help organizations make AI adoption stick.
            </h1>

            {/* Subtitle in Roboto */}
            <p className="font-body text-base sm:text-lg md:text-xl text-slate-200/95 leading-relaxed max-w-2xl font-light">
              The Bradbury Group is an AI literacy and workforce training firm based in Metro Atlanta.
              Our programs align with the U.S. Department of Labor AI Literacy Framework.
            </p>

            {/* Hero CTA Button */}
            <div className="pt-4">
              <button
                onClick={() => openBooking('discovery')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 sm:px-7 sm:py-4 bg-[#f8c51c] text-[#0c2940] font-bold text-sm sm:text-base rounded-lg hover:bg-[#eab308] active:translate-y-px transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer font-h2 tracking-tight"
              >
                <span>Book a Discovery Call</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: WHAT WE DO (3 cards - matching Screenshot 2)
          ========================================================================= */}
      <section id="services" className="w-full bg-white py-16 sm:py-24 px-4 sm:px-8 lg:px-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          {/* Section Kicker & Title */}
          <div className="mb-12">
            <span className="inline-block px-3 py-1 bg-[#0c2940]/10 text-[#0c2940] text-xs font-bold uppercase tracking-wider rounded-xs font-h2 mb-3">
              WHAT WE DO
            </span>
            <h2 className="font-h2 text-3xl sm:text-4xl font-bold text-[#0c2940] tracking-tight">
              Practical AI learning for the work ahead
            </h2>
          </div>

          {/* 3 Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1: AI Training for Teams */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 p-6 sm:p-8 flex flex-col justify-between border-t-4 border-t-teal-600">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Brain className="w-6 h-6 stroke-[1.75]" />
                </div>
                <h3 className="font-h2 text-xl sm:text-2xl font-bold text-[#0c2940] tracking-tight">
                  AI Training for Teams
                </h3>
                <p className="font-body text-[#0c2940]/90 text-sm sm:text-base leading-relaxed">
                  Cohort-based AI literacy and fluency training built around your team's real work.
                </p>
              </div>
              <div className="pt-6">
                <button
                  onClick={() => openBooking('workshop')}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1 font-h2 group cursor-pointer"
                >
                  <span>Explore team cohorts</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Card 2: Executive AI Coaching */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 p-6 sm:p-8 flex flex-col justify-between border-t-4 border-t-amber-500">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Users className="w-6 h-6 stroke-[1.75]" />
                </div>
                <h3 className="font-h2 text-xl sm:text-2xl font-bold text-[#0c2940] tracking-tight">
                  Executive AI Coaching
                </h3>
                <p className="font-body text-[#0c2940]/90 text-sm sm:text-base leading-relaxed">
                  One-on-one guidance for leaders who want to use AI strategically and lead their teams through adoption.
                </p>
              </div>
              <div className="pt-6">
                <button
                  onClick={() => openBooking('discovery')}
                  className="text-xs font-semibold text-amber-700 hover:text-amber-900 inline-flex items-center gap-1 font-h2 group cursor-pointer"
                >
                  <span>Schedule 1-on-1 guidance</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Card 3: Workshops & Speaking */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 p-6 sm:p-8 flex flex-col justify-between border-t-4 border-t-amber-800">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-orange-50 text-amber-800 flex items-center justify-center">
                  <Mic className="w-6 h-6 stroke-[1.75]" />
                </div>
                <h3 className="font-h2 text-xl sm:text-2xl font-bold text-[#0c2940] tracking-tight">
                  Workshops &amp; Speaking
                </h3>
                <p className="font-body text-[#0c2940]/90 text-sm sm:text-base leading-relaxed">
                  Keynotes, half-day intensives, and multi-day workshops for conferences, associations, and organizations.
                </p>
              </div>
              <div className="pt-6">
                <button
                  onClick={() => openBooking('speaking')}
                  className="text-xs font-semibold text-amber-800 hover:text-amber-950 inline-flex items-center gap-1 font-h2 group cursor-pointer"
                >
                  <span>Book keynote or intensive</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: MEET PAIGE (Portrait at ~40% width + Bio + Stat Strip)
          Matching Screenshot 3 with subtle botanical wallpaper pattern
          ========================================================================= */}
      <section id="about" className="relative w-full overflow-hidden bg-[#fafbfc] py-16 sm:py-24 px-4 sm:px-8 lg:px-12 border-b border-slate-200/60">
        <div className="absolute inset-0 bg-[url('/Public/BG.png')] bg-cover bg-center opacity-40" aria-hidden="true" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-14">
            {/* Left Column: Portrait at ~40% width (under half column, 4:5 ratio) */}
            <div className="w-full sm:w-4/5 md:w-3/5 lg:w-[38%] max-w-[420px] shrink-0">
              <div className="relative group overflow-hidden rounded-2xl shadow-xl border border-slate-200/80 bg-white">
                <img
                  src={portraitSrc}
                  alt="Paige Bradbury - CEO and Principal Learning Architect of The Bradbury Group"
                  referrerPolicy="no-referrer"
                  className="w-full aspect-[4/5] object-cover object-top hover:scale-[1.02] transition-transform duration-500"
                />
                {/* Subtle caption overlay badge for context */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0c2940]/80 via-[#0c2940]/40 to-transparent p-4 text-white">
                  <p className="font-h2 text-sm font-semibold">Paige Bradbury</p>
                  <p className="font-body text-xs text-slate-200">
                    CEO &amp; Principal Learning Architect
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Bio beside portrait */}
            <div className="w-full lg:w-[62%] flex flex-col justify-center space-y-6">
              <div>
                <span className="inline-block px-3 py-1 bg-[#0c2940]/10 text-[#0c2940] text-xs font-bold uppercase tracking-wider rounded-xs font-h2 mb-3">
                  MEET PAIGE
                </span>
                <h2 className="font-h2 text-3xl sm:text-4xl md:text-[42px] font-bold text-[#0c2940] tracking-tight leading-tight">
                  Meet Paige Bradbury
                </h2>
              </div>

              {/* Bio Paragraph 1 */}
              <p className="font-body text-base sm:text-lg text-[#0c2940]/90 leading-relaxed font-normal">
                Paige Bradbury is the CEO and Principal Learning Architect of The Bradbury Group. She started her career as a broadcast journalist and CNN Radio correspondent, then spent more than 20 years leading international, cross-cultural training for public, private, and nonprofit organizations.
              </p>

              {/* Bio Paragraph 2 */}
              <p className="font-body text-base sm:text-lg text-[#0c2940]/90 leading-relaxed font-normal">
                Today she helps learning professionals, executives, and teams move from AI curiosity to measurable results, using evidence-based learning design instead of tool hype.
              </p>

              {/* Stat Strip:
                  "20+ years in international training · Former CNN Radio correspondent · Key stakeholder, Georgia AI Alliance"
                  Flag strictly adhered to: 20+ used; 85%+ and $25K+ cost avoidance omitted; tabs cut. */}
              <div className="pt-2">
                <div className="bg-white/90 backdrop-blur-xs border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:divide-x sm:divide-slate-300 gap-3 sm:gap-4 text-xs sm:text-sm font-medium text-[#0c2940]">
                    <div className="flex items-center gap-2 sm:pr-4">
                      <span className="w-2 h-2 rounded-full bg-[#f8c51c] shrink-0"></span>
                      <span className="font-bold">20+ years</span> in international training
                    </div>
                    <div className="flex items-center gap-2 sm:px-4">
                      <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0"></span>
                      <span>Former CNN Radio correspondent</span>
                    </div>
                    <div className="flex items-center gap-2 sm:pl-4">
                      <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0"></span>
                      <span>Key stakeholder, Georgia AI Alliance</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: BOOK PAIGE (Speaking and Workshops - matching Screenshot 4)
          ========================================================================= */}
      <section id="speaking" className="w-full bg-white py-16 sm:py-24 px-4 sm:px-8 lg:px-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Column: Heading, Sub, and 2 Action Buttons */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="inline-block px-3 py-1 bg-[#0c2940]/10 text-[#0c2940] text-xs font-bold uppercase tracking-wider rounded-xs font-h2 mb-3">
                  BOOK PAIGE
                </span>
                <h2 className="font-h2 text-3xl sm:text-4xl font-bold text-[#0c2940] tracking-tight leading-tight">
                  Bring Paige to your event or team
                </h2>
              </div>

              <p className="font-body text-[#0c2940]/85 text-base sm:text-lg leading-relaxed">
                AI keynotes, workshops, and practical intensives tailored to your audience and goals.
              </p>

              {/* 2 Buttons side-by-side */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => openBooking('speaking')}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#0c2940] text-white font-bold text-xs sm:text-sm rounded-lg hover:bg-[#071d2e] active:translate-y-px transition-all shadow-sm cursor-pointer font-h2 tracking-tight"
                >
                  <Mic className="w-4 h-4 text-[#f8c51c]" />
                  <span>Book Paige to Speak</span>
                </button>

                <button
                  onClick={() => openBooking('workshop')}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white text-[#0c2940] border border-[#0c2940] font-bold text-xs sm:text-sm rounded-lg hover:bg-slate-50 active:translate-y-px transition-all shadow-xs cursor-pointer font-h2 tracking-tight"
                >
                  <Calendar className="w-4 h-4 text-[#0c2940]" />
                  <span>Request a Workshop</span>
                </button>
              </div>
            </div>

            {/* Right Column: Popular Topics (2 columns of 3 topics each) */}
            <div className="lg:col-span-7 bg-slate-50/70 rounded-2xl p-6 sm:p-8 border border-slate-200/80">
              <h3 className="font-h3 text-xl sm:text-2xl font-bold text-[#0c2940] mb-6 tracking-tight">
                Popular topics
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {/* Topic Column 1 */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3 pb-3 border-b border-slate-200">
                    <span className="w-2 h-2 rounded-full bg-teal-600 mt-2 shrink-0"></span>
                    <span className="font-body font-medium text-sm sm:text-base text-[#0c2940]">
                      Intro to AI for Small Business
                    </span>
                  </div>

                  <div className="flex items-start gap-3 pb-3 border-b border-slate-200">
                    <span className="w-2 h-2 rounded-full bg-teal-600 mt-2 shrink-0"></span>
                    <span className="font-body font-medium text-sm sm:text-base text-[#0c2940]">
                      Prompting Foundations
                    </span>
                  </div>

                  <div className="flex items-start gap-3 pb-3 border-b border-slate-200">
                    <span className="w-2 h-2 rounded-full bg-teal-600 mt-2 shrink-0"></span>
                    <span className="font-body font-medium text-sm sm:text-base text-[#0c2940]">
                      Running a Pilot Project That Scales
                    </span>
                  </div>
                </div>

                {/* Topic Column 2 */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3 pb-3 border-b border-slate-200">
                    <span className="w-2 h-2 rounded-full bg-teal-600 mt-2 shrink-0"></span>
                    <span className="font-body font-medium text-sm sm:text-base text-[#0c2940]">
                      Working with AI as a Thought Partner
                    </span>
                  </div>

                  <div className="flex items-start gap-3 pb-3 border-b border-slate-200">
                    <span className="w-2 h-2 rounded-full bg-teal-600 mt-2 shrink-0"></span>
                    <span className="font-body font-medium text-sm sm:text-base text-[#0c2940]">
                      Building an AI Assistant (2-day workshop)
                    </span>
                  </div>

                  <div className="flex items-start gap-3 pb-3 border-b border-slate-200">
                    <span className="w-2 h-2 rounded-full bg-teal-600 mt-2 shrink-0"></span>
                    <span className="font-body font-medium text-sm sm:text-base text-[#0c2940]">
                      Funding the AI Journey
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: TRUST BAND (Logos slider + 2 quotes - matching Screenshot 5)
          ========================================================================= */}
      <section className="w-full bg-[#0c2940] text-white py-14 sm:py-20 px-4 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Partner logos in a continuous slider animation */}
          <div>
            <div className="text-center mb-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 font-h2">
                Trusted by Leaders &amp; Organizations Worldwide
              </span>
            </div>
            {/* Logo Slider */}
            <LogoSlider />
          </div>

          {/* Divider Line */}
          <div className="border-t border-slate-700/60 pt-10">
            {/* 2 Quotes side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
              {/* Quote 1: Matt Richter */}
              <div className="space-y-3">
                <blockquote className="font-h2 text-xl sm:text-2xl font-normal text-white leading-snug">
                  “Paige is my go-to for AI expertise.”
                </blockquote>
                <div className="font-caption text-sm text-sky-300">
                  <span className="font-semibold text-white">Matt Richter</span> · The Thiagi Group
                </div>
              </div>

              {/* Quote 2: Chris & Rachel McCluskey */}
              <div className="space-y-3">
                <blockquote className="font-h2 text-xl sm:text-2xl font-normal text-white leading-snug">
                  “AI is the future, and Paige Bradbury is preparing us to thrive in that future.”
                </blockquote>
                <div className="font-caption text-sm text-sky-300">
                  <span className="font-semibold text-white">Chris &amp; Rachel McCluskey</span> · Professional Christian Coaching Institute
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: CLOSING CTA (matching Screenshot 6)
          Gold/Yellow band: #f8c51c with Navy button #0c2940
          ========================================================================= */}
      <section className="w-full bg-[#f8c51c] py-12 sm:py-16 px-4 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
          <h2 className="font-h2 text-2xl sm:text-3xl md:text-4xl font-bold text-[#0c2940] text-center md:text-left tracking-tight">
            Let's talk about where your team is with AI.
          </h2>

          <div className="shrink-0">
            <button
              onClick={() => openBooking('discovery')}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 bg-[#0c2940] text-white font-bold text-sm sm:text-base rounded-lg hover:bg-[#071d2e] active:translate-y-px transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer font-h2 tracking-tight"
            >
              <span>Book a Discovery Call</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </section>

      {/* Booking and Contact Modal */}
      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialType={modalType}
      />
    </div>
  );
};

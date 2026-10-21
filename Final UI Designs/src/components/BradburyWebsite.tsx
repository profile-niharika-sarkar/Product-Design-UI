import React, { useState } from 'react';
import { BRADBURY_GROUP_COMPANIES } from '../data/columbusData';
import { 
  Zap, 
  Settings, 
  Gauge, 
  Globe2, 
  Building2, 
  Award, 
  ArrowRight, 
  CheckCircle,
  BarChart3,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';

export const BradburyWebsite: React.FC = () => {
  const [targetSpeed, setTargetSpeed] = useState<number>(300); // FPM
  const [shiftHours, setShiftHours] = useState<number>(16);

  // Quick throughput calculation
  const dailyFeet = targetSpeed * 60 * shiftHours * 0.82; // 82% efficiency factor
  const annualLinearFeet = (dailyFeet * 250) / 1000000; // Million feet per year

  return (
    <div className="min-h-screen bg-[#08131d] text-slate-100 font-roboto">
      {/* Hero Banner Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#0c2940] via-[#39918d]/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0c2940] border border-[#39918d]/40 text-[#f8c51c] font-montserrat text-xs font-semibold tracking-wider uppercase">
            <Sparkles size={14} className="text-[#f8c51c]" />
            World-Class Roll Forming & Automation
          </div>

          <h1 className="font-inter font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
            Engineered Excellence in Coil Processing
          </h1>

          <p className="font-roboto text-base sm:text-lg text-slate-300 leading-relaxed">
            The Bradbury Group designs and manufactures high-performance roll forming equipment, automated leveling systems, insulated panel lines, and precision punch machinery for global leaders in manufacturing.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#machinery"
              className="px-6 py-3.5 rounded-xl bg-[#39918d] hover:bg-[#3f6d67] text-white font-montserrat font-bold text-sm shadow-xl shadow-[#39918d]/20 transition-all flex items-center gap-2"
            >
              <span>Explore Machinery Portfolio</span>
              <ArrowRight size={16} />
            </a>
            <a
              href="#analytics"
              className="px-6 py-3.5 rounded-xl bg-[#0c2940] border border-[#39918d]/40 hover:border-[#39918d] text-slate-200 font-montserrat font-semibold text-sm transition-all"
            >
              <span>C-Suite Production Benchmarks</span>
            </a>
          </div>
        </div>

        {/* Global Key Stats Grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[
            { value: '65+', label: 'Years of Engineering', sub: 'Founded 1959' },
            { value: '12', label: 'Global Operating Companies', sub: 'Worldwide manufacturing' },
            { value: '7,500+', label: 'Active Equipment Lines', sub: 'In 85+ countries' },
            { value: '350 FPM+', label: 'Continuous Line Speeds', sub: 'Sub-millimeter accuracy' }
          ].map((stat, idx) => (
            <div key={idx} className="p-5 rounded-2xl glass-card border border-[#39918d]/20 text-center space-y-1">
              <span className="font-inter font-extrabold text-2xl sm:text-3xl text-[#f8c51c] block">
                {stat.value}
              </span>
              <span className="font-montserrat font-semibold text-xs sm:text-sm text-white block">
                {stat.label}
              </span>
              <span className="font-caption text-[11px] text-slate-400 block">
                {stat.sub}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Machinery Portfolio & Solutions */}
      <section id="machinery" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#39918d]/20">
        <div className="mb-12 text-center space-y-2">
          <span className="font-montserrat font-bold text-xs uppercase tracking-widest text-[#39918d]">
            Machinery & Systems
          </span>
          <h2 className="font-montserrat font-bold text-2xl sm:text-4xl text-white">
            Custom Industrial Roll Forming Solutions
          </h2>
          <p className="font-roboto text-sm text-slate-400 max-w-2xl mx-auto">
            From heavy-gauge structural steel deck lines to ultra-high-speed steel stud and track systems, Bradbury delivers customized production power.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Automated Roll Forming Lines',
              desc: 'Continuous roll forming equipment engineered for rapid gauge changes, variable widths, and automated flying cutoff shears.',
              specs: '0.012" - 0.500" steel thickness',
              icon: Gauge
            },
            {
              title: 'Coil Processing & Leveling',
              desc: 'High-yield e-drive levelers, uncoilers, and slitting lines designed to relieve internal coil stress and eliminate panel bow.',
              specs: 'Up to 100,000 PSI yield strength',
              icon: Settings
            },
            {
              title: 'Insulated Metal Panel Systems',
              desc: 'Turnkey continuous mineral wool and polyurethane foam insulated wall and roof panel manufacturing plants.',
              specs: 'Automated 120m continuous lines',
              icon: Layers
            }
          ].map((card, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl glass-card border border-[#39918d]/20 hover:border-[#39918d]/60 transition-all duration-300 space-y-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0c2940] border border-[#39918d]/40 text-[#f8c51c] flex items-center justify-center group-hover:scale-110 transition-transform">
                <card.icon size={24} />
              </div>

              <h3 className="font-montserrat font-bold text-lg text-white group-hover:text-[#39918d] transition-colors">
                {card.title}
              </h3>

              <p className="font-roboto text-xs sm:text-sm text-slate-300 leading-relaxed">
                {card.desc}
              </p>

              <div className="pt-2 border-t border-[#39918d]/15 flex items-center justify-between text-xs font-montserrat font-medium text-[#39918d]">
                <span>{card.specs}</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* C-Suite Operations & Interactive Production Throughput Calculator */}
      <section id="analytics" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#39918d]/20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-5">
            <span className="font-montserrat font-bold text-xs uppercase tracking-widest text-[#f8c51c] flex items-center gap-2">
              <BarChart3 size={16} />
              Executive Decision Tools
            </span>
            <h2 className="font-montserrat font-bold text-2xl sm:text-3xl text-white">
              C-Suite Roll Forming Throughput & ROI Modeling
            </h2>
            <p className="font-roboto text-sm text-slate-300 leading-relaxed">
              Estimate potential annual output and operational gains when upgrading to automated Bradbury Group high-speed coil processing equipment.
            </p>

            <div className="space-y-3 pt-2">
              {[
                'Sub-millimeter profile accuracy minimizes raw coil scrap',
                'Integrated Beck Automation controls reduce operator downtime by 40%',
                'Instant changeover technology maximizes multi-shift profitability'
              ].map((point, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle size={16} className="text-[#39918d] shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 p-6 rounded-2xl glass-card border border-[#39918d]/30 space-y-6">
            <div className="flex items-center justify-between border-b border-[#39918d]/20 pb-4">
              <h3 className="font-montserrat font-bold text-base text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-[#f8c51c]" />
                Throughput Estimator
              </h3>
              <span className="px-2.5 py-1 rounded-full bg-[#0c2940] border border-[#39918d]/30 text-[#39918d] font-montserrat text-xs font-semibold">
                Interactive Model
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Target Line Speed Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-montserrat font-medium text-slate-300">
                  <span>Target Line Speed</span>
                  <span className="text-[#f8c51c] font-bold">{targetSpeed} FPM</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="500"
                  step="10"
                  value={targetSpeed}
                  onChange={(e) => setTargetSpeed(Number(e.target.value))}
                  className="w-full accent-[#39918d] cursor-pointer"
                />
                <p className="font-caption text-[11px] text-slate-400">
                  Feet Per Minute continuous output
                </p>
              </div>

              {/* Operating Shift Hours */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-montserrat font-medium text-slate-300">
                  <span>Daily Shift Duration</span>
                  <span className="text-[#f8c51c] font-bold">{shiftHours} Hours</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="24"
                  step="2"
                  value={shiftHours}
                  onChange={(e) => setShiftHours(Number(e.target.value))}
                  className="w-full accent-[#39918d] cursor-pointer"
                />
                <p className="font-caption text-[11px] text-slate-400">
                  Daily production operating window
                </p>
              </div>
            </div>

            {/* Calculated Output Display */}
            <div className="p-4 rounded-xl bg-[#081827] border border-[#39918d]/30 grid grid-cols-2 gap-4 text-center">
              <div>
                <span className="font-caption text-xs text-slate-400 block">Daily Production</span>
                <span className="font-inter font-bold text-xl sm:text-2xl text-white">
                  {Math.round(dailyFeet).toLocaleString()} <span className="text-xs text-[#39918d]">FT</span>
                </span>
              </div>
              <div>
                <span className="font-caption text-xs text-slate-400 block">Annual Volume</span>
                <span className="font-inter font-bold text-xl sm:text-2xl text-[#f8c51c]">
                  {annualLinearFeet.toFixed(1)} <span className="text-xs text-[#39918d]">M FT</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Group Companies Matrix */}
      <section id="companies" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#39918d]/20">
        <div className="mb-10 text-center space-y-2">
          <span className="font-montserrat font-bold text-xs uppercase tracking-widest text-[#39918d]">
            Global Synergy
          </span>
          <h2 className="font-montserrat font-bold text-2xl sm:text-3xl text-white">
            The Bradbury Group Companies
          </h2>
          <p className="font-roboto text-sm text-slate-400 max-w-xl mx-auto">
            A worldwide network of specialized machinery manufacturers delivering integrated coil processing solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BRADBURY_GROUP_COMPANIES.map((company, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl glass-card border border-[#39918d]/20 hover:border-[#39918d]/50 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-montserrat font-bold text-sm text-white">
                  {company.name}
                </h3>
                <span className="px-2 py-0.5 rounded bg-[#081827] text-[10px] font-roboto text-[#39918d]">
                  {company.location}
                </span>
              </div>
              <p className="font-roboto text-xs text-slate-300">
                {company.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Corporate Footer */}
      <footer id="global" className="bg-[#040b12] border-t border-[#39918d]/20 py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <span className="font-inter font-bold text-sm text-white block">
              THE BRADBURY GROUP
            </span>
            <p className="font-roboto text-slate-400">
              World Headquarters: 1200 E. Cole Street, Moundridge, Kansas 67107 USA
            </p>
          </div>

          <div className="flex items-center gap-6 font-montserrat text-xs">
            <a href="#machinery" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#machinery" className="hover:text-white transition-colors">Enterprise Terms</a>
            <a href="#machinery" className="hover:text-white transition-colors">Global Offices</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

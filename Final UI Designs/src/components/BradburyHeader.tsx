import React from 'react';
import { Shield, ChevronDown, Phone, Globe, Lock } from 'lucide-react';

export const BradburyHeader: React.FC = () => {
  return (
    <header className="w-full bg-[#08131d]/90 backdrop-blur-md border-b border-[#39918d]/20 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0c2940] via-[#39918d] to-[#3f6d67] border border-[#39918d]/50 flex items-center justify-center text-[#f8c51c] font-inter font-extrabold text-xl shadow-lg shadow-[#39918d]/20">
            B
          </div>
          <div>
            <span className="font-inter font-extrabold text-lg sm:text-xl tracking-tight text-white block leading-tight">
              THE BRADBURY GROUP
            </span>
            <span className="font-montserrat text-[11px] text-[#39918d] tracking-wider uppercase font-medium block">
              Global Roll Forming & Machinery
            </span>
          </div>
        </div>

        {/* Corporate Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 font-montserrat text-xs font-medium text-slate-300">
          <a href="#machinery" className="hover:text-[#39918d] transition-colors flex items-center gap-1">
            <span>Roll Forming Equipment</span>
            <ChevronDown size={14} className="text-slate-500" />
          </a>
          <a href="#companies" className="hover:text-[#39918d] transition-colors">
            Group Companies
          </a>
          <a href="#analytics" className="hover:text-[#39918d] transition-colors">
            C-Suite Operations
          </a>
          <a href="#global" className="hover:text-[#39918d] transition-colors">
            Global Locations
          </a>
        </nav>

        {/* Right Header Status Bar & Portal Badge */}
        <div className="flex items-center gap-4 pr-16 sm:pr-24 lg:pr-32">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0c2940] border border-[#39918d]/30 text-xs font-roboto text-slate-300">
            <Lock size={12} className="text-[#f8c51c]" />
            <span className="font-medium text-white">Executive Portal</span>
          </div>
        </div>
      </div>
    </header>
  );
};

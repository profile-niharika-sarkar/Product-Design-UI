import React, { useState } from 'react';
import { CHECKLIST_ITEMS } from '../data/columbusData';
import { AIPulseAvatar } from './AIPulseAvatar';
import { CheckCircle2, Lock, ArrowLeft, Mic, Sparkles, Check } from 'lucide-react';

interface ScreenTwoHeadsUpProps {
  onBack: () => void;
  onStartTalk: () => void;
}

export const ScreenTwoHeadsUp: React.FC<ScreenTwoHeadsUpProps> = ({ onBack, onStartTalk }) => {
  const [agreed, setAgreed] = useState<boolean>(false);

  const handleCheckboxToggle = () => {
    setAgreed(prev => !prev);
  };

  const handleKeyDownCheckbox = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleCheckboxToggle();
    }
  };

  const handleReadyClick = () => {
    if (!agreed) return;
    try {
      localStorage.setItem('columbus_prep_consent', JSON.stringify({
        agreed: true,
        timestamp: new Date().toISOString()
      }));
    } catch {
      // Fallback if localStorage disabled
    }
    onStartTalk();
  };

  return (
    <div className="flex flex-col h-full text-[#0c2940] justify-between">
      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto space-y-3.5 sm:space-y-4 pr-1 pb-3">
        {/* Top Title & Columbus Avatar with Mic Animation */}
        <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-4 pb-3 border-b border-[#E6EAF0]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-montserrat font-semibold text-[#39918d] tracking-wide">
              <Sparkles size={11} className="text-[#f8c51c]" />
              SESSION PREPARATION
            </div>
            <h2 className="font-montserrat font-bold text-lg sm:text-xl md:text-2xl text-[#0c2940] tracking-tight leading-snug">
              A Quick Heads-Up Before We Talk
            </h2>
            <p className="font-roboto text-xs text-[#5C6B78] leading-relaxed">
              Please review the session parameters below prior to initiating your C-Suite briefing.
            </p>
          </div>

          {/* Columbus Avatar - Scaled on mobile */}
          <div className="shrink-0 flex items-center pt-1 sm:pt-0">
            <AIPulseAvatar size="md" showMicBadge={true} micAnimated={true} isListening={true} />
          </div>
        </div>

        {/* Checklist Rows with Circular Success Icons */}
        <div className="space-y-2">
          {CHECKLIST_ITEMS.map((item) => (
            <div
              key={item.id}
              className="p-2.5 sm:p-3 rounded-xl bg-[#F8F9FA] border border-[#E6EAF0] hover:border-slate-300 transition-all flex items-start justify-between gap-2.5 sm:gap-3 group"
            >
              <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
                <div className="mt-0.5 text-[#39918d] shrink-0">
                  <CheckCircle2 size={18} className="stroke-[2.2]" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-montserrat font-semibold text-xs sm:text-sm text-[#0c2940]">
                    {item.title}
                  </h3>
                  <p className="font-roboto text-xs text-[#5C6B78] leading-snug">
                    {item.description}
                  </p>
                </div>
              </div>

              {item.badge && (
                <span className="shrink-0 px-2 py-0.5 rounded-md bg-white border border-[#E6EAF0] text-[#39918d] font-roboto text-[10px] font-semibold whitespace-nowrap">
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Premium Privacy Notice Card */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-[#F8F9FA] border border-[#39918d]/30 text-[#0c2940] relative overflow-hidden">
          <div className="flex items-start gap-2.5 sm:gap-3">
            <div className="p-2 rounded-lg bg-[#39918d]/10 text-[#39918d] shrink-0 mt-0.5">
              <Lock size={16} className="stroke-[2]" />
            </div>
            <div className="space-y-1 min-w-0">
              <h3 className="font-montserrat font-semibold text-xs uppercase tracking-wider text-[#0c2940]">
                Privacy Consent & Security Assurance
              </h3>
              <p className="font-roboto text-xs text-[#5C6B78] leading-relaxed">
                Your voice inputs and text responses are processed under The Bradbury Group's Enterprise NDA & Data Protection Policy. Session data is encrypted and strictly isolated—it is never utilized for public model training.
              </p>
            </div>
          </div>

          {/* Checkbox Consent Option with Full Keyboard Accessibility */}
          <div className="mt-3 pt-2.5 border-t border-[#E6EAF0]">
            <div
              role="checkbox"
              aria-checked={agreed}
              aria-label="I Agree to the session terms and privacy policy"
              tabIndex={0}
              onClick={handleCheckboxToggle}
              onKeyDown={handleKeyDownCheckbox}
              className="flex items-start sm:items-center gap-2.5 cursor-pointer select-none group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#39918d] focus-visible:ring-offset-1 rounded-md p-0.5"
            >
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 mt-0.5 sm:mt-0 ${
                  agreed
                    ? 'bg-[#39918d] border-[#39918d] text-white shadow-xs'
                    : 'bg-white border-slate-300 group-hover:border-[#39918d]'
                }`}
              >
                {agreed && <Check size={14} className="stroke-[3]" />}
              </div>
              <span className="font-montserrat font-semibold text-xs text-[#0c2940] leading-snug">
                I Agree to the session terms and privacy policy
              </span>
            </div>
          </div>
        </div>

        {/* Mic Status Indicator */}
        <div className="flex items-center justify-center gap-2 py-1.5 px-3 text-xs font-roboto text-[#39918d] bg-[#F8F9FA] rounded-lg border border-[#E6EAF0]">
          <Mic size={14} className="text-[#39918d] animate-pulse shrink-0" />
          <span className="text-[#5C6B78] truncate">Audio calibrated for interactive discussion</span>
        </div>
      </div>

      {/* Permanently Sticky Footer Container */}
      <footer aria-label="Prep step navigation controls" className="pt-3 border-t border-[#E6EAF0] bg-white sticky bottom-0 z-20 flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 shadow-xs">
        {/* Secondary Ghost Button */}
        <button
          onClick={onBack}
          aria-label="Back to Expectations"
          className="w-full sm:w-auto px-4 h-12 sm:h-[52px] rounded-[14px] border border-[#E6EAF0] hover:border-slate-400 text-[#0c2940] font-roboto text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 shrink-0 cursor-pointer bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#39918d]"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        {/* Large Primary CTA - State-Driven Functionality */}
        <button
          onClick={handleReadyClick}
          disabled={!agreed}
          aria-disabled={!agreed}
          aria-label="I'm Ready — Let's Talk"
          className={`w-full flex-1 h-12 sm:h-[52px] px-6 rounded-[14px] text-white font-montserrat font-semibold text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#39918d] focus-visible:ring-offset-2 ${
            agreed
              ? 'bg-[#39918d] hover:bg-[#3f6d67] opacity-100 cursor-pointer shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.99]'
              : 'bg-[#39918d] opacity-40 cursor-not-allowed shadow-none'
          }`}
        >
          <Mic size={18} className={agreed ? 'text-[#f8c51c]' : 'text-white/70'} />
          <span>I'm Ready — Let's Talk</span>
        </button>
      </footer>
    </div>
  );
};


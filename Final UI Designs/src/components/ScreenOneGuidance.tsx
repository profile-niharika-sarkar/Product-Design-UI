import React, { useState } from 'react';
import { EXPANDABLE_SECTIONS } from '../data/columbusData';
import { AIPulseAvatar } from './AIPulseAvatar';
import { 
  HelpCircle, 
  Cpu, 
  ShieldCheck, 
  Sliders, 
  ChevronDown, 
  ArrowRight, 
  Sparkles,
  Info
} from 'lucide-react';

interface ScreenOneGuidanceProps {
  onNext: () => void;
}

export const ScreenOneGuidance: React.FC<ScreenOneGuidanceProps> = ({ onNext }) => {
  // Only one section expands at a time
  const [openSectionId, setOpenSectionId] = useState<string>('ask-about');

  const getLineIcon = (iconName: string) => {
    const props = { size: 18, className: "text-[#39918d] shrink-0 stroke-[2]" };
    switch (iconName) {
      case 'HelpCircle':
        return <HelpCircle {...props} />;
      case 'Cpu':
        return <Cpu {...props} />;
      case 'ShieldCheck':
        return <ShieldCheck {...props} />;
      case 'Sliders':
        return <Sliders {...props} />;
      default:
        return <HelpCircle {...props} />;
    }
  };

  const toggleSection = (id: string) => {
    setOpenSectionId(prev => (prev === id ? '' : id));
  };

  return (
    <div className="flex flex-col h-full justify-between text-[#0c2940]">
      {/* Scrollable Main Content */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-3">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-3 sm:gap-4 pb-3 border-b border-[#E6EAF0]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F8F9FA] border border-[#E6EAF0] text-[#0c2940] text-[11px] font-montserrat font-semibold tracking-wide">
              <ShieldCheck size={12} className="text-[#39918d]" />
              Private. Secure. Executive Conversations.
            </div>
            <h1 className="font-inter font-extrabold text-2xl sm:text-3xl text-[#0c2940] tracking-tight leading-tight">
              Hi! I'm Columbus.
            </h1>
            <h2 className="font-montserrat font-medium text-[#39918d] text-sm sm:text-base">
              An AI Voice Assistant for The Bradbury Group.
            </h2>
          </div>

          {/* Columbus Orb Avatar */}
          <div className="shrink-0 pt-1">
            <AIPulseAvatar size="md" showMicBadge={true} micAnimated={true} />
          </div>
        </div>

        {/* Intro Subtitle / Context Box */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E6EAF0] flex items-start gap-2.5 sm:gap-3 shadow-xs">
          <Info size={18} className="text-[#39918d] shrink-0 mt-0.5" />
          <p className="font-roboto text-xs sm:text-sm text-[#5C6B78] leading-relaxed">
            Designed for executive decision-makers to streamline equipment inquiries, analyze roll forming throughput parameters, and coordinate C-Suite strategic alignment.
          </p>
        </div>

        {/* Expandable Cards List */}
        <div>
          <h3 className="font-montserrat font-semibold text-xs uppercase tracking-wider text-[#5C6B78] mb-2.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f8c51c]" />
            What You Can Expect
          </h3>

          <div className="space-y-2.5">
            {EXPANDABLE_SECTIONS.map((section) => {
              const isOpen = openSectionId === section.id;
              return (
                <div
                  key={section.id}
                  className={`rounded-xl transition-all duration-300 border ${
                    isOpen
                      ? 'bg-white border-[#39918d] shadow-md shadow-[#39918d]/10'
                      : 'bg-[#F8F9FA] border-[#E6EAF0] hover:border-[#39918d]/50 hover:bg-white'
                  }`}
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full p-3 sm:p-3.5 flex items-center justify-between text-left gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#39918d] rounded-xl group cursor-pointer"
                    aria-expanded={isOpen}
                    aria-controls={`accordion-body-${section.id}`}
                    id={`accordion-header-${section.id}`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div className={`p-2 rounded-lg transition-colors shrink-0 ${isOpen ? 'bg-[#39918d]/15 text-[#39918d]' : 'bg-white border border-[#E6EAF0] text-[#39918d]'}`}>
                        {getLineIcon(section.iconName)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-montserrat font-semibold text-xs sm:text-sm text-[#0c2940] group-hover:text-[#39918d] transition-colors truncate">
                          {section.title}
                        </h3>
                        <p className="font-caption text-[11px] text-[#5C6B78] truncate">
                          {section.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className={`p-1 rounded-full text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#39918d] bg-[#39918d]/10' : 'group-hover:text-[#0c2940]'}`}>
                      <ChevronDown size={16} />
                    </div>
                  </button>

                  {/* Animated Expand Content */}
                  {isOpen && (
                    <div
                      id={`accordion-body-${section.id}`}
                      role="region"
                      aria-labelledby={`accordion-header-${section.id}`}
                      className="px-3.5 sm:px-4 pb-3.5 pt-1 border-t border-slate-100 animate-fadeIn"
                    >
                      <p className="font-roboto text-xs sm:text-sm text-[#5C6B78] leading-relaxed pl-0 sm:pl-10">
                        {section.content}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Permanently Sticky Bottom Footer */}
      <footer aria-label="Expectations step navigation controls" className="pt-3 border-t border-[#E6EAF0] bg-white sticky bottom-0 z-20 flex items-center justify-between gap-3 shrink-0">
        <span className="font-caption text-xs text-[#5C6B78] hidden sm:inline-block italic font-sans">
          Step 1 of 3
        </span>

        <button
          onClick={onNext}
          aria-label="Continue to Prep"
          className="w-full sm:w-auto ml-auto px-6 h-12 sm:h-[52px] rounded-[14px] bg-[#39918d] hover:bg-[#3f6d67] text-white font-montserrat font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#39918d]"
        >
          <span>Continue to Prep</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </footer>
    </div>
  );
};


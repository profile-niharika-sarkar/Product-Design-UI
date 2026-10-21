import React, { useState, useEffect } from 'react';
import { ColumbusScreen } from '../types';
import { ScreenOneGuidance } from './ScreenOneGuidance';
import { ScreenTwoHeadsUp } from './ScreenTwoHeadsUp';
import { ScreenThreeConversation } from './ScreenThreeConversation';
import { AIPulseAvatar } from './AIPulseAvatar';
import { Check, Mic, Maximize2 } from 'lucide-react';

export const ColumbusWidgetCard: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [currentScreen, setCurrentScreen] = useState<ColumbusScreen>('screen1');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleNextToPrep = () => {
    setCurrentScreen('screen2');
  };

  const handleBackToGuidance = () => {
    setCurrentScreen('screen1');
  };

  const handleStartTalk = () => {
    setCurrentScreen('conversation');
  };

  return (
    <div className="relative z-50 transition-all duration-300">
      {/* Minimized Floating Trigger Pill */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Columbus AI Voice Assistant"
          className="group relative bg-white px-4 py-3 rounded-[20px] border border-[#E6EAF0] shadow-xl hover:border-[#39918d] transition-all duration-300 flex items-center gap-3 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#39918d]"
        >
          <div className="flex items-center gap-3">
            <AIPulseAvatar size="sm" showMicBadge={true} micAnimated={true} />

            <div className="text-left hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-montserrat font-bold text-xs sm:text-sm text-[#0c2940] group-hover:text-[#39918d] transition-colors">
                  Columbus AI
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-[#39918d]/10 text-[#39918d] font-roboto text-[10px] font-semibold">
                  C-SUITE
                </span>
              </div>
              <p className="font-roboto text-[11px] text-[#5C6B78] flex items-center gap-1">
                <Mic size={10} className="text-[#39918d]" />
                Talk to Assistant
              </p>
            </div>

            <div className="p-1.5 rounded-full bg-[#F8F9FA] text-[#5C6B78] group-hover:text-[#0c2940] transition-colors">
              <Maximize2 size={14} />
            </div>
          </div>
        </button>
      ) : (
        /* Standalone Columbus AI Floating Assistant Modal Component */
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Columbus AI Voice Assistant"
          id="columbus-dialog"
          className="w-full h-full max-sm:fixed max-sm:inset-0 max-sm:z-50 max-sm:rounded-none max-sm:border-0 sm:w-[90vw] sm:max-w-[520px] sm:h-[90vh] sm:max-h-[740px] lg:w-[520px] lg:h-[740px] bg-white rounded-[20px] border border-[#E6EAF0] p-4 sm:p-5 md:p-6 shadow-2xl shadow-[#0c2940]/12 flex flex-col relative overflow-hidden transition-all duration-300 animate-fadeIn pb-[calc(1rem+env(safe-area-inset-bottom))]"
        >
          {/* Subtle warm top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0c2940] via-[#39918d] to-[#f8c51c]" />

          {/* Header Bar Navigation & Step Progress */}
          <header className="flex items-center justify-between pb-3 mb-2 border-b border-[#E6EAF0] relative z-20 shrink-0 bg-white">
            {/* Step Progress Navigation Bar */}
            <nav aria-label="Assistant Setup Progress" className="flex items-center gap-1 sm:gap-2">
              {/* Step 1 Pill */}
              <button
                onClick={() => setCurrentScreen('screen1')}
                aria-label="Step 1 Expectations"
                aria-current={currentScreen === 'screen1' ? 'step' : undefined}
                className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 min-h-[44px] rounded-full text-[11px] sm:text-xs font-montserrat transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#39918d] ${
                  currentScreen === 'screen1'
                    ? 'border border-[#39918d] bg-[#39918d]/10 text-[#39918d] font-semibold shadow-xs'
                    : currentScreen === 'screen2' || currentScreen === 'conversation'
                    ? 'bg-[#F8F9FA] text-[#39918d] font-medium border border-[#E6EAF0]'
                    : 'text-[#5C6B78] opacity-60 hover:opacity-100'
                }`}
              >
                {currentScreen === 'screen2' || currentScreen === 'conversation' ? (
                  <Check size={12} className="stroke-[3] text-[#39918d]" />
                ) : (
                  <span className="font-semibold text-[11px]">①</span>
                )}
                <span>Expectations</span>
              </button>

              <span className="text-[#E6EAF0] text-xs font-light" aria-hidden="true">/</span>

              {/* Step 2 Pill */}
              <button
                onClick={() => setCurrentScreen('screen2')}
                aria-label="Step 2 Prep"
                aria-current={currentScreen === 'screen2' ? 'step' : undefined}
                className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 min-h-[44px] rounded-full text-[11px] sm:text-xs font-montserrat transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#39918d] ${
                  currentScreen === 'screen2'
                    ? 'border border-[#39918d] bg-[#39918d]/10 text-[#39918d] font-semibold shadow-xs'
                    : currentScreen === 'conversation'
                    ? 'bg-[#F8F9FA] text-[#39918d] font-medium border border-[#E6EAF0]'
                    : 'text-[#5C6B78] opacity-60 hover:opacity-100'
                }`}
              >
                {currentScreen === 'conversation' ? (
                  <Check size={12} className="stroke-[3] text-[#39918d]" />
                ) : (
                  <span className="font-semibold text-[11px]">②</span>
                )}
                <span>Prep</span>
              </button>

              <span className="text-[#E6EAF0] text-xs font-light" aria-hidden="true">/</span>

              {/* Step 3 Pill */}
              <button
                onClick={() => setCurrentScreen('conversation')}
                aria-label="Step 3 Talk"
                aria-current={currentScreen === 'conversation' ? 'step' : undefined}
                className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 min-h-[44px] rounded-full text-[11px] sm:text-xs font-montserrat transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#39918d] ${
                  currentScreen === 'conversation'
                    ? 'border border-[#39918d] bg-[#39918d]/10 text-[#39918d] font-semibold shadow-xs'
                    : 'text-[#5C6B78] opacity-60 hover:opacity-100'
                }`}
              >
                <span className="font-semibold text-[11px]">③</span>
                <span>Talk</span>
              </button>
            </nav>

            {/* Minimize and Close Buttons */}
            <div className="flex items-center gap-1 text-[#5C6B78]">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:text-[#0c2940] hover:bg-[#F8F9FA] transition-colors cursor-pointer font-bold text-lg leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#39918d]"
                title="Minimize Columbus"
                aria-label="Minimize Columbus"
              >
                —
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:text-[#0c2940] hover:bg-[#F8F9FA] transition-colors cursor-pointer font-bold text-lg leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#39918d]"
                title="Close Assistant"
                aria-label="Close Assistant"
              >
                ×
              </button>
            </div>
          </header>

          {/* Dynamic Card Screen Body with smooth fade & slide */}
          <main className="relative z-10 flex-1 overflow-hidden transition-all duration-300 ease-in-out">
            {currentScreen === 'screen1' && (
              <div className="h-full animate-fadeIn">
                <ScreenOneGuidance onNext={handleNextToPrep} />
              </div>
            )}

            {currentScreen === 'screen2' && (
              <div className="h-full animate-fadeIn">
                <ScreenTwoHeadsUp
                  onBack={handleBackToGuidance}
                  onStartTalk={handleStartTalk}
                />
              </div>
            )}

            {currentScreen === 'conversation' && (
              <div className="h-full animate-fadeIn">
                <ScreenThreeConversation onBackToPrep={() => setCurrentScreen('screen2')} />
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
};



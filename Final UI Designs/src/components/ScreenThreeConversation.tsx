import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { QUICK_PROMPTS } from '../data/columbusData';
import { AIPulseAvatar } from './AIPulseAvatar';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Download, 
  ArrowLeft,
  ShieldCheck,
  Pause,
  Square,
  Play,
  Wifi
} from 'lucide-react';

interface ScreenThreeConversationProps {
  onBackToPrep: () => void;
}

export const ScreenThreeConversation: React.FC<ScreenThreeConversationProps> = ({ onBackToPrep }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'columbus',
      text: "Greetings. I'm Columbus. We are beginning your AI readiness conversation. I will walk you through 5 executive AI readiness questions regarding your equipment requirements, throughput goals, and technical specifications.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(true);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(1);
  const [micDeniedMessage, setMicDeniedMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const questionsList = [
    "What are your primary operational throughput goals for roll forming machinery?",
    "What metal gauge range and coil specifications do your lines process?",
    "What automation level and stacking solutions are required for your factory footprint?",
    "What is your target capital expenditure timeline for new equipment installation?",
    "Who are the key executive stakeholders participating in final technical sign-off?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const speakText = (text: string) => {
    if (!speechEnabled || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium')));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Request Microphone permissions via browser MediaDevices API
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          setMicDeniedMessage(null);
          // Stream acquired successfully, stop tracks so WebSpeech/Recorder can use mic
          stream.getTracks().forEach(track => track.stop());
          startSpeechRecognition();
        })
        .catch((err) => {
          console.warn('Microphone permission denied or unavailable:', err);
          setIsListening(false);
          setMicDeniedMessage(
            "Microphone access is required for voice conversation. You can enable it in your browser settings or continue with text input."
          );
        });
    } else {
      startSpeechRecognition();
    }
  }, []);

  const startSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
          if (event.results[0].isFinal) {
            handleSendMessage(transcript);
          }
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setMicDeniedMessage(
            "Microphone access is required for voice conversation. You can enable it in your browser settings or continue with text input."
          );
        }
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        if (isListening && !isPaused) {
          try {
            recognitionRef.current?.start();
          } catch {
            setIsListening(false);
          }
        }
      };

      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const toggleMicListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        setIsListening(true);
        setIsPaused(false);
        recognitionRef.current.start();
      } catch (err) {
        console.error(err);
        setIsListening(false);
      }
    }
  };

  const handlePauseToggle = () => {
    if (isPaused) {
      setIsPaused(false);
      setIsListening(true);
      try {
        recognitionRef.current?.start();
      } catch {}
    } else {
      setIsPaused(true);
      setIsListening(false);
      try {
        recognitionRef.current?.stop();
      } catch {}
    }
  };

  const handleStopConversation = () => {
    setIsListening(false);
    setIsPaused(true);
    try {
      recognitionRef.current?.stop();
    } catch {}
  };

  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = (customMessage || input).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/columbus/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages
        })
      });

      const data = await response.json();
      const replyText = data.response || "Columbus has processed your input.";

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'columbus',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      speakText(replyText);

      if (activeQuestionIndex < questionsList.length) {
        setActiveQuestionIndex(prev => prev + 1);
      }
    } catch (error) {
      console.error(error);
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'columbus',
        text: `Understood regarding "${textToSend.slice(0, 30)}...". Let's move to question ${Math.min(activeQuestionIndex + 1, 5)}: ${questionsList[Math.min(activeQuestionIndex, 4)]}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
      if (activeQuestionIndex < questionsList.length) {
        setActiveQuestionIndex(prev => prev + 1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadTranscript = () => {
    const transcriptText = messages.map(m => `[${m.timestamp}] ${m.sender.toUpperCase()}: ${m.text}`).join('\n\n');
    const blob = new Blob([transcriptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Columbus_Bradbury_Transcript_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full justify-between text-[#0c2940]">
      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 pr-1 pb-2">
        {/* Top Status & Back Control */}
        <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-[#E6EAF0]">
          <button
            onClick={onBackToPrep}
            aria-label="Back to Prep step"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#F8F9FA] border border-[#E6EAF0] text-xs font-montserrat font-semibold text-[#0c2940] hover:bg-white transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#39918d]"
          >
            <ArrowLeft size={14} />
            <span>Back to Prep</span>
          </button>

          {/* Status Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-roboto">
            <span className="flex items-center gap-1 text-[#39918d] font-medium bg-[#39918d]/10 px-2 sm:px-2.5 py-0.5 rounded-full border border-[#39918d]/20">
              <Wifi size={12} className="animate-pulse text-[#39918d]" />
              Encrypted
            </span>
            <span className="flex items-center gap-1 text-[#5C6B78] bg-[#F8F9FA] px-2 sm:px-2.5 py-0.5 rounded-full border border-[#E6EAF0]">
              <Mic size={12} className={isListening ? 'text-[#39918d] animate-pulse' : 'text-slate-400'} />
              Mic Ready
            </span>
          </div>
        </div>

        {/* Main Voice Header */}
        <div className="text-center space-y-1">
          <h2 className="font-montserrat font-bold text-base sm:text-lg md:text-xl text-[#0c2940] tracking-tight">
            Let's Begin Your AI Readiness Conversation
          </h2>
          <p className="font-roboto text-xs text-[#5C6B78] max-w-md mx-auto leading-relaxed px-1">
            Columbus will ask five executive AI readiness questions to synthesize your machinery requirements and throughput targets.
          </p>
        </div>

        {/* Non-blocking Microphone Permission Warning Banner */}
        {micDeniedMessage && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2 animate-fadeIn">
            <p className="font-roboto text-xs leading-relaxed">
              {micDeniedMessage}
            </p>
            <button
              onClick={() => {
                textInputRef.current?.focus();
              }}
              aria-label="Continue with text input"
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-montserrat font-semibold text-xs transition-colors cursor-pointer"
            >
              Continue with Text
            </button>
          </div>
        )}

        {/* Center Large Circular Microphone & Voice Waveform Animation */}
        <div className="flex flex-col items-center justify-center my-1 sm:my-2 p-3 sm:p-4 rounded-2xl bg-[#F8F9FA] border border-[#E6EAF0] relative overflow-hidden">
          {/* Soft Waveform Animation */}
          <div className="relative my-2 sm:my-3 flex items-center justify-center">
            {/* Animated Pulsing Wave Rings */}
            <div className={`absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-[#39918d]/30 ${isListening ? 'animate-ping' : ''}`} style={{ animationDuration: '3s' }} />
            <div className={`absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-[#f8c51c]/40 ${isListening ? 'animate-ping' : ''}`} style={{ animationDuration: '2s' }} />

            {/* Large Interactive AI Orb / Microphone Button */}
            <button
              onClick={toggleMicListening}
              aria-label={isListening ? 'Mute microphone' : 'Unmute microphone'}
              aria-pressed={isListening}
              className={`relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#39918d]/40 ${
                isListening
                  ? 'bg-gradient-to-tr from-[#0c2940] via-[#39918d] to-[#3f6d67] text-white ring-4 ring-[#39918d]/30 scale-105'
                  : 'bg-white border-2 border-[#E6EAF0] text-[#0c2940] hover:border-[#39918d]'
              }`}
            >
              <Mic size={28} className={isListening ? 'text-[#f8c51c] animate-pulse' : 'text-[#39918d]'} />
            </button>
          </div>

          {/* Animated Listening Status Text */}
          <div className="text-center space-y-1 mt-1" role="status">
            <p className="font-montserrat font-bold text-xs sm:text-sm text-[#0c2940] flex items-center justify-center gap-1.5">
              {isListening ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#39918d] animate-ping" />
                  <span>"I'm Listening..."</span>
                </>
              ) : isPaused ? (
                <span className="text-[#c57b4b]">Conversation Paused</span>
              ) : (
                <span>Tap Microphone to Speak</span>
              )}
            </p>
            <p className="font-caption text-[11px] text-[#5C6B78] px-2 truncate max-w-full">
              Question {activeQuestionIndex} of 5: {questionsList[activeQuestionIndex - 1]}
            </p>
          </div>
        </div>

        {/* Live Transcription / Text Feedback Field */}
        <div className="p-3 rounded-xl bg-white border border-[#E6EAF0] space-y-2">
          <div className="flex items-center justify-between text-[11px] font-montserrat font-semibold text-[#5C6B78]">
            <span>Live Transcription Log</span>
            <button
              onClick={handleDownloadTranscript}
              aria-label="Export Conversation Transcript"
              className="flex items-center gap-1 text-[#39918d] hover:underline cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#39918d]"
            >
              <Download size={12} />
              <span className="hidden sm:inline">Export Transcript</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>

          <div
            role="log"
            aria-live="polite"
            aria-label="Live Transcription Log"
            className="max-h-[100px] overflow-y-auto space-y-1.5 pr-1 font-roboto text-xs text-[#0c2940]"
          >
            {messages.slice(-3).map((m) => (
              <div key={m.id} className="p-2 rounded-lg bg-[#F8F9FA] border border-[#E6EAF0]">
                <span className="font-bold font-montserrat text-[#39918d] text-[10px] uppercase block mb-0.5">
                  {m.sender === 'columbus' ? 'Columbus AI' : 'Executive User'}
                </span>
                <p className="text-xs text-slate-700 leading-relaxed break-words">{m.text}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Manual Text Input Field Fallback */}
          <div className="pt-2 flex items-center gap-2 border-t border-[#E6EAF0]">
            <input
              ref={textInputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type answer or voice transcript..."
              aria-label="Type message to Columbus AI"
              className="flex-1 px-3 py-2 rounded-lg bg-[#F8F9FA] border border-[#E6EAF0] text-xs text-[#0c2940] placeholder-[#5C6B78] focus:outline-none focus:border-[#39918d]"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
              className="p-2 rounded-lg bg-[#39918d] hover:bg-[#3f6d67] text-white disabled:opacity-40 transition-all cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#39918d]"
            >
              <Send size={14} />
            </button>
          </div>
        </div>

        {/* Secure & Confidential Card */}
        <div className="p-2.5 sm:p-3 rounded-xl bg-[#F8F9FA] border border-[#E6EAF0] flex items-start gap-2.5">
          <ShieldCheck size={18} className="text-[#39918d] shrink-0 mt-0.5" />
          <div className="space-y-0.5 min-w-0">
            <h3 className="font-montserrat font-bold text-xs text-[#0c2940]">
              Secure & Confidential
            </h3>
            <p className="font-roboto text-[11px] text-[#5C6B78] leading-tight">
              Responses are encrypted in real time and shared only with Paige Bradbury for executive review.
            </p>
          </div>
        </div>
      </div>

      {/* Permanently Sticky Bottom Actions: Pause & Stop Conversation */}
      <footer aria-label="Conversation controls" className="pt-2.5 border-t border-[#E6EAF0] bg-white sticky bottom-0 z-20 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 shrink-0">
        <button
          onClick={handlePauseToggle}
          aria-label={isPaused ? 'Resume Conversation' : 'Pause Conversation'}
          className="w-full sm:flex-1 py-2.5 px-4 rounded-xl border border-[#E6EAF0] bg-white hover:bg-[#F8F9FA] text-[#0c2940] font-montserrat font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#39918d]"
        >
          {isPaused ? <Play size={14} className="text-[#39918d]" /> : <Pause size={14} className="text-[#c57b4b]" />}
          <span>{isPaused ? 'Resume Conversation' : 'Pause Conversation'}</span>
        </button>

        <button
          onClick={handleStopConversation}
          aria-label="Stop Conversation"
          className="w-full sm:flex-1 py-2.5 px-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-montserrat font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          <Square size={14} className="fill-red-600 text-red-600" />
          <span>Stop Conversation</span>
        </button>
      </footer>
    </div>
  );
};



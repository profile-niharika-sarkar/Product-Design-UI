import React, { useState } from "react";
import { 
  ArrowLeft, Sparkles, Send, RefreshCw, BarChart2, 
  Target, MessageSquare, Flame, CheckCircle, HelpCircle, ArrowUpRight
} from "lucide-react";
import { CreativeCampaignBrief, CampaignPlannerInput } from "../types";

interface MarketingStudioProps {
  onBack: () => void;
}

export default function MarketingStudio({ onBack }: MarketingStudioProps) {
  // Input fields state
  const [inputs, setInputs] = useState<CampaignPlannerInput>({
    brandName: "VOLT AUTOMOTIVE",
    industry: "Luxury Electric Vehicles",
    targetAudience: "Affluent urban tech-enthusiasts, ages 28-45",
    coreMessage: "Uncompromising speed, zero exhaust emissions, silent high-torque acceleration.",
    campaignTone: "Bold, intellectual, futuristic",
  });

  // AI response states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [brief, setBrief] = useState<CreativeCampaignBrief | null>({
    campaignName: "Project Silent Lightning",
    tagline: "SILENT SPEED. LOUD STATEMENTS.",
    billboardConcept: "An immersive 3D billboard presenting a matte black concept vehicle drifting silently. High-intensity back-illumination glows with electric neon violet pulses mapping real-time speed transitions. A holographic light arc projects 3 feet into physical space, indicating kinetic velocity grids.",
    additionalStrategies: [
      "Placing soundproof glass containers in dense transit spots enclosing the vehicle while a soft white hum plays to pedestrian touchpoints.",
      "Launching an automated location-specific mobile app geofence that triggers premium dynamic spatial audio through headphones near active billboard spots.",
      "Guerilla placement of glowing charger pod replicas inside major standard corporate parking structures with custom holographic parking notifications."
    ],
    conversionProjection: "By uniting the physical authority of timeslot-specific large OOH billboards with high-intensity visual color grids, we target the precise intersection of prestige and carbon neutrality. Affluent tech-enthusiasts are emotionally activated by exclusive, quiet luxury that triggers immediate social cataloging."
  });

  // Channel optimizer state variables
  const [channels, setChannels] = useState([
    { id: "ooh", name: "High Impact OOH Space", share: 40, roi: 2.4, color: "bg-teal-500" },
    { id: "social", name: "Social Content Stunts", share: 30, roi: 3.1, color: "bg-indigo-500" },
    { id: "influencer", name: "Creator Ambassador Drifts", share: 20, roi: 2.8, color: "bg-purple-500" },
    { id: "organic", name: "PR & Guerilla Activations", share: 10, roi: 4.2, color: "bg-rose-500" },
  ]);

  // Adjust channel investment allocation
  const handleBudgetShareChange = (id: string, newShare: number) => {
    setChannels(prev => {
      const updated = prev.map(ch => {
        if (ch.id === id) {
          return { ...ch, share: Math.max(0, Math.min(100, newShare)) };
        }
        return ch;
      });
      
      // Re-balance total share roughly to maintain an engaging visual structure
      const total = updated.reduce((sum, ch) => sum + ch.share, 0);
      if (total === 0) return prev;
      
      return updated.map(ch => ({
        ...ch,
        share: Math.round((ch.share / total) * 100),
      }));
    });
  };

  // Calculate dynamic ROI projections based on allocations
  const dynamicKPIs = React.useMemo(() => {
    const totalWeightedROI = channels.reduce((sum, ch) => sum + (ch.share * ch.roi), 0) / 100;
    const sloganRecall = Math.min(94, Math.round(55 + (channels.find(c => c.id === "ooh")?.share || 0) * 0.9));
    const viralityLift = Math.min(450, Math.round(80 + (channels.find(c => c.id === "social")?.share || 0) * 4.5 + (channels.find(c => c.id === "influencer")?.share || 0) * 3));
    
    return {
      averageROI: totalWeightedROI.toFixed(2),
      sloganRecall,
      viralityLift,
    };
  }, [channels]);

  // Call the server API endpoint to trigger Gemini Generative action
  const handleGenerateAIStrategy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputs.brandName || !inputs.industry || !inputs.targetAudience) {
      setError("Please fill out the critical fields: Brand Name, Industry, and Target Audience.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}. Failed to communicate with Gemini.`);
      }

      const result = await response.json();
      if (result.success && result.data) {
        setBrief(result.data);
      } else {
        throw new Error(result.error || "Failed to generate strategies safely.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during campaign brief generation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="marketing-studio-root" className="min-h-screen bg-[#07090d] text-gray-100 font-sans">
      
      {/* Top sticky visual header bar */}
      <header className="sticky top-0 z-50 bg-[#0d0f14]/90 backdrop-blur-md border-b border-gray-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <button 
            id="studio-back-btn"
            onClick={onBack}
            className="flex items-center gap-2 text-xs md:text-sm text-gray-400 hover:text-white transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Portal Slider</span>
          </button>
          
          <div className="flex items-center gap-3">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-teal-400 animate-pulse"></span>
            <span className="text-xs uppercase font-medium tracking-widest text-[#0bb7a7]">
              Creative Brand Marketing Campaign Studio
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form & Allocation Controls (5 cols) */}
        <section id="studio-controls-section" className="lg:col-span-5 flex flex-col gap-6">
          
          {/* AI Generator Control Hub */}
          <div className="bg-[#10141d] rounded-xl p-6 border border-gray-800/80 shadow-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-teal-400" />
              <h2 className="text-lg font-bold text-white">AI Strategy Engine</h2>
            </div>
            <p className="text-xs text-gray-400 mb-6 font-medium leading-relaxed">
              Connect directly to the Gemini API to formulate advanced tagline copy and physical billboard visual strategies.
            </p>

            <form onSubmit={handleGenerateAIStrategy} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">
                  Brand or Product Name
                </label>
                <input
                  id="brand-name-input"
                  type="text"
                  required
                  value={inputs.brandName}
                  onChange={(e) => setInputs(prev => ({ ...prev, brandName: e.target.value }))}
                  placeholder="e.g. VOLT MOTO"
                  className="w-full bg-[#161c28] border border-gray-800/80 rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">
                  Business Industry Domain
                </label>
                <input
                  id="brand-industry-input"
                  type="text"
                  required
                  value={inputs.industry}
                  onChange={(e) => setInputs(prev => ({ ...prev, industry: e.target.value }))}
                  placeholder="e.g. Luxury Electric Mobility"
                  className="w-full bg-[#161c28] border border-gray-800/80 rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">
                  Target Demographic Segment
                </label>
                <input
                  id="brand-audience-input"
                  type="text"
                  required
                  value={inputs.targetAudience}
                  onChange={(e) => setInputs(prev => ({ ...prev, targetAudience: e.target.value }))}
                  placeholder="e.g. Urban professionals, ages 30-45"
                  className="w-full bg-[#161c28] border border-gray-800/80 rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">
                  Core Slogan Message
                </label>
                <textarea
                  id="brand-message-input"
                  rows={2}
                  value={inputs.coreMessage}
                  onChange={(e) => setInputs(prev => ({ ...prev, coreMessage: e.target.value }))}
                  placeholder="What is the singular focus point you want our public viewer to instantly acquire?"
                  className="w-full bg-[#161c28] border border-gray-800/80 rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-teal-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">
                    Campaign Tone Preset
                  </label>
                  <select
                    id="brand-tone-select"
                    value={inputs.campaignTone}
                    onChange={(e) => setInputs(prev => ({ ...prev, campaignTone: e.target.value }))}
                    className="w-full bg-[#161c28] border border-gray-800/80 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
                  >
                    <option value="Bold and Cinematic">Bold & Cinematic</option>
                    <option value="Luxury and Minimalist">Luxury & Minimalist</option>
                    <option value="Playful and Trendsetting">Playful Trendsetter</option>
                    <option value="High-Tech and Cybernetic">High-Tech Cyber</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    id="ai-generate-submit-btn"
                    type="submit"
                    disabled={loading}
                    className="w-full h-[34px] rounded bg-[#0bb7a7] hover:bg-[#125d98] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Planning...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Formulate Brief</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {error && (
              <div className="mt-4 bg-[#230c14] border-l-2 border-red-500 p-3 rounded text-xs text-red-300">
                <p className="font-bold">Execution Interrupted</p>
                <p className="mt-1">{error}</p>
              </div>
            )}
          </div>

          {/* Marketing Channel Investment Optimizer */}
          <div className="bg-[#10141d] rounded-xl p-6 border border-gray-800/80 shadow-2xl">
            <h3 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-teal-400" />
              Budget Optimizer Sandbox
            </h3>
            <p className="text-xs text-gray-400 mb-5 leading-normal">
              Adjust investment weights dynamically to calculate predicted Conversion lift and public Slogan Recall speed.
            </p>

            <div className="space-y-4">
              {channels.map((channel) => (
                <div key={channel.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300 text-xs font-semibold">{channel.name}</span>
                    <span className="font-bold text-white">{channel.share}% share</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      id={`channel-slider-${channel.id}`}
                      type="range"
                      min="0"
                      max="100"
                      value={channel.share}
                      onChange={(e) => handleBudgetShareChange(channel.id, parseInt(e.target.value))}
                      className="w-full accent-[#0bb7a7] cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* Right Column: Dynamic Output Display Strategy Brief (7 cols) */}
        <section id="studio-results-section" className="lg:col-span-7 flex flex-col gap-6">
          
          {loading ? (
            /* Immersive Loading Screen */
            <div className="bg-[#10141d] rounded-xl p-12 border border-gray-800/80 shadow-2xl flex flex-col items-center justify-center min-h-[500px] text-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-gray-800 border-t-teal-400 animate-spin"></div>
                <Sparkles className="w-6 h-6 text-teal-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white animate-pulse">Consulting Gemini CMO Agent</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                  Synthesizing Out-Of-Home (OOH) footfall data, brand tone patterns, and demographic engagement curves into an actionable high-impact visual strategy...
                </p>
              </div>
              <div className="flex flex-col gap-1.5 text-[10px] text-[#0bb7a7] uppercase tracking-widest font-mono">
                <span>[ 1 ] Mapping location metadata...</span>
                <span className="animate-pulse">[ 2 ] Creating memorable billboard slogan...</span>
                <span className="opacity-50">[ 3 ] Formulating ambient experiential stunts...</span>
              </div>
            </div>
          ) : brief ? (
            /* Complete Generated Campaign Brief Output */
            <div className="space-y-6">
              
              {/* BRAND HEADLINE CARD */}
              <div className="bg-[#10141d] rounded-xl p-6 border border-[#0bb7a7]/30 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                  <Flame className="w-32 h-32 text-teal-400" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-teal-950 text-teal-400 px-2.5 py-1 rounded">
                    Active Brand Launch Strategy
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">
                    ID: {inputs.brandName.slice(0, 4).toUpperCase()}-OOH
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-white italic tracking-tight uppercase">
                  {brief.campaignName}
                </h2>
                
                {/* BIG DISPLAY BILLBOARD TEXT PREVIEW */}
                <div className="my-6 bg-gradient-to-r from-gray-950 to-[#0e121b] border-2 border-[#0bb7a7]/20 p-8 rounded-xl text-center relative overflow-hidden">
                  <span className="absolute top-2 left-3 text-[8px] text-gray-600 font-mono tracking-widest">
                    OOH BILLBOARD SLOGAN CONCEPT
                  </span>
                  
                  <blockquote className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0bb7a7] to-[#125d98] uppercase italic leading-none tracking-tight">
                    "{brief.tagline}"
                  </blockquote>
                </div>

                {/* VISUAL BILLBOARD CONCEPT DIRECTION */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-[#0bb7a7]" />
                    Visual OOH Billboard Physical Concept
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed font-medium">
                    {brief.billboardConcept}
                  </p>
                </div>
              </div>

              {/* INTEGRATED GUERILLA & EXPERIENTIAL EXTENSIONS */}
              <div className="bg-[#10141d] rounded-xl p-6 border border-gray-800/80 shadow-2xl">
                <h3 className="font-bold text-white text-sm mb-4 uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#0bb7a7]" />
                  Experiential Guerilla Extensions
                </h3>

                <ul className="space-y-4">
                  {brief.additionalStrategies.map((strat, idx) => (
                    <li key={idx} className="flex gap-3 bg-[#161c28]/70 p-3 rounded-lg border border-gray-800/40 hover:border-gray-800 transition-colors">
                      <span className="w-6 h-6 rounded-full bg-teal-950/80 text-[#0bb7a7] border border-[#0bb7a7]/30 text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-gray-300 leading-relaxed font-medium">
                        {strat}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* LIVE METRICS / PREDICTION INSIGHT PANEL */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#10141d] p-4 rounded-xl border border-gray-800/80 text-center">
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-1">
                    Optimizer Ave. ROI Yield
                  </p>
                  <p className="text-3xl font-bold text-emerald-400 flex items-center justify-center gap-1">
                    {dynamicKPIs.averageROI}x
                    <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                  </p>
                  <p className="text-[9px] text-gray-500 mt-1">Multi-channel blended prediction</p>
                </div>

                <div className="bg-[#10141d] p-4 rounded-xl border border-gray-800/80 text-center">
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-1">
                    Slogan Recall Rate
                  </p>
                  <p className="text-3xl font-bold text-teal-400">
                    {dynamicKPIs.sloganRecall}%
                  </p>
                  <p className="text-[9px] text-gray-500 mt-1">Expected 14-day recall lift</p>
                </div>

                <div className="bg-[#10141d] p-4 rounded-xl border border-gray-800/80 text-center">
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-1">
                    Social Volumetric Gain
                  </p>
                  <p className="text-3xl font-bold text-indigo-400">
                    {dynamicKPIs.viralityLift}%
                  </p>
                  <p className="text-[9px] text-gray-500 mt-1">Est. organic PR multiplier</p>
                </div>
              </div>

              {/* WHY THIS CONVERTS INSIGHT */}
              <div className="bg-gradient-to-r from-teal-950/20 to-indigo-950/20 p-5 rounded-xl border border-teal-900/30 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-teal-950/80 border border-teal-800 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-teal-300 tracking-wider mb-1">
                    Strategy Conversion Mechanism
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed font-medium">
                    {brief.conversionProjection}
                  </p>
                </div>
              </div>

            </div>
          ) : (
            /* Base Empty Info guide */
            <div className="bg-[#10141d] rounded-xl p-12 border border-dashed border-gray-800 shadow-2xl flex flex-col items-center justify-center min-h-[500px] text-center space-y-4">
              <HelpCircle className="w-12 h-12 text-gray-600 animate-pulse" />
              <div className="space-y-1">
                <h3 className="font-bold text-white">Generate Your Strategy Brief</h3>
                <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                  Fill in your target brand meta-fields on the left, choosing your custom tone parameters, to execute the generative strategy agent request.
                </p>
              </div>
            </div>
          )}

        </section>

      </main>
    </div>
  );
}

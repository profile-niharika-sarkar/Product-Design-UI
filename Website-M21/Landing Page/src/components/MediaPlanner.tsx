import React, { useState, useMemo } from "react";
import { 
  ArrowLeft, MapPin, Calendar, DollarSign, Layers, Monitor, 
  Truck, Leaf, Sparkles, Check, ChevronRight, Zap, Info
} from "lucide-react";
import { BILLBOARD_SPECS, CITY_MARKETS, STYLE_PRESETS } from "../data";
import { BillboardSpec, CityMarket, AdMockupConfig } from "../types";

interface MediaPlannerProps {
  onBack: () => void;
}

export default function MediaPlanner({ onBack }: MediaPlannerProps) {
  // Navigation & Config state
  const [selectedCity, setSelectedCity] = useState<CityMarket>(CITY_MARKETS[0]);
  const [selectedSpec, setSelectedSpec] = useState<BillboardSpec>(BILLBOARD_SPECS[0]);
  const [daysCount, setDaysCount] = useState<number>(7);
  
  // Billboard Customizer State
  const [mockup, setMockup] = useState<AdMockupConfig>({
    headline: "BORN TO DOMINATE THE STREETS.",
    textColor: "#39ff14",
    bgColor: "#050014",
    bgGradient: "linear-gradient(135deg, #09001f 0%, #03000b 100%)",
    stylePreset: "neon",
    glowIntensity: 70,
    fontSize: 42,
  });

  // Calculate prices dynamically
  const financialMetrics = useMemo(() => {
    const basePrice = selectedSpec.basePricePerDay * daysCount;
    const locationMultiplier = selectedCity.reachMultiplier * selectedCity.premiumFactor;
    const totalCost = Math.round(basePrice * locationMultiplier);
    const estImpressions = Math.round(selectedSpec.estImpressionsPerDay * selectedCity.reachMultiplier * daysCount);
    
    return {
      pricePerDay: Math.round(selectedSpec.basePricePerDay * locationMultiplier),
      totalCost,
      estImpressions,
    };
  }, [selectedSpec, selectedCity, daysCount]);

  // Handle Preset Change
  const applyPreset = (presetId: string) => {
    const found = STYLE_PRESETS.find(p => p.id === presetId);
    if (found) {
      setMockup(prev => ({
        ...prev,
        stylePreset: presetId as any,
        textColor: found.textColor,
        bgColor: found.bgColor,
        bgGradient: found.bgGradient,
      }));
    }
  };

  // Helper render to retrieve Lucide Icon for spec
  const renderSpecIcon = (type: string) => {
    switch (type) {
      case "MonitorPlay":
      case "Digital Screen":
        return <Monitor className="w-5 h-5" />;
      case "Truck":
      case "Mobile Ambient":
        return <Truck className="w-5 h-5" />;
      case "Layers":
      case "Street Furniture":
        return <Layers className="w-5 h-5" />;
      case "Leaf":
      case "Special Build":
        return <Leaf className="w-5 h-5" />;
      default:
        return <Layers className="w-5 h-5" />;
    }
  };

  return (
    <div id="media-planner-root" className="min-h-screen bg-[#090b10] text-[#f1f3f9] font-sans">
      {/* Top sticky visual header bar */}
      <header className="sticky top-0 z-50 bg-[#0e111a]/90 backdrop-blur-md border-b border-gray-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <button 
            id="planner-back-btn"
            onClick={onBack}
            className="flex items-center gap-2 text-xs md:text-sm text-gray-400 hover:text-white transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Portal Slider</span>
          </button>
          
          <div className="flex items-center gap-3">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-xs uppercase font-medium tracking-widest text-[#8d49ff]">
              OOH Outdoor Media Planner
            </span>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Config Panel (7 cols on large screens) */}
        <section id="planner-config-section" className="lg:col-span-7 flex flex-col gap-8">
          
          {/* STEP 1: City Market Selection */}
          <div className="bg-[#121622] rounded-xl p-6 border border-gray-800/60 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <MapPin className="w-24 h-24" />
            </div>

            <h2 className="text-xl font-bold flex items-center gap-2 mb-2 text-[#b392ff]">
              <span className="text-xs bg-indigo-900/60 text-indigo-300 font-bold px-2 py-1 rounded">01</span>
              Target Urban Market
            </h2>
            <p className="text-xs text-gray-400 mb-5">
              Select key global cities to map your brand reach onto dense high-traffic metropolitan populations.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
              {CITY_MARKETS.map((city) => (
                <button
                  id={`city-tab-${city.id}`}
                  key={city.id}
                  onClick={() => setSelectedCity(city)}
                  className={`px-3 py-2.5 rounded text-left transition-all ${
                    selectedCity.id === city.id
                      ? "bg-[#5f2cff] text-white font-semibold ring-2 ring-[#8d49ff] ring-offset-2 ring-offset-[#121622]"
                      : "bg-[#181f33] hover:bg-[#202945] text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <p className="text-xs text-gray-400/80 uppercase tracking-tight">{city.country}</p>
                  <p className="text-sm font-bold truncate mt-0.5">{city.name}</p>
                </button>
              ))}
            </div>

            {/* Micro display spots */}
            <div className="bg-[#181f33]/80 rounded-lg p-4 border border-gray-800/40">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-2">
                Prime Target Clusters
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedCity.popularSpots.map((spot, idx) => (
                  <span 
                    key={idx} 
                    className="text-xs bg-[#121622] text-[#c0a3ff] px-2.5 py-1 rounded border border-[#5f2cff]/20 flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#8d49ff]"></span>
                    {spot}
                  </span>
                ))}
              </div>
            </div>
          </div>


          {/* STEP 2: OOH Media Asset Choice */}
          <div className="bg-[#121622] rounded-xl p-6 border border-gray-800/60 shadow-xl">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-2 text-[#b392ff]">
              <span className="text-xs bg-indigo-900/60 text-indigo-300 font-bold px-2 py-1 rounded">02</span>
              Outdoor Media Architecture
            </h2>
            <p className="text-xs text-gray-400 mb-5">
              Choose an structural delivery asset configured for maximum visibility, pedestrian engagement, or moving range.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BILLBOARD_SPECS.map((spec) => {
                const isSelected = selectedSpec.id === spec.id;
                return (
                  <div
                    id={`spec-card-${spec.id}`}
                    key={spec.id}
                    onClick={() => setSelectedSpec(spec)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? "bg-[#20183b] border-[#8d49ff] ring-1 ring-[#8d49ff]"
                        : "bg-[#181f33] border-gray-800/40 hover:border-gray-700/80"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className={`p-2 rounded-lg ${isSelected ? "bg-[#5f2cff] text-white" : "bg-[#121622] text-gray-400"}`}>
                          {renderSpecIcon(spec.type)}
                        </span>
                        <span className="text-[10px] bg-[#121622] text-[#8d49ff] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                          {spec.dimensions}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-white mb-1">{spec.name}</h3>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{spec.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-800/50 flex justify-between items-center text-xs">
                      <span className="text-gray-400">Est. Daily Reach</span>
                      <span className="font-bold text-[#35ec9c]">
                        {Math.round(spec.estImpressionsPerDay * selectedCity.reachMultiplier).toLocaleString()} views
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>


          {/* STEP 3: Active Billboard Screen Creator */}
          <div className="bg-[#121622] rounded-xl p-6 border border-gray-800/60 shadow-xl">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-2 text-[#b392ff]">
              <span className="text-xs bg-indigo-900/60 text-indigo-300 font-bold px-2 py-1 rounded">03</span>
              Live Display Content Creator
            </h2>
            <p className="text-xs text-gray-400 mb-5">
              Draft the slogan message, tweak ambient glow styles, and observe real-time scaling within our city environments.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                  Headline Slogan
                </label>
                <input
                  id="slogan-input-planner"
                  type="text"
                  maxLength={55}
                  value={mockup.headline}
                  onChange={(e) => setMockup(prev => ({ ...prev, headline: e.target.value }))}
                  placeholder="e.g. BREAKING RULES. CRAFTING DREAMS."
                  className="w-full bg-[#181f33] text-white border border-gray-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#8d49ff] transition-colors"
                />
              </div>

              {/* Presets and details */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                  Creative Color Theme Style Presets
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {STYLE_PRESETS.map((preset) => (
                    <button
                      id={`preset-btn-${preset.id}`}
                      key={preset.id}
                      onClick={() => applyPreset(preset.id)}
                      className={`py-2 px-1.5 rounded text-xs truncate border transition-all ${
                        mockup.stylePreset === preset.id
                          ? "bg-white text-black font-bold border-white"
                          : "bg-[#181f33] text-gray-400 border-transparent hover:border-gray-800"
                      }`}
                    >
                      {preset.name.replace("Minimalist ", "").replace("High Intensity ", "").replace("Cyber ", "").replace("Electric ", "")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider customization controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Typography Scale</span>
                    <span className="font-bold text-gray-300">{mockup.fontSize}px</span>
                  </div>
                  <input
                    id="font-scale-range"
                    type="range"
                    min="18"
                    max="64"
                    value={mockup.fontSize}
                    onChange={(e) => setMockup(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                    className="w-full accent-[#8d49ff]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Illumination Glow</span>
                    <span className="font-bold text-gray-300">{mockup.glowIntensity}%</span>
                  </div>
                  <input
                    id="glow-intensity-range"
                    type="range"
                    min="10"
                    max="100"
                    value={mockup.glowIntensity}
                    onChange={(e) => setMockup(prev => ({ ...prev, glowIntensity: parseInt(e.target.value) }))}
                    className="w-full accent-[#8d49ff]"
                  />
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Right Column: Interactive Rendering Frame (5 cols on large screens) */}
        <section id="planner-preview-section" className="lg:col-span-5 flex flex-col gap-6">
          
          {/* LIVE SIMULATION BOX */}
          <div className="bg-[#121622] rounded-xl p-6 border border-gray-800/60 shadow-xl flex flex-col h-full justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold text-white text-sm">Live Simulated Render</h3>
                  <p className="text-[10px] text-[#8d49ff] uppercase tracking-wider font-semibold">
                    Simulating {selectedCity.name} OOH Cluster
                  </p>
                </div>
                <span className="flex items-center gap-1 text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Active Frame
                </span>
              </div>

              {/* DIGITAL BILLBOARD STYLED SIMULATION CONTAINER */}
              <div className="relative w-full rounded-xl overflow-hidden bg-gradient-to-b from-[#02050f] to-[#0d0a20] border border-gray-800/80 p-6 flex flex-col items-center justify-center min-h-[290px] shadow-inner class-mockup-frame">
                
                {/* Visual sky background element */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(40,24,96,0.3)_0%,transparent_70%)] pointer-events-none"></div>

                {/* Stars container */}
                <div className="absolute top-4 left-6 right-6 h-12 flex justify-between opacity-30 pointer-events-none">
                  <span className="w-1 h-1 bg-white rounded-full"></span>
                  <span className="w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-500"></span>
                  <span className="w-1 h-1 bg-white rounded-full animate-ping"></span>
                  <span className="w-0.5 h-0.5 bg-white rounded-full"></span>
                </div>

                {/* Spotlights rendering effects */}
                <div className="absolute bottom-12 left-1/4 w-32 h-44 bg-gradient-to-t from-gray-200/5 to-transparent origin-bottom rotate-12 blur-md"></div>
                <div className="absolute bottom-12 right-1/4 w-32 h-44 bg-gradient-to-t from-gray-200/5 to-transparent origin-bottom -rotate-12 blur-md"></div>

                {/* THE ACTUAL PHYSICAL DIGITAL BILLBOARD FRAME */}
                <div className="w-full relative z-10 transition-transform duration-500 max-w-[340px]">
                  
                  {/* Outer metallic surround structure */}
                  <div className="bg-[#1f2430] p-2.5 rounded-lg shadow-2xl border border-gray-700/80">
                    
                    {/* Inner glowing screen display */}
                    <div 
                      id="live-billboard-screen"
                      style={{
                        background: mockup.bgGradient,
                        backgroundColor: mockup.bgColor,
                        boxShadow: `inset 0 0 40px rgba(0,0,0,0.6)`
                      }}
                      className="aspect-[16/10] w-full rounded flex flex-col justify-between p-4 relative overflow-hidden transition-all duration-300"
                    >
                      {/* Ambient decorative border grid pattern */}
                      <div className="absolute inset-0 opacity-15 bg-[raw_grid] pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)", backgroundSize: "8px 8px" }}></div>

                      {/* Top status bar logo element */}
                      <div className="flex justify-between items-center z-10">
                        <span className="text-[7.5px] uppercase font-bold tracking-widest bg-white/15 px-1.5 py-0.5 rounded" style={{ color: mockup.textColor }}>
                          {selectedCity.name} OOH
                        </span>
                        <span className="text-[7px] text-gray-500/80 font-mono tracking-widest">
                          [ LIVE STREAM ]
                        </span>
                      </div>

                      {/* Main slogan rendered text */}
                      <div className="w-full text-center my-auto py-2 z-10 flex items-center justify-center min-h-[90px]">
                        <p 
                          style={{
                            color: mockup.textColor,
                            fontSize: `${mockup.fontSize * 0.45}px`,
                            textShadow: STYLE_PRESETS.find(p => p.id === mockup.stylePreset)?.glowColor 
                              ? `0 0 ${mockup.glowIntensity * 0.2}px ${STYLE_PRESETS.find(p => p.id === mockup.stylePreset)?.glowColor}` 
                              : "none"
                          }}
                          className={`font-montserrat leading-tight break-words uppercase font-bold ${
                            STYLE_PRESETS.find(p => p.id === mockup.stylePreset)?.fontFamily || "font-bold"
                          }`}
                        >
                          {mockup.headline || "YOUR BRAND HEADLINE HERE"}
                        </p>
                      </div>

                      {/* Display structural bottom bar */}
                      <div className="flex justify-between items-center text-[7px] text-gray-500 z-10 pt-1 border-t border-white/5">
                        <span>ASSET: {selectedSpec.dimensions}</span>
                        <span>SOLARPOWER ACCREDITED</span>
                      </div>
                    </div>
                  </div>

                  {/* Heavy supporting core structural metal poles */}
                  <div className="w-full flex justify-between px-10 relative -mt-0.5">
                    <div className="w-3.5 h-12 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-800 shadow-md"></div>
                    <div className="w-3.5 h-12 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-800 shadow-md"></div>
                  </div>
                  {/* Foundation anchor */}
                  <div className="h-2 w-full max-w-[280px] bg-gradient-to-r from-gray-800 to-gray-900 rounded mx-auto relative -mt-0.5"></div>
                </div>

                {/* Pedestrian context indicators */}
                <div className="w-full flex justify-between items-end mt-4 text-[9px] text-gray-500 pointer-events-none z-10 px-2 leading-none">
                  <div className="flex gap-2">
                    <span>👥 Foot Traffic High</span>
                    <span>📍 {selectedCity.name} Centroid</span>
                  </div>
                  <span>Scale 1:250</span>
                </div>
              </div>
            </div>

            {/* FINANCIAL calculator & CAMPAIGN INPUTS */}
            <div className="mt-6 pt-5 border-t border-gray-800/80 space-y-5">
              
              {/* Campaign length controller */}
              <div className="flex justify-between items-center bg-[#181f33] p-3 rounded-lg border border-gray-800/30">
                <div>
                  <p className="text-xs font-semibold text-white">Campaign Run Time</p>
                  <p className="text-[10px] text-gray-400">Specify running frequency in days</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    id="decrease-days-btn"
                    onClick={() => setDaysCount(prev => Math.max(1, prev - 1))}
                    className="w-8 h-8 rounded-full bg-[#121622] hover:bg-[#202945] flex items-center justify-center font-bold text-sm text-gray-300 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-white">
                    {daysCount}d
                  </span>
                  <button 
                    id="increase-days-btn"
                    onClick={() => setDaysCount(prev => Math.min(60, prev + 1))}
                    className="w-8 h-8 rounded-full bg-[#121622] hover:bg-[#202945] flex items-center justify-center font-bold text-sm text-gray-300 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Dynamic projections */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#181f33]/50 p-4 rounded-xl border border-gray-800/30">
                  <p className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider flex items-center gap-1.5 mb-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Est. Impressions
                  </p>
                  <p className="text-xl font-bold text-white">
                    {financialMetrics.estImpressions.toLocaleString()}
                  </p>
                  <p className="text-[9px] text-[#35ec9c] font-medium mt-1">
                    +{Math.round((daysCount * selectedCity.reachMultiplier * 14.5)).toLocaleString()}% expected engagement lift
                  </p>
                </div>

                <div className="bg-[#181f33]/50 p-4 rounded-xl border border-gray-800/30">
                  <p className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider flex items-center gap-1.5 mb-1">
                    <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
                    Calculated Budget
                  </p>
                  <p className="text-xl font-bold text-[#a68aff]">
                    ${financialMetrics.totalCost.toLocaleString()}
                  </p>
                  <p className="text-[9px] text-gray-400 mt-1">
                    ${financialMetrics.pricePerDay.toLocaleString()} / day average
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  id="planner-book-assets-btn"
                  onClick={() => alert(`Strategic reservation initialized for a ${daysCount}-day campaign in ${selectedCity.name}. Estimated Price: $${financialMetrics.totalCost.toLocaleString()}. Slogan headline applied!`)}
                  className="w-full py-3.5 rounded-lg bg-[#5f2cff] hover:bg-[#8d49ff] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg cursor-pointer"
                >
                  Reserve Slots & Download Brief
                </button>
              </div>

              {/* Tech details */}
              <div className="flex gap-2 text-[10px] text-gray-500 bg-[#181f33]/20 p-3 rounded-lg items-start border border-gray-800/20">
                <Info className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                <p className="leading-normal">
                  All price estimates are based on the OOH platform factor ({selectedCity.premiumFactor} premium multiplier and base fee rate of ${selectedSpec.basePricePerDay} for {selectedSpec.name}).
                </p>
              </div>
            </div>
          </div>

        </section>

      </main>
    </div>
  );
}

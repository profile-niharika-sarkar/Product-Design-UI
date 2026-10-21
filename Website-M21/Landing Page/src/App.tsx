import React, { useState } from "react";
import { 
  ArrowLeft, Monitor, Zap, HelpCircle, Compass, 
  Sparkles, ShieldCheck, ChevronLeft, ChevronRight, Share2 
} from "lucide-react";
import { motion } from "motion/react";
import MediaPlanner from "./components/MediaPlanner";
import MarketingStudio from "./components/MarketingStudio";
import media21Logo from "../Media 21 logo.png";

export default function App() {
  const [view, setView] = useState<"portal" | "media-planner" | "marketing-studio">("portal");
  const [hoveredSide, setHoveredSide] = useState<"left" | "right" | null>(null);

  // Handles navigation buttons cycle (‹ activates left panel, › activates right panel, center resets)
  const handleNavClick = (direction: "left" | "right") => {
    if (direction === "left") {
      setView("media-planner");
    } else {
      setView("marketing-studio");
    }
  };

  if (view === "media-planner") {
    return <MediaPlanner onBack={() => setView("portal")} />;
  }

  if (view === "marketing-studio") {
    return <MarketingStudio onBack={() => setView("portal")} />;
  }

  return (
    <div id="portal-root" className="w-full min-h-screen bg-[#0e0e11] text-[#eef1f8] font-sans flex flex-col justify-between overflow-x-hidden relative">
      
      {/* BACKGROUND GRAPHIC ACCENTS */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-indigo-900/10 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-12 right-1/4 w-[450px] h-[450px] rounded-full bg-teal-950/10 blur-[140px] pointer-events-none"></div>

      {/* CENTER WORKSPACE - PORTAL SPLIT SLIDER CONTAINER */}
      <div className="w-full flex-1 flex flex-col items-center justify-center p-4 sm:p-10 z-10">
        <div className="w-full max-w-7xl mb-4 md:hidden px-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-center text-xs text-gray-200 sm:text-sm">
            <p className="font-semibold text-white">Tap a panel to explore</p>
            <p className="opacity-80">Swipe or scroll to view both sections on smaller screens.</p>
          </div>
        </div>

        {/* SLIDER STRUCTURE */}
        <div id="split-slider-container" className="w-full max-w-7xl min-h-[80vh] h-auto sm:h-[72vh] flex flex-col md:flex-row relative overflow-x-hidden overflow-y-auto snap-y snap-mandatory rounded-2xl border border-gray-900 shadow-[0_30px_90px_rgba(0,0,0,0.45)] bg-black">
          
          {/* GLASS CENTER NAVIGATION AND DIVIDER LINE */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/10 z-20 -translate-x-1/2 pointer-events-none"></div>
          
          {/* Glass floating navigation wheel */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 hidden md:flex items-center gap-3">
            <motion.button
              id="slider-nav-left-btn"
              onClick={() => handleNavClick("left")}
              title="Activate Media Hub"
              whileHover={{ scale: 1.18, boxShadow: "0 0 25px rgba(255, 79, 216, 0.85)" }}
              whileTap={{ scale: 0.92 }}
              animate={{ 
                x: hoveredSide === "left" ? -18 : hoveredSide === "right" ? 12 : 0,
                opacity: hoveredSide === "right" ? 0.35 : 1,
                scale: hoveredSide === "left" ? 1.08 : 1,
                backgroundColor: hoveredSide === "left" ? "#FFFFFF" : "rgba(0, 0, 0, 0.55)",
                color: hoveredSide === "left" ? "#9333EA" : "#FFFFFF",
                borderColor: hoveredSide === "left" ? "#FF4FD8" : "rgba(255, 255, 255, 0.25)",
                boxShadow: hoveredSide === "left" 
                  ? "0 0 20px rgba(255, 79, 216, 0.7)" 
                  : "0 10px 15px -3px rgba(0, 0, 0, 0.3)"
              }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="w-12 h-12 rounded-full border flex items-center justify-center backdrop-blur-md cursor-pointer transition-shadow"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
            <motion.button
              id="slider-nav-right-btn"
              onClick={() => handleNavClick("right")}
              title="Launch Campaign Studio"
              whileHover={{ scale: 1.18, boxShadow: "0 0 25px rgba(6, 182, 212, 0.85)" }}
              whileTap={{ scale: 0.92 }}
              animate={{ 
                x: hoveredSide === "right" ? 18 : hoveredSide === "left" ? -12 : 0,
                opacity: hoveredSide === "left" ? 0.35 : 1,
                scale: hoveredSide === "right" ? 1.08 : 1,
                backgroundColor: hoveredSide === "right" ? "#FFFFFF" : "rgba(0, 0, 0, 0.55)",
                color: hoveredSide === "right" ? "#00A99D" : "#FFFFFF",
                borderColor: hoveredSide === "right" ? "#00D1C1" : "rgba(255, 255, 255, 0.25)",
                boxShadow: hoveredSide === "right" 
                  ? "0 0 20px rgba(6, 182, 212, 0.7)" 
                  : "0 10px 15px -3px rgba(0, 0, 0, 0.3)"
              }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="w-12 h-12 rounded-full border flex items-center justify-center backdrop-blur-md cursor-pointer transition-shadow"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>

          {/* LEFT SIDE PANEL: OUTDOOR MEDIA */}
          <motion.section
            id="panel-outdoor-media"
            onMouseEnter={() => setHoveredSide("left")}
            onMouseLeave={() => setHoveredSide(null)}
            animate={{
              flex: hoveredSide === "left" ? 1.45 : hoveredSide === "right" ? 0.72 : 1,
            }}
            transition={{ type: "spring", stiffness: 110, damping: 20 }}
            className="flex-1 snap-start relative cursor-pointer overflow-hidden flex flex-col justify-end p-6 sm:p-12 border-b md:border-b-0 md:border-r border-[#0A0A0A]/40 group group-left-panel bg-gradient-to-br from-brand-purple via-brand-magenta to-brand-dark dark:from-[#9333EA] dark:to-[#0A0A0A]"
          >
            {/* Visual Screen overlay cover */}
            <div className="absolute inset-0 bg-brand-dark/30 group-hover:bg-brand-dark/15 z-10 transition-colors duration-500"></div>

            {/* Glowing active neon background shape additions */}
            <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-brand-pink/15 blur-3xl group-hover:bg-brand-pink/25 transition-all pointer-events-none"></div>
            <div className="absolute -bottom-16 -left-16 w-44 h-44 rounded-full bg-brand-purple/20 blur-2xl group-hover:bg-brand-magenta/30 transition-all pointer-events-none"></div>

            {/* Content holder with 2-way horizontal motion */}
            <motion.div 
              animate={{ 
                x: hoveredSide === "left" ? 14 : 0,
                opacity: hoveredSide === "right" ? 0.45 : 1
              }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="relative z-20 flex flex-col items-center md:items-start text-center md:text-left gap-4"
            >
              {/* Premium Logo Container positioned above the heading */}
              <div className="mb-4 select-none pointer-events-none">
                <div className="flex items-center justify-center px-5 py-2.5 rounded-xl border border-white/12 bg-white/[0.04] backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
                  <img
                    src={media21Logo}
                    alt="Media 21"
                    className="w-28 sm:w-32 h-auto"
                  />
                </div>
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter uppercase text-white leading-none">
                OUTDOOR<br />
                MEDIA NETWORK
              </h1>

              <p className="text-xs md:text-sm text-gray-200 select-none max-w-none md:max-w-md font-medium leading-relaxed">
                High-impact outdoor campaigns crafted to dominate city landscapes, transit hubs, premium billboards, and large-scale brand activations.
              </p>

              <button 
                id="portal-explore-media-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open("https://outdoor.m21world.com/", "_blank", "noreferrer");
                }}
                className="mt-2 py-3 px-6 bg-transparent hover:bg-white text-white hover:text-black border border-white/40 hover:border-white rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-lg cursor-pointer mx-auto md:mx-0"
              >
                Explore Outdoor Media Network
              </button>
            </motion.div>

            {/* Parallax animated watermark that slides left-to-right */}
            <motion.div 
              animate={{ 
                x: hoveredSide === "left" ? 45 : 0,
                opacity: hoveredSide === "left" ? 0.08 : 0.04,
                scale: hoveredSide === "left" ? 1.05 : 1
              }}
              transition={{ type: "spring", stiffness: 90, damping: 22 }}
              className="absolute bottom-16 right-[-20px] sm:right-[-20px] right-4 text-[120px] font-bold text-white select-none uppercase tracking-widest leading-none rotate-90 origin-bottom-right pointer-events-none font-sans"
            >
              MEDIA
            </motion.div>
          </motion.section>

          {/* RIGHT SIDE PANEL: CREATIVE MARKETING */}
          <motion.section
            id="panel-creative-marketing"
            onMouseEnter={() => setHoveredSide("right")}
            onMouseLeave={() => setHoveredSide(null)}
            animate={{
              flex: hoveredSide === "right" ? 1.45 : hoveredSide === "left" ? 0.72 : 1,
            }}
            transition={{ type: "spring", stiffness: 110, damping: 20 }}
            className="flex-1 snap-start relative cursor-pointer overflow-hidden flex flex-col justify-end p-6 sm:p-12 border-b md:border-b-0 relative group group-right-panel bg-gradient-to-br from-brand-secondary via-brand-accent to-brand-dark-blue"
          >
            {/* Visual Screen overlay cover */}
            <div className="absolute inset-0 bg-brand-dark-blue/30 group-hover:bg-brand-dark-blue/15 z-10 transition-colors duration-500"></div>

            {/* Glowing active neon background shape additions */}
            <div className="absolute -top-16 -left-16 w-60 h-60 rounded-full bg-brand-primary/10 blur-3xl group-hover:bg-brand-primary/20 transition-all pointer-events-none"></div>
            <div className="absolute -bottom-16 -right-16 w-44 h-44 rounded-full bg-brand-secondary/15 blur-2xl group-hover:bg-brand-accent/25 transition-all pointer-events-none"></div>

            {/* Content holder with 2-way horizontal motion */}
            <motion.div 
              animate={{ 
                x: hoveredSide === "right" ? -14 : 0,
                opacity: hoveredSide === "left" ? 0.45 : 1
              }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="relative z-20 flex flex-col items-center md:items-end text-center md:text-right gap-4 w-full"
            >
              {/* Premium Logo Container positioned above the heading */}
              <div className="mb-4 select-none pointer-events-none">
                <div className="flex items-center justify-center px-5 py-2.5 rounded-xl border border-white/12 bg-white/[0.04] backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
                  <img
                    src={media21Logo}
                    alt="Media 21"
                    className="w-28 sm:w-32 h-auto"
                  />
                </div>
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter uppercase text-white leading-none">
                ADVERTISING<br />
                AGENCY
              </h1>

              <p className="text-xs md:text-sm text-gray-200 select-none max-w-none md:max-w-md font-medium leading-relaxed">
                Data-driven marketing campaigns blending creativity, performance, digital storytelling, social engagement, and memorable brand experiences.
              </p>

              <button 
                id="portal-view-campaigns-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open("http://marketing.m21world.com/", "_blank", "noreferrer");
                }}
                className="mt-2 py-3 px-6 bg-transparent hover:bg-white text-white hover:text-black border border-white/40 hover:border-white rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-lg cursor-pointer mx-auto md:mx-0"
              >
                Explore Advertising Agency
              </button>
            </motion.div>

            {/* Parallax animated watermark that slides right-to-left */}
            <motion.div 
              animate={{ 
                x: hoveredSide === "right" ? -45 : 0,
                opacity: hoveredSide === "right" ? 0.08 : 0.04,
                scale: hoveredSide === "right" ? 1.05 : 1
              }}
              transition={{ type: "spring", stiffness: 90, damping: 22 }}
              className="absolute bottom-16 right-[-20px] sm:right-[-20px] right-4 text-[120px] font-bold text-white select-none uppercase tracking-widest leading-none rotate-90 origin-bottom-right pointer-events-none font-sans"
            >
              STUDIO
            </motion.div>
          </motion.section>

        </div>

      </div>

    </div>
  );
}

"use client";
import React, { useState } from "react";
import { 
  Sparkles, 
  Layers, 
  Code2, 
  Eye, 
  MousePointerClick, 
  Box, 
  Type, 
  MessageSquareQuote, 
  Activity, 
  Upload, 
  CheckCircle, 
  ScrollText, 
  Lightbulb, 
  Stars, 
  EyeOff, 
  Waves, 
  Palette,
  Maximize2
} from "lucide-react";
import {
  GooeyInputDemo,
  MagneticButtonDemo,
  ThreeDCardDemo,
  TextHoverEffectDemo,
  AnimatedTestimonialsDemo,
  BackgroundLinesDemo,
  FileUploadDemo,
  StatefulButtonDemo,
  HeroScrollDemo,
  LampDemo,
  ShootingStarsAndStarsBackgroundDemo,
  SVGMaskEffectDemo,
  HoverBorderGradientDemo,
  WavyBackgroundDemo,
  BackgroundGradientDemo,
} from "./ui/AceternityDemos";

interface AceternityShowcaseProps {
  onBackToMusic?: () => void;
}

export const AceternityShowcase: React.FC<AceternityShowcaseProps> = ({ onBackToMusic }) => {
  const [selectedDemo, setSelectedDemo] = useState<string>("all");

  const demoList = [
    { id: "lamp", name: "1. Lamp Container", icon: Lightbulb, component: <LampDemo /> },
    { id: "3d-card", name: "2. 3D Card Effect", icon: Box, component: <ThreeDCardDemo /> },
    { id: "text-hover", name: "3. Text Hover Effect", icon: Type, component: <TextHoverEffectDemo /> },
    { id: "magnetic", name: "4. Magnetic Button", icon: MousePointerClick, component: <MagneticButtonDemo /> },
    { id: "gooey-input", name: "5. Gooey Input", icon: Activity, component: <GooeyInputDemo /> },
    { id: "testimonials", name: "6. Animated Testimonials", icon: MessageSquareQuote, component: <AnimatedTestimonialsDemo /> },
    { id: "background-lines", name: "7. Background Lines", icon: Activity, component: <BackgroundLinesDemo /> },
    { id: "file-upload", name: "8. File Upload Area", icon: Upload, component: <FileUploadDemo /> },
    { id: "stateful-button", name: "9. Stateful Button", icon: CheckCircle, component: <StatefulButtonDemo /> },
    { id: "hero-scroll", name: "10. Container Scroll 3D", icon: ScrollText, component: <HeroScrollDemo /> },
    { id: "shooting-stars", name: "11. Shooting Stars & Background", icon: Stars, component: <ShootingStarsAndStarsBackgroundDemo /> },
    { id: "svg-mask", name: "12. SVG Mask Effect", icon: EyeOff, component: <SVGMaskEffectDemo /> },
    { id: "hover-border", name: "13. Hover Border Gradient", icon: Sparkles, component: <HoverBorderGradientDemo /> },
    { id: "wavy-bg", name: "14. Wavy Background", icon: Waves, component: <WavyBackgroundDemo /> },
    { id: "bg-gradient", name: "15. Background Gradient", icon: Palette, component: <BackgroundGradientDemo /> },
  ];

  return (
    <div className="w-full space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 sm:p-10 border border-purple-500/20 bg-gradient-to-r from-purple-950/60 via-slate-900 to-cyan-950/40 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Aceternity UI Studio • 15 Modern Components</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-4xl font-black text-white tracking-tight">
              Interactive Component Showcase
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Every requested Aceternity UI component has been custom-crafted, styled with the Smart Subha Beats dark aesthetic, and powered by Framer Motion.
            </p>
          </div>

          {onBackToMusic && (
            <button
              onClick={onBackToMusic}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all hover:scale-105 active:scale-95 flex-shrink-0"
            >
              Back to Music Streaming
            </button>
          )}
        </div>

        {/* Component Selector Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-6 mt-4 border-t border-white/10">
          <button
            onClick={() => setSelectedDemo("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedDemo === "all"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                : "bg-slate-900/80 hover:bg-slate-800 text-slate-400 border border-slate-700/60"
            }`}
          >
            Show All (15 Components)
          </button>
          {demoList.map((demo) => {
            const Icon = demo.icon;
            return (
              <button
                key={demo.id}
                onClick={() => setSelectedDemo(demo.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedDemo === demo.id
                    ? "bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-sm"
                    : "bg-slate-900/60 hover:bg-slate-800 text-slate-400 border border-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{demo.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Demos Gallery Grid */}
      <div className="space-y-12">
        {demoList
          .filter((demo) => selectedDemo === "all" || selectedDemo === demo.id)
          .map((demo) => {
            const Icon = demo.icon;
            return (
              <section
                key={demo.id}
                className="rounded-3xl glass-card border border-white/10 p-6 sm:p-8 space-y-4 shadow-xl relative overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-heading text-lg font-bold text-white">
                        {demo.name}
                      </h2>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Aceternity UI • Framer Motion & Tailwind CSS
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-800 text-cyan-400 border border-cyan-500/30 font-mono">
                    Live Demo
                  </span>
                </div>

                {/* Render the interactive demo */}
                <div className="w-full pt-2">
                  {demo.component}
                </div>
              </section>
            );
          })}
      </div>
    </div>
  );
};

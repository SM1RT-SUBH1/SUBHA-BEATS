"use client";
import React, { useState } from "react";
import { GooeyInput } from "@/components/ui/gooey-input";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { BackgroundLines } from "@/components/ui/background-lines";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/stateful-button";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { LampContainer } from "@/components/ui/lamp";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { MaskContainer } from "@/components/ui/svg-mask-effect";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { WavyBackground } from "@/components/ui/wavy-background";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { motion } from "framer-motion";
import { Play, Sparkles, Music, Disc } from "lucide-react";

export function GooeyInputDemo() {
  return (
    <div className="flex h-40 w-full items-center justify-center p-4">
      <GooeyInput placeholder="Search songs, artists, high-fidelity beats..." />
    </div>
  );
}

export function MagneticButtonDemo() {
  const [clicked, setClicked] = useState(false);
  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 2000);
  };
  return (
    <div className="flex h-52 w-full items-center justify-center">
      <MagneticButton>
        <button
          onClick={handleClick}
          className="cursor-pointer rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 px-6 py-3 font-bold text-white shadow-xl shadow-purple-600/30 ring-1 ring-white/20 transition-transform duration-150 active:scale-95 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-cyan-300" />
          <span>{clicked ? "Magnetic Snapped!" : "Magnetic Subha Beats"}</span>
        </button>
      </MagneticButton>
    </div>
  );
}

export function ThreeDCardDemo() {
  return (
    <CardContainer className="inter-var py-4">
      <CardBody className="bg-slate-900/90 relative group/card dark:hover:shadow-2xl dark:hover:shadow-purple-500/[0.2] border border-white/10 w-full sm:w-[28rem] h-auto rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
        <CardItem
          translateZ="50"
          className="text-xl font-extrabold text-white flex items-center gap-2"
        >
          <Disc className="w-5 h-5 text-purple-400 animate-spin" />
          <span>Smart Subha 3D Vinyl</span>
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-slate-400 text-xs max-w-sm mt-2 leading-relaxed"
        >
          Hover and tilt to explore true dynamic perspective rendering with YouTube 320kbps audio.
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <img
            src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop"
            height="1000"
            width="1000"
            className="h-48 w-full object-cover rounded-2xl group-hover/card:shadow-2xl border border-white/10"
            alt="Audio Studio Thumbnail"
          />
        </CardItem>
        <div className="flex justify-between items-center mt-6">
          <CardItem
            translateZ={20}
            as="a"
            href="https://smartsubhaportfolio.netlify.app"
            target="_blank"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Visit Portfolio →
          </CardItem>
          <CardItem
            translateZ={20}
            as="button"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30"
          >
            Stream in HD
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}

export function TextHoverEffectDemo() {
  return (
    <div className="h-64 sm:h-80 flex items-center justify-center w-full">
      <TextHoverEffect text="BEATS" />
    </div>
  );
}

export function AnimatedTestimonialsDemo() {
  const testimonials = [
    {
      quote:
        "The continuous background streaming and auto-advance keep our music sessions running flawlessly without interruption.",
      name: "Smart Subha",
      designation: "Founder & Audio Engineer",
      src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    },
    {
      quote:
        "Real IndexedDB offline caching means I can play my favorite Bengali and Lofi tracks even without active internet.",
      name: "Priyanka Roy",
      designation: "Playback Vocalist",
      src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
    },
    {
      quote:
        "Google authentication integration and the protected admin management console provide unmatched security and control.",
      name: "Arjun Banerjee",
      designation: "Music Producer",
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    },
  ];
  return <AnimatedTestimonials testimonials={testimonials} autoplay={true} />;
}

export function BackgroundLinesDemo() {
  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 text-center">
      <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-white via-slate-200 to-slate-400 text-2xl md:text-5xl font-extrabold tracking-tight py-2">
        Subha Acoustics, <br /> Studio Symphony.
      </h2>
      <p className="max-w-xl mx-auto text-xs md:text-sm text-slate-400 mt-2">
        Stream 271+ HD curated audio tracks with real offline sync, dynamic equalizer visualization, and background auto-advance.
      </p>
    </BackgroundLines>
  );
}

export function FileUploadDemo() {
  const [fileCount, setFileCount] = useState(0);
  const handleFileUpload = (files: File[]) => {
    setFileCount(files.length);
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-72 border border-dashed bg-slate-950/80 border-purple-500/30 rounded-3xl shadow-xl">
      <FileUpload onChange={handleFileUpload} />
      {fileCount > 0 && (
        <p className="text-center text-xs text-cyan-400 pb-4 font-mono">
          ✓ {fileCount} file(s) loaded into studio memory cache
        </p>
      )}
    </div>
  );
}

export function StatefulButtonDemo() {
  const handleClick = () => {
    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
  };
  return (
    <div className="flex h-36 w-full items-center justify-center">
      <Button onClick={handleClick}>Sync Offline Audio</Button>
    </div>
  );
}

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden w-full">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-2xl sm:text-4xl font-semibold text-white">
              Experience Spatial Perspective <br />
              <span className="text-3xl sm:text-6xl font-extrabold mt-1 leading-none bg-gradient-to-r from-purple-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                Scroll Stage 3D
              </span>
            </h1>
          </>
        }
      >
        <div className="h-full w-full rounded-2xl bg-gradient-to-br from-slate-900 via-purple-950/40 to-slate-950 p-6 flex flex-col justify-between border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Subha Beats Master Deck
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
              Live Stage
            </span>
          </div>

          <div className="text-center my-auto space-y-2">
            <Music className="w-12 h-12 text-purple-400 mx-auto animate-bounce" />
            <h3 className="text-xl sm:text-2xl font-bold text-white">Continuous HD Streaming</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Smart auto-advance queue and persistent background playback engine.
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 font-mono pt-3 border-t border-white/5">
            <span>271 Curated Tracks</span>
            <span>All Copyright Reserved © Smart Subha</span>
          </div>
        </div>
      </ContainerScroll>
    </div>
  );
}

export function LampDemo() {
  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 bg-gradient-to-br from-slate-200 to-slate-400 py-4 bg-clip-text text-center text-3xl font-medium tracking-tight text-transparent md:text-6xl"
      >
        Stream Audio <br /> The Right Way
      </motion.h1>
    </LampContainer>
  );
}

export function ShootingStarsAndStarsBackgroundDemo() {
  return (
    <div className="h-[28rem] rounded-3xl bg-slate-950 relative flex flex-col items-center justify-center w-full overflow-hidden border border-white/10">
      <h2 className="relative z-10 text-2xl md:text-4xl md:leading-tight max-w-4xl mx-auto text-center tracking-tight font-heading font-extrabold text-white">
        Celestial Audio Nightfall
      </h2>
      <p className="relative z-10 text-slate-400 text-xs md:text-sm text-center max-w-md mt-2">
        Shooting stars illuminate the high-fidelity acoustic atmosphere of Smart Subha Beats.
      </p>
      <ShootingStars />
      <StarsBackground />
    </div>
  );
}

export function SVGMaskEffectDemo() {
  return (
    <div className="w-full">
      <MaskContainer
        revealText={
          <p className="max-w-3xl mx-auto text-slate-200 text-center text-2xl sm:text-3xl font-bold">
            The first rule of <span className="text-purple-400 font-extrabold">Smart Subha Beats</span> is you never stop the rhythm.
          </p>
        }
        className="border border-white/10"
      >
        Hover over to reveal the concealed acoustic pulse beneath the audio canvas.
      </MaskContainer>
    </div>
  );
}

export function HoverBorderGradientDemo() {
  return (
    <div className="h-44 flex justify-center items-center">
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 px-6 py-2.5 font-bold text-xs"
      >
        <Sparkles className="w-4 h-4 text-purple-400" />
        <span>Subha Hover Border Gradient</span>
      </HoverBorderGradient>
    </div>
  );
}

export function WavyBackgroundDemo() {
  return (
    <WavyBackground className="max-w-4xl mx-auto pb-8 text-center px-4">
      <p className="text-2xl md:text-5xl text-white font-bold inter-var">
        Waveform Symphony
      </p>
      <p className="text-xs md:text-sm mt-3 text-white font-normal inter-var max-w-md mx-auto">
        Multi-frequency sine waves harmonizing with your real-time audio playback.
      </p>
    </WavyBackground>
  );
}

export function BackgroundGradientDemo() {
  return (
    <div className="flex justify-center p-4">
      <BackgroundGradient className="rounded-[22px] max-w-sm p-6 sm:p-8 bg-slate-900 border border-white/5">
        <img
          src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop"
          alt="Studio Album Art"
          height="400"
          width="400"
          className="object-cover rounded-xl h-44 w-full shadow-lg"
        />
        <p className="text-base sm:text-lg text-white mt-4 mb-2 font-bold font-heading">
          Neon Pulse Soundstage
        </p>
        <p className="text-xs text-slate-400 leading-relaxed">
          Dynamic gradient borders with animated radial reflections inspired by modern Aceternity UI.
        </p>
        <button className="rounded-full pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-black mt-4 text-xs font-bold hover:bg-neutral-800 transition-colors">
          <span>Stream Live</span>
          <span className="bg-purple-600 rounded-full text-[10px] px-2 py-0.5 text-white">
            HD
          </span>
        </button>
      </BackgroundGradient>
    </div>
  );
}

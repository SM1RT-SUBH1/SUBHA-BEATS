"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const BackgroundLines = ({
  children,
  className,
  svgOptions,
}: {
  children?: React.ReactNode;
  className?: string;
  svgOptions?: {
    duration?: number;
  };
}) => {
  return (
    <div
      className={cn(
        "h-[30rem] md:h-[40rem] w-full bg-slate-950/70 relative flex items-center justify-center overflow-hidden rounded-3xl border border-white/5",
        className
      )}
    >
      <SVG linesCount={16} duration={svgOptions?.duration ?? 8} />
      <div className="relative z-20 w-full">{children}</div>
    </div>
  );
};

const SVG = ({
  linesCount = 16,
  duration = 8,
}: {
  linesCount?: number;
  duration?: number;
}) => {
  const paths = Array.from({ length: linesCount }, (_, i) => {
    const x1 = (i / (linesCount - 1)) * 1440;
    const x2 = ((linesCount - 1 - i) / (linesCount - 1)) * 1440;
    return `M${x1} 0 C${x1 + 100} 400, ${x2 - 100} 500, ${x2} 900`;
  });

  return (
    <div className="absolute inset-0 pointer-events-none w-full h-full">
      <svg
        className="w-full h-full opacity-35"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        {paths.map((d, index) => (
          <motion.path
            key={index}
            d={d}
            stroke="url(#line-gradient)"
            strokeWidth="1.5"
            strokeDasharray="16 16"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -400 }}
            transition={{
              duration: duration + index * 0.3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
};

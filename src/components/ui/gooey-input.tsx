"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface GooeyInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

export const GooeyInput = React.forwardRef<HTMLInputElement, GooeyInputProps>(
  ({ className, containerClassName, type = "text", ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className={cn("relative flex items-center justify-center w-full max-w-md", containerClassName)}>
        <svg className="hidden">
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                result="goo"
              />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
        </svg>

        <div className="relative w-full group">
          <div
            className={cn(
              "absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 opacity-30 blur-sm transition-all duration-500 group-hover:opacity-75",
              isFocused && "opacity-100 blur-md scale-102"
            )}
          />
          <div className="relative flex items-center rounded-2xl bg-neutral-900/90 border border-neutral-700/60 shadow-xl backdrop-blur-xl px-4 py-2.5">
            <input
              type={type}
              className={cn(
                "w-full bg-transparent text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-0",
                className
              )}
              ref={ref}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              {...props}
            />
          </div>
        </div>
      </div>
    );
  }
);
GooeyInput.displayName = "GooeyInput";

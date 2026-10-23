"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => Promise<any> | any;
}

export const Button = ({
  children,
  className,
  onClick,
  disabled,
  ...props
}: ButtonProps) => {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (status === "loading" || disabled) return;
    if (onClick) {
      try {
        setStatus("loading");
        await onClick();
        setStatus("success");
        setTimeout(() => {
          setStatus("idle");
        }, 2500);
      } catch (err) {
        setStatus("idle");
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={status === "loading" || disabled}
      className={cn(
        "relative flex items-center justify-center min-w-[9rem] px-6 py-2.5 rounded-xl font-medium text-sm text-white overflow-hidden transition-all duration-300 active:scale-95",
        status === "idle" && "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-600/30",
        status === "loading" && "bg-neutral-800 cursor-wait",
        status === "success" && "bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30",
        className
      )}
      {...props}
    >
      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2"
          >
            {children}
          </motion.span>
        )}

        {status === "loading" && (
          <motion.span
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2 text-cyan-400"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing...</span>
          </motion.span>
        )}

        {status === "success" && (
          <motion.span
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex items-center gap-2 text-white font-bold"
          >
            <Check className="w-4 h-4 text-white stroke-[3]" />
            <span>Success!</span>
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

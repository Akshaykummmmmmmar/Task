"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HeroBannerProps {
  greeting: string;
  subtitle: string;
  illustration: React.ReactNode;
  accent: string;
  gradient: string;
  className?: string;
}

export function HeroBanner({ greeting, subtitle, illustration, accent, gradient, className }: HeroBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/20",
        "shadow-[0_12px_40px_rgba(45,42,38,0.08),0_-6px_20px_rgba(255,255,255,0.7)]",
        "min-h-[200px] sm:min-h-[240px]",
        gradient,
        className
      )}
    >
      <div className="absolute inset-0 bg-white/10" />
      <div className="relative z-10 flex h-full items-center justify-between gap-6 px-6 py-6 sm:px-10 sm:py-8">
        <div className="max-w-md flex-1">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className={cn("font-display text-2xl italic leading-tight sm:text-3xl", accent)}
          >
            {greeting}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base"
          >
            {subtitle}
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden flex-shrink-0 sm:block"
        >
          {illustration}
        </motion.div>
      </div>
    </motion.div>
  );
}

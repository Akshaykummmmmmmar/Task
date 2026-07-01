"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ClayCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  as?: "div" | "button";
}

export function ClayCard({ children, className, hover = true, onClick, as = "div" }: ClayCardProps) {
  const Component = motion[as];
  return (
    <Component
      onClick={onClick}
      whileHover={hover ? { y: -4, boxShadow: "0 16px 40px rgba(45,42,38,0.12), 0 -6px 20px rgba(255,255,255,0.8)" } : {}}
      whileTap={onClick ? { scale: 0.98, boxShadow: "inset 0 2px 6px rgba(45,42,38,0.08)" } : {}}
      className={cn(
        "rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20",
        "shadow-[0_8px_24px_rgba(45,42,38,0.08),0_-4px_12px_rgba(255,255,255,0.7)]",
        "transition-colors duration-200",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </Component>
  );
}

"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent: string;
  className?: string;
  delay?: number;
}

export function StatCard({ icon, label, value, accent, className, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(45,42,38,0.1), 0 -4px 16px rgba(255,255,255,0.8)" }}
      className={cn(
        "rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 p-4",
        "shadow-[0_6px_20px_rgba(45,42,38,0.06),0_-3px_10px_rgba(255,255,255,0.6)]",
        className
      )}
    >
      <div className={cn("mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]", accent)}>
        {icon}
      </div>
      <p className="text-lg font-bold text-ink">{value}</p>
      <p className="text-xs text-stone-500">{label}</p>
    </motion.div>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fetchDailyRoutine } from "@/lib/mockApi";
import { RequireRole } from "@/components/RequireRole";
import { GreetingHeader } from "@/components/child/GreetingHeader";
import { ClayCard } from "@/components/child/ClayCard";
import { cn } from "@/lib/utils";
import { DailyRoutineItem } from "@/types";

const CATEGORIES: { key: DailyRoutineItem["category"]; label: string; color: string; bg: string }[] = [
  { key: "morning", label: "Morning", color: "text-sun-700", bg: "bg-sun-50" },
  { key: "training", label: "Training", color: "text-orange-700", bg: "bg-orange-50" },
  { key: "school", label: "School", color: "text-violet-700", bg: "bg-violet-50" },
  { key: "recovery", label: "Recovery", color: "text-sky-700", bg: "bg-sky-50" },
  { key: "evening", label: "Evening", color: "text-sage-700", bg: "bg-sage-50" },
  { key: "night", label: "Night", color: "text-ink", bg: "bg-sand-100" },
];

function RoutineContent() {
  const { data: routine, isLoading } = useQuery({
    queryKey: ["dailyRoutine"],
    queryFn: fetchDailyRoutine,
  });

  return (
    <div className="mx-auto min-h-screen max-w-4xl bg-[#faf7f2] px-4 py-6 sm:px-8 sm:py-10">
      <GreetingHeader childName="Champion" subtitle="Your daily athlete routine" className="mb-6" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "relative overflow-hidden rounded-3xl border border-sun-200/40 px-6 py-6 sm:px-8 sm:py-8",
          "bg-gradient-to-br from-sun-50 via-white to-sun-100/30",
          "shadow-[0_12px_40px_rgba(45,42,38,0.08),0_-6px_20px_rgba(255,255,255,0.7)]"
        )}
      >
        <p className="font-display text-xl italic text-sun-700">Today&apos;s Schedule</p>
        <p className="mt-1 text-sm text-stone-500">Follow this routine to train like a champion!</p>
      </motion.div>

      <div className="mt-8 space-y-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-white/60" />
          ))
        ) : (
          CATEGORIES.map((cat, catIdx) => {
            const items = routine?.filter((r) => r.category === cat.key) ?? [];
            if (items.length === 0) return null;
            return (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: catIdx * 0.1 }}
              >
                <h3 className={cn("mb-3 font-display text-base italic", cat.color)}>{cat.label}</h3>
                <div className="flex flex-col gap-2">
                  {items.map((item, i) => (
                    <ClayCard key={item.time} className="flex items-center gap-4 px-5 py-3" hover={false}>
                      <span className="w-16 text-xs font-medium text-stone-500">{item.time}</span>
                      <span className="text-xl">{item.emoji}</span>
                      <span className="text-sm font-medium text-ink">{item.label}</span>
                      <div className={cn("ml-auto rounded-full px-3 py-0.5 text-xs", cat.bg, cat.color)}>
                        {cat.label}
                      </div>
                    </ClayCard>
                  ))}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function RoutinePage() {
  return (
    <RequireRole role="child">
      <RoutineContent />
    </RequireRole>
  );
}

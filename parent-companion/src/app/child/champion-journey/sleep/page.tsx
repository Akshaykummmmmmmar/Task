"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fetchSleepData } from "@/lib/mockApi";
import { RequireRole } from "@/components/RequireRole";
import { GreetingHeader } from "@/components/child/GreetingHeader";
import { ClayCard } from "@/components/child/ClayCard";
import { cn } from "@/lib/utils";

const RECOVERY_TIPS = [
  { title: "Sleep is when your body grows stronger", desc: "During deep sleep, your body releases growth hormone and repairs muscles.", emoji: "\u{1F634}" },
  { title: "Consistency is key", desc: "Go to bed and wake up at the same time every day — even on weekends!", emoji: "\u{23F0}" },
  { title: "Wind down before bed", desc: "Avoid screens 30 min before sleep. Try reading or light stretching instead.", emoji: "\u{1F4DA}" },
  { title: "Stay hydrated during the day", desc: "Drink enough water throughout the day, but reduce intake 1 hour before bed.", emoji: "\u{1F4A7}" },
  { title: "Listen to your body", desc: "If you feel tired, take a rest day. Recovery is part of training!", emoji: "\u{1F9D8}" },
  { title: "Create a bedtime routine", desc: "A consistent pre-sleep routine signals your body that it's time to rest.", emoji: "\u{1F30C}" },
];

const MOOD_EMOJIS: Record<string, string> = {
  poor: "\u{1F641}", fair: "\u{1F610}", good: "\u{1F60A}", excellent: "\u{1F929}",
};

function SleepContent() {
  const { data: sleepData, isLoading } = useQuery({
    queryKey: ["sleepData"],
    queryFn: fetchSleepData,
  });

  if (isLoading) {
    return (
      <div className="mx-auto min-h-screen max-w-4xl bg-[#faf7f2] px-4 py-6 sm:px-8 sm:py-10">
        <div className="h-8 w-48 animate-pulse rounded bg-sand-200" />
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/60" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-4xl bg-[#faf7f2] px-4 py-6 sm:px-8 sm:py-10">
      <GreetingHeader childName="Champion" subtitle="Rest and recover like a pro!" className="mb-6" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "mb-8 rounded-3xl border border-sun-200/40 px-6 py-6 sm:px-8 sm:py-8",
          "bg-gradient-to-br from-sky-50 via-white to-sky-100/30",
          "shadow-[0_12px_40px_rgba(45,42,38,0.08),0_-6px_20px_rgba(255,255,255,0.7)]"
        )}
      >
        <p className="font-display text-xl italic text-sky-700">Sleep & Recovery</p>
        <p className="mt-1 text-sm text-stone-500">
          Recovery is when your body gets stronger. Sleep is the best recovery!
        </p>
      </motion.div>

      {/* Last Night's Sleep */}
      <ClayCard className="mb-8 p-6">
        <h2 className="mb-4 font-display text-lg italic text-ink">Last Night&apos;s Sleep</h2>
        <div className="flex items-center gap-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-sky-100">
            <span className="text-4xl">{sleepData ? MOOD_EMOJIS[sleepData.quality] : "😴"}</span>
          </div>
          <div className="flex-1">
            <p className="text-2xl font-bold text-sky-700">{sleepData?.duration ?? 0}h</p>
            <p className="text-sm capitalize text-stone-500">Quality: {sleepData?.quality ?? "N/A"}</p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-sky-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((sleepData?.duration ?? 0) / 10) * 100}%` }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full bg-sky-500"
              />
            </div>
            <p className="mt-1 text-xs text-stone-400">Target: 8-10 hours</p>
          </div>
        </div>
      </ClayCard>

      {/* Why Recovery Matters */}
      <ClayCard className="mb-8 p-5">
        <h2 className="mb-3 font-display text-base italic text-ink">Why Recovery Matters</h2>
        <div className="flex flex-col gap-3">
          {[
            { title: "Muscle Repair", desc: "Sleep is when your body repairs and builds muscle tissue after training.", emoji: "\u{1F4AA}" },
            { title: "Mental Refresh", desc: "Rest helps your brain process learning and improves focus for next training.", emoji: "\u{1F9E0}" },
            { title: "Injury Prevention", desc: "Proper recovery reduces the risk of injuries by giving your body time to heal.", emoji: "\u{1F6E1}" },
            { title: "Performance Boost", desc: "Well-rested athletes perform better, run faster, and think clearer.", emoji: "\u{26A1}" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-sky-200/60 bg-sky-50/30 px-4 py-3">
              <span className="text-lg">{item.emoji}</span>
              <div>
                <p className="text-sm font-medium text-ink">{item.title}</p>
                <p className="text-xs text-stone-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </ClayCard>

      {/* Recovery Tips */}
      <h2 className="mb-4 font-display text-lg italic text-sky-700">Recovery Tips</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {RECOVERY_TIPS.map((tip, i) => (
          <motion.div
            key={tip.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="rounded-2xl bg-white/70 border border-white/20 p-4 shadow-[0_6px_20px_rgba(45,42,38,0.06),0_-3px_10px_rgba(255,255,255,0.6)]"
          >
            <span className="text-2xl">{tip.emoji}</span>
            <p className="mt-2 text-sm font-medium text-ink">{tip.title}</p>
            <p className="mt-1 text-xs text-stone-500">{tip.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function SleepPage() {
  return (
    <RequireRole role="child">
      <SleepContent />
    </RequireRole>
  );
}

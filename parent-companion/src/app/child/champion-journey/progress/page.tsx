"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fetchAthleteStats, fetchWeeklyImprovements, fetchAchievements } from "@/lib/mockApi";
import { RequireRole } from "@/components/RequireRole";
import { GreetingHeader } from "@/components/child/GreetingHeader";
import { ClayCard } from "@/components/child/ClayCard";
import { cn } from "@/lib/utils";

const STAT_ITEMS = [
  { key: "strength", label: "Strength", emoji: "\u{1F4AA}" },
  { key: "speed", label: "Speed", emoji: "\u{1F3C3}" },
  { key: "endurance", label: "Endurance", emoji: "\u{1F3C3}" },
  { key: "flexibility", label: "Flexibility", emoji: "\u{1F9D8}" },
  { key: "agility", label: "Agility", emoji: "\u{1F938}" },
  { key: "balance", label: "Balance", emoji: "\u{26F9}" },
  { key: "reactionTime", label: "Reaction", emoji: "\u{26A1}" },
  { key: "sleep", label: "Sleep", emoji: "\u{1F634}" },
  { key: "hydration", label: "Hydration", emoji: "\u{1F4A7}" },
  { key: "trainingConsistency", label: "Consistency", emoji: "\u{1F4CB}" },
  { key: "mood", label: "Mood", emoji: "\u{1F60A}" },
];

function ProgressContent() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["athleteStats"],
    queryFn: fetchAthleteStats,
  });

  const { data: weeklyData } = useQuery({
    queryKey: ["weeklyImprovements"],
    queryFn: fetchWeeklyImprovements,
  });

  const { data: achievements } = useQuery({
    queryKey: ["achievements"],
    queryFn: fetchAchievements,
  });

  if (statsLoading) {
    return (
      <div className="mx-auto min-h-screen max-w-4xl bg-[#faf7f2] px-4 py-6 sm:px-8 sm:py-10">
        <div className="h-8 w-48 animate-pulse rounded bg-sand-200" />
        <div className="mt-8 grid grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/60" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-4xl bg-[#faf7f2] px-4 py-6 sm:px-8 sm:py-10">
      <GreetingHeader childName="Champion" subtitle="Track your athletic progress" className="mb-6" />

      {/* Overall Score */}
      <ClayCard className="mb-8 flex items-center gap-6 p-6">
        <div className="relative flex h-28 w-28 flex-shrink-0 items-center justify-center">
          <svg width="112" height="112" className="absolute">
            <circle cx="56" cy="56" r="48" fill="none" stroke="#F1EAD9" strokeWidth="8" />
            <motion.circle
              cx="56" cy="56" r="48" fill="none" stroke="#C9821C" strokeWidth="8"
              strokeLinecap="round" strokeDasharray={2 * Math.PI * 48}
              initial={{ strokeDashoffset: 2 * Math.PI * 48 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 48 * (1 - (stats?.overallScore ?? 0) / 100) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="transform -rotate-90 origin-center"
            />
          </svg>
          <div className="text-center">
            <p className="text-2xl font-bold text-sun-600">{stats?.overallScore ?? 0}%</p>
            <p className="text-[10px] text-stone-500">Overall</p>
          </div>
        </div>
        <div>
          <p className="font-display text-lg italic text-ink">Athlete Score</p>
          <p className="mt-1 text-sm text-stone-500">
            Keep training consistently to improve your overall score!
          </p>
        </div>
      </ClayCard>

      {/* All Stats */}
      <h2 className="mb-4 font-display text-lg italic text-sun-700">Performance Metrics</h2>
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {STAT_ITEMS.map((item, i) => {
          const value = stats?.[item.key as keyof typeof stats] ?? 0;
          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
              className="rounded-2xl bg-white/70 border border-white/20 p-4 shadow-[0_6px_20px_rgba(45,42,38,0.06),0_-3px_10px_rgba(255,255,255,0.6)]"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-lg">{item.emoji}</span>
                <span className="text-sm font-bold text-sun-600">{value}%</span>
              </div>
              <p className="text-xs text-stone-500">{item.label}</p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-sand-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.03 }}
                  className="h-full rounded-full bg-sun-500"
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Weekly Progress Chart */}
      <h2 className="mb-4 font-display text-lg italic text-sun-700">Weekly Improvements</h2>
      <ClayCard className="mb-8 p-5">
        <div className="flex flex-col gap-4">
          {weeklyData && (
            <div className="flex flex-col gap-3">
              {["strength", "speed", "endurance", "agility"].map((metric) => (
                <div key={metric}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-stone-600 capitalize">{metric}</span>
                    <span className="text-sun-600">{weeklyData[weeklyData.length - 1][metric as keyof typeof weeklyData[0]]}%</span>
                  </div>
                  <div className="flex items-end gap-1 h-12">
                    {weeklyData.map((week, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${week[metric as keyof typeof week]}%` }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="flex-1 rounded-t bg-sun-400/60"
                        style={{ height: `${(Number(week[metric as keyof typeof week]) / 100) * 48}px` }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ClayCard>

      {/* Achievements */}
      <h2 className="mb-4 font-display text-lg italic text-sun-700">Achievements</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {achievements?.map((ach, i) => (
          <motion.div
            key={ach.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.03 }}
            className={cn(
              "rounded-2xl border p-4 text-center transition-all",
              ach.unlocked
                ? "border-sun-300 bg-sun-50 shadow-[0_4px_12px_rgba(201,130,28,0.15)]"
                : "border-sand-200 bg-white/50 opacity-60"
            )}
          >
            <span className="text-3xl">{ach.emoji}</span>
            <p className={cn("mt-1 text-sm font-medium", ach.unlocked ? "text-sun-700" : "text-stone-400")}>
              {ach.title}
            </p>
            <p className="mt-0.5 text-xs text-stone-500">{ach.description}</p>
            {ach.unlocked && ach.unlockedAt && (
              <p className="mt-1 text-[10px] text-sun-500">
                Unlocked {new Date(ach.unlockedAt).toLocaleDateString()}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function ProgressPage() {
  return (
    <RequireRole role="child">
      <ProgressContent />
    </RequireRole>
  );
}

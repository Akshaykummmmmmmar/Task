"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { fetchLegendAthletes } from "@/lib/mockApi";
import { RequireRole } from "@/components/RequireRole";
import { GreetingHeader } from "@/components/child/GreetingHeader";
import { ClayCard } from "@/components/child/ClayCard";
import { cn } from "@/lib/utils";

function LegendsContent() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: athletes, isLoading } = useQuery({
    queryKey: ["legendAthletes"],
    queryFn: fetchLegendAthletes,
  });

  const selected = athletes?.find((a) => a.id === selectedId);

  if (isLoading) {
    return (
      <div className="mx-auto min-h-screen max-w-4xl bg-[#faf7f2] px-4 py-6 sm:px-8 sm:py-10">
        <div className="h-8 w-48 animate-pulse rounded bg-sand-200" />
        <div className="mt-8 grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/60" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-4xl bg-[#faf7f2] px-4 py-6 sm:px-8 sm:py-10">
      <GreetingHeader childName="Champion" subtitle="Learn from the greatest athletes!" className="mb-6" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "mb-8 rounded-3xl border border-sun-200/40 px-6 py-6 sm:px-8 sm:py-8",
          "bg-gradient-to-br from-sun-50 via-white to-sun-100/30",
          "shadow-[0_12px_40px_rgba(45,42,38,0.08),0_-6px_20px_rgba(255,255,255,0.7)]"
        )}
      >
        <p className="font-display text-xl italic text-sun-700">Learn From Legends</p>
        <p className="mt-1 text-sm text-stone-500">
          Discover how the greatest athletes trained, ate, slept, and overcame challenges.
        </p>
      </motion.div>

      {/* Athlete Grid */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {athletes?.map((athlete, i) => (
          <motion.button
            key={athlete.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            whileHover={{ y: -6, boxShadow: "0 16px 40px rgba(45,42,38,0.12), 0 -6px 20px rgba(255,255,255,0.8)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelectedId(selectedId === athlete.id ? null : athlete.id)}
            className={cn(
              "flex flex-col items-center gap-3 rounded-2xl border-2 p-5 text-center transition-all",
              "shadow-[0_6px_20px_rgba(45,42,38,0.06),0_-3px_10px_rgba(255,255,255,0.6)]",
              selectedId === athlete.id
                ? "border-sun-400 bg-sun-50"
                : "border-transparent bg-white/70 hover:border-sun-200"
            )}
          >
            <span className="text-4xl">{athlete.emoji}</span>
            <div>
              <p className="text-sm font-medium text-ink">{athlete.name}</p>
              <p className="text-xs text-stone-500">{athlete.sport}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Selected Athlete Detail */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
          >
            {/* Bio */}
            <ClayCard className="mb-6 p-6">
              <div className="flex items-start gap-4">
                <span className="text-5xl">{selected.emoji}</span>
                <div>
                  <h2 className="font-display text-2xl italic text-ink">{selected.name}</h2>
                  <p className="text-sm text-stone-500">{selected.sport} Legend</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink">{selected.biography}</p>
                </div>
              </div>
            </ClayCard>

            {/* Routine, Diet, Training, Sleep */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { title: "Daily Routine", content: selected.dailyRoutine, emoji: "\u{23F0}" },
                { title: "Diet & Nutrition", content: selected.diet, emoji: "\u{1F966}" },
                { title: "Training", content: selected.training, emoji: "\u{1F3CB}" },
                { title: "Sleep & Recovery", content: selected.sleepAndRecovery, emoji: "\u{1F634}" },
              ].map((section) => (
                <ClayCard key={section.title} className="p-5" hover={false}>
                  <span className="text-2xl">{section.emoji}</span>
                  <p className="mt-2 font-display text-base italic text-sun-700">{section.title}</p>
                  <p className="mt-1 text-sm text-ink">{section.content}</p>
                </ClayCard>
              ))}
            </div>

            {/* Challenges & Failures */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ClayCard className="p-5">
                <h3 className="mb-3 font-display text-base italic text-ink">Challenges Faced</h3>
                <ul className="flex flex-col gap-2">
                  {selected.challenges.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="mt-0.5 text-xs">😤</span>
                      <span className="text-ink">{c}</span>
                    </li>
                  ))}
                </ul>
              </ClayCard>
              <ClayCard className="p-5">
                <h3 className="mb-3 font-display text-base italic text-ink">Failures & Setbacks</h3>
                <ul className="flex flex-col gap-2">
                  {selected.failures.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="mt-0.5 text-xs">💔</span>
                      <span className="text-ink">{f}</span>
                    </li>
                  ))}
                </ul>
              </ClayCard>
            </div>

            {/* Achievements & Mindset */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ClayCard className="p-5">
                <h3 className="mb-3 font-display text-base italic text-ink">Achievements 🏆</h3>
                <ul className="flex flex-col gap-2">
                  {selected.achievements.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="mt-0.5 text-xs">⭐</span>
                      <span className="text-ink">{a}</span>
                    </li>
                  ))}
                </ul>
              </ClayCard>
              <ClayCard className="p-5">
                <h3 className="mb-3 font-display text-base italic text-ink">Mindset 🧠</h3>
                <ul className="flex flex-col gap-2">
                  {selected.mindset.map((m, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="mt-0.5 text-sun-500">💡</span>
                      <span className="text-ink">{m}</span>
                    </li>
                  ))}
                </ul>
              </ClayCard>
            </div>

            {/* Lessons for You */}
            <ClayCard className="p-6">
              <h3 className="mb-4 font-display text-xl italic text-sun-700">Lessons for You, Champion! 🌟</h3>
              <div className="flex flex-col gap-3">
                {selected.lessons.map((lesson, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-sun-200/60 bg-sun-50/30 px-5 py-4"
                  >
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-sun-200 text-xs font-bold text-sun-700">
                      {i + 1}
                    </span>
                    <p className="text-sm text-ink">{lesson}</p>
                  </div>
                ))}
              </div>
            </ClayCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LegendsPage() {
  return (
    <RequireRole role="child">
      <LegendsContent />
    </RequireRole>
  );
}

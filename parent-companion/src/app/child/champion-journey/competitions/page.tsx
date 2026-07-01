"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { fetchCompetitions } from "@/lib/mockApi";
import { RequireRole } from "@/components/RequireRole";
import { GreetingHeader } from "@/components/child/GreetingHeader";
import { ClayCard } from "@/components/child/ClayCard";
import { cn } from "@/lib/utils";

function CompetitionsContent() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: competitions, isLoading } = useQuery({
    queryKey: ["competitions"],
    queryFn: fetchCompetitions,
  });

  if (isLoading) {
    return (
      <div className="mx-auto min-h-screen max-w-4xl bg-[#faf7f2] px-4 py-6 sm:px-8 sm:py-10">
        <div className="h-8 w-48 animate-pulse rounded bg-sand-200" />
        <div className="mt-8 space-y-4">{Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/60" />)}</div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-4xl bg-[#faf7f2] px-4 py-6 sm:px-8 sm:py-10">
      <GreetingHeader childName="Champion" subtitle="Plan and prepare for competitions!" className="mb-6" />

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
        <p className="font-display text-xl italic text-sun-700">Competition Planner</p>
        <p className="mt-1 text-sm text-stone-500">Prepare like a champion for your upcoming events!</p>
      </motion.div>

      {competitions?.map((comp, idx) => (
        <motion.div
          key={comp.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
          className="mb-6"
        >
          <ClayCard className={cn("p-6", expandedId === comp.id && "border-sun-300")}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🏅</span>
                  <div>
                    <h2 className="font-display text-lg italic text-ink">{comp.name}</h2>
                    <p className="text-sm text-stone-500">
                      {new Date(comp.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>

                {/* Countdown */}
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center gap-2 rounded-xl bg-sun-50 px-4 py-2">
                    <span className="text-xl">⏱️</span>
                    <span className="text-lg font-bold text-sun-700">{comp.countdown}</span>
                    <span className="text-xs text-stone-500">days to go</span>
                  </div>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-sand-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, Math.max(0, 100 - comp.countdown))}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full rounded-full bg-sun-500"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setExpandedId(expandedId === comp.id ? null : comp.id)}
                className="ml-4 rounded-xl bg-sun-100 px-4 py-2 text-sm font-medium text-sun-700 transition-all hover:bg-sun-200"
              >
                {expandedId === comp.id ? "Less ↑" : "Details ↓"}
              </button>
            </div>

            <AnimatePresence>
              {expandedId === comp.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <h3 className="mb-2 font-display text-sm italic text-sun-700">✅ Preparation Checklist</h3>
                      <ul className="flex flex-col gap-1.5">
                        {comp.preparationChecklist.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-ink">
                            <span className="text-sun-500">•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="mb-2 font-display text-sm italic text-sun-700">🏋️ Training Suggestions</h3>
                      <ul className="flex flex-col gap-1.5">
                        {comp.trainingSuggestions.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-ink">
                            <span className="text-sun-500">•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="mb-2 font-display text-sm italic text-sun-700">🥗 Nutrition</h3>
                      <ul className="flex flex-col gap-1.5">
                        {comp.nutritionSuggestions.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-ink">
                            <span className="text-sun-500">•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="mb-2 font-display text-sm italic text-sun-700">🔄 Recovery Plan</h3>
                      <ul className="flex flex-col gap-1.5">
                        {comp.recoveryPlan.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-ink">
                            <span className="text-sun-500">•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="sm:col-span-2">
                      <h3 className="mb-2 font-display text-sm italic text-sun-700">🧠 Mental Preparation</h3>
                      <ul className="flex flex-col gap-1.5">
                        {comp.mentalPreparation.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-ink">
                            <span className="text-sun-500">•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </ClayCard>
        </motion.div>
      ))}

      {(!competitions || competitions.length === 0) && (
        <ClayCard className="p-8 text-center">
          <span className="text-4xl">🏅</span>
          <p className="mt-3 font-display text-lg italic text-ink">No competitions planned yet!</p>
          <p className="mt-1 text-sm text-stone-500">Your coach will help you prepare when an event is coming up.</p>
        </ClayCard>
      )}
    </div>
  );
}

export default function CompetitionsPage() {
  return (
    <RequireRole role="child">
      <CompetitionsContent />
    </RequireRole>
  );
}

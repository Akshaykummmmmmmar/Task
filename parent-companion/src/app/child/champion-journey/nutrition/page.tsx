"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fetchNutritionPlan } from "@/lib/mockApi";
import { RequireRole } from "@/components/RequireRole";
import { GreetingHeader } from "@/components/child/GreetingHeader";
import { ClayCard } from "@/components/child/ClayCard";
import { cn } from "@/lib/utils";

const MEAL_SECTIONS = [
  { key: "breakfast", emoji: "\u{1F966}" },
  { key: "lunch", emoji: "\u{1F357}" },
  { key: "dinner", emoji: "\u{1F958}" },
  { key: "snacks", emoji: "\u{1F34E}" },
] as const;

function NutritionContent() {
  const { data: plan, isLoading } = useQuery({
    queryKey: ["nutritionPlan"],
    queryFn: fetchNutritionPlan,
  });

  if (isLoading) {
    return (
      <div className="mx-auto min-h-screen max-w-4xl bg-[#faf7f2] px-4 py-6 sm:px-8 sm:py-10">
        <div className="h-8 w-48 animate-pulse rounded bg-sand-200" />
        <div className="mt-8 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/60" />
          ))}
        </div>
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div className="mx-auto min-h-screen max-w-4xl bg-[#faf7f2] px-4 py-6 sm:px-8 sm:py-10">
      <GreetingHeader childName="Champion" subtitle="Fuel your body like a champion!" className="mb-6" />

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
        <p className="font-display text-xl italic text-sun-700">Nutrition Coach</p>
        <p className="mt-1 text-sm text-stone-500">
          Proper nutrition is the foundation of athletic performance. Eat to fuel your training!
        </p>
      </motion.div>

      {/* Meals */}
      <div className="mb-8 space-y-4">
        {MEAL_SECTIONS.map((section, idx) => {
          const meal = plan[section.key as keyof typeof plan] as { meal: string; items: string[]; explanation: string; emoji: string };
          return (
            <motion.div
              key={section.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <ClayCard className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-sun-100 text-2xl">
                    {meal.emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-base italic text-sun-700">{meal.meal}</h3>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {meal.items.map((item, i) => (
                        <li key={i} className="rounded-full bg-sun-50 px-3 py-1 text-xs text-sun-700">
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 text-xs leading-relaxed text-stone-500">
                      💡 {meal.explanation}
                    </p>
                  </div>
                </div>
              </ClayCard>
            </motion.div>
          );
        })}
      </div>

      {/* Hydration */}
      <h2 className="mb-4 font-display text-lg italic text-sun-700">💧 Hydration</h2>
      <ClayCard className="mb-8 p-5">
        <ul className="flex flex-col gap-2">
          {plan.hydration.map((tip, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-ink">
              <span className="text-sun-500">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </ClayCard>

      {/* Pre & Post Workout */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ClayCard className="p-5">
          <h3 className="mb-3 font-display text-base italic text-sun-700">⚡ Pre-Workout</h3>
          <ul className="flex flex-col gap-2">
            {plan.preWorkout.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-ink">
                <span className="text-xs text-sun-500">→</span>
                {item}
              </li>
            ))}
          </ul>
        </ClayCard>
        <ClayCard className="p-5">
          <h3 className="mb-3 font-display text-base italic text-sun-700">🔄 Post-Workout</h3>
          <ul className="flex flex-col gap-2">
            {plan.postWorkout.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-ink">
                <span className="text-xs text-sun-500">→</span>
                {item}
              </li>
            ))}
          </ul>
        </ClayCard>
      </div>

      {/* Healthy Alternatives */}
      <h2 className="mb-4 font-display text-lg italic text-sun-700">🌿 Healthy Alternatives</h2>
      <ClayCard className="p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {plan.healthyAlternatives.map((alt, i) => (
            <div key={i} className="rounded-xl border border-sun-200/60 bg-sun-50/30 px-4 py-3 text-sm text-ink">
              {alt}
            </div>
          ))}
        </div>
      </ClayCard>
    </div>
  );
}

export default function NutritionPage() {
  return (
    <RequireRole role="child">
      <NutritionContent />
    </RequireRole>
  );
}

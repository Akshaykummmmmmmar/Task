"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fetchParentInsights, fetchAchievements, fetchAthleteStats } from "@/lib/mockApi";
import { RequireRole } from "@/components/RequireRole";
import { GreetingHeader } from "@/components/child/GreetingHeader";
import { ClayCard } from "@/components/child/ClayCard";
import { cn } from "@/lib/utils";

function ParentInsightsContent() {
  const { data: insights, isLoading } = useQuery({
    queryKey: ["parentInsights"],
    queryFn: fetchParentInsights,
  });

  const { data: achievements } = useQuery({
    queryKey: ["achievements"],
    queryFn: fetchAchievements,
  });

  const { data: stats } = useQuery({
    queryKey: ["athleteStats"],
    queryFn: fetchAthleteStats,
  });

  if (isLoading) {
    return (
      <div className="mx-auto min-h-screen max-w-4xl bg-[#faf7f2] px-4 py-6 sm:px-8 sm:py-10">
        <div className="h-8 w-48 animate-pulse rounded bg-sand-200" />
        <div className="mt-8 space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/60" />)}</div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-4xl bg-[#faf7f2] px-4 py-6 sm:px-8 sm:py-10">
      <GreetingHeader childName="Champion" subtitle="Parent insights and progress reports" className="mb-6" />

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
        <p className="font-display text-xl italic text-sun-700">Parent Dashboard</p>
        <p className="mt-1 text-sm text-stone-500">Track your child&apos;s athletic journey and progress.</p>
      </motion.div>

      {/* Overview Stats */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Training Consistency", value: `${insights?.trainingConsistency ?? 0}%`, emoji: "\u{1F4CB}" },
          { label: "Achievements", value: insights?.achievements ?? 0, emoji: "\u{1F3C6}" },
          { label: "Overall Progress", value: `${insights?.overallProgress ?? 0}%`, emoji: "\u{1F4C8}" },
          { label: "Avg Sleep", value: `${insights?.sleepAvg ?? 0}h`, emoji: "\u{1F634}" },
          { label: "Nutrition Score", value: `${insights?.nutritionScore ?? 0}%`, emoji: "\u{1F966}" },
          { label: "Mood (avg)", value: `${insights?.moodAvg ?? 0}/5`, emoji: "\u{1F60A}" },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="rounded-2xl bg-white/70 border border-white/20 p-4 text-center shadow-[0_6px_20px_rgba(45,42,38,0.06),0_-3px_10px_rgba(255,255,255,0.6)]"
          >
            <span className="text-2xl">{item.emoji}</span>
            <p className="mt-1 text-lg font-bold text-sun-600">{item.value}</p>
            <p className="text-xs text-stone-500">{item.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Weekly Report */}
      <ClayCard className="mb-6 p-6">
        <h2 className="mb-3 font-display text-lg italic text-sun-700">📋 Weekly Report</h2>
        <p className="text-sm leading-relaxed text-ink">{insights?.weeklyReport}</p>
      </ClayCard>

      {/* Monthly Report */}
      <ClayCard className="mb-6 p-6">
        <h2 className="mb-3 font-display text-lg italic text-sun-700">📊 Monthly Report</h2>
        <p className="text-sm leading-relaxed text-ink">{insights?.monthlyReport}</p>
      </ClayCard>

      {/* Coach Recommendations */}
      <ClayCard className="mb-6 p-6">
        <h2 className="mb-3 font-display text-lg italic text-sun-700">💡 Coach Recommendations</h2>
        <div className="flex flex-col gap-2">
          {insights?.coachRecommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-sun-200/60 bg-sun-50/30 px-4 py-3">
              <span className="mt-0.5 text-sm text-sun-600">{i + 1}.</span>
              <p className="text-sm text-ink">{rec}</p>
            </div>
          ))}
        </div>
      </ClayCard>

      {/* Areas Needing Improvement */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ClayCard className="p-6">
          <h2 className="mb-3 font-display text-lg italic text-ink">🎯 Areas to Improve</h2>
          <div className="flex flex-wrap gap-2">
            {insights?.areasNeedingImprovement.map((area) => (
              <span key={area} className="rounded-full bg-clay-100 px-3 py-1.5 text-xs font-medium text-clay-700">
                {area}
              </span>
            ))}
          </div>
        </ClayCard>
        <ClayCard className="p-6">
          <h2 className="mb-3 font-display text-lg italic text-ink">🏆 Recent Achievements</h2>
          <div className="flex flex-wrap gap-2">
            {achievements?.filter((a) => a.unlocked).map((ach) => (
              <span key={ach.id} className="rounded-full bg-sun-100 px-3 py-1.5 text-xs font-medium text-sun-700">
                {ach.emoji} {ach.title}
              </span>
            ))}
            {achievements?.filter((a) => a.unlocked).length === 0 && (
              <p className="text-sm text-stone-400">No achievements unlocked yet</p>
            )}
          </div>
        </ClayCard>
      </div>

      {/* Sport-Specific Stats */}
      <ClayCard className="p-6">
        <h2 className="mb-4 font-display text-lg italic text-sun-700">Performance Metrics</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats && [
            { label: "Strength", value: stats.strength },
            { label: "Speed", value: stats.speed },
            { label: "Endurance", value: stats.endurance },
            { label: "Agility", value: stats.agility },
          ].map((metric) => (
            <div key={metric.label} className="text-center">
              <p className="text-lg font-bold text-sun-600">{metric.value}%</p>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-sand-100">
                <div className="h-full rounded-full bg-sun-500" style={{ width: `${metric.value}%` }} />
              </div>
              <p className="mt-1 text-xs text-stone-500">{metric.label}</p>
            </div>
          ))}
        </div>
      </ClayCard>
    </div>
  );
}

export default function ParentInsightsPage() {
  return (
    <RequireRole role="child">
      <ParentInsightsContent />
    </RequireRole>
  );
}

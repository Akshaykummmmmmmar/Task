"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { fetchDailyMissions, updateMission } from "@/lib/mockApi";
import { RequireRole } from "@/components/RequireRole";
import { GreetingHeader } from "@/components/child/GreetingHeader";
import { ClayCard } from "@/components/child/ClayCard";
import { cn } from "@/lib/utils";
import { SparkleIcon, StarIcon } from "@/components/icons";
import { DailyMission } from "@/types";

function MissionsContent() {
  const queryClient = useQueryClient();
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState<string | null>(null);

  const { data: missions, isLoading } = useQuery({
    queryKey: ["dailyMissions"],
    queryFn: fetchDailyMissions,
  });

  const completeMutation = useMutation({
    mutationFn: (missionId: string) => updateMission(missionId, { completed: true, progress: 100 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dailyMissions"] });
    },
  });

  function handleComplete(mission: DailyMission) {
    if (mission.completed) return;
    setCompletingId(mission.id);
    setShowAnimation(mission.id);
    setTimeout(() => {
      completeMutation.mutate(mission.id);
      setCompletingId(null);
      setTimeout(() => setShowAnimation(null), 1500);
    }, 800);
  }

  const totalXp = missions?.reduce((sum, m) => sum + (m.completed ? m.xp : 0), 0) ?? 0;
  const totalCoins = missions?.reduce((sum, m) => sum + (m.completed ? m.coins : 0), 0) ?? 0;
  const completedCount = missions?.filter((m) => m.completed).length ?? 0;
  const totalMissions = missions?.length ?? 0;

  return (
    <div className="mx-auto min-h-screen max-w-4xl bg-[#faf7f2] px-4 py-6 sm:px-8 sm:py-10">
      <GreetingHeader childName="Champion" subtitle="Complete missions and earn rewards!" className="mb-6" />

      {/* Stats */}
      <div className="mb-8 grid grid-cols-3 gap-3">
        <ClayCard className="p-4 text-center" hover={false}>
          <SparkleIcon className="mx-auto mb-1 h-5 w-5 text-sun-500" />
          <p className="text-lg font-bold text-sun-600">{totalXp}</p>
          <p className="text-xs text-stone-500">Total XP</p>
        </ClayCard>
        <ClayCard className="p-4 text-center" hover={false}>
          <StarIcon className="mx-auto mb-1 h-5 w-5 text-sun-500" />
          <p className="text-lg font-bold text-sun-600">{totalCoins}</p>
          <p className="text-xs text-stone-500">Coins</p>
        </ClayCard>
        <ClayCard className="p-4 text-center" hover={false}>
          <span className="mb-1 block text-center text-xl">🏆</span>
          <p className="text-lg font-bold text-sun-600">{completedCount}/{totalMissions}</p>
          <p className="text-xs text-stone-500">Completed</p>
        </ClayCard>
      </div>

      {/* Mission list */}
      <div className="flex flex-col gap-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/60" />
          ))
        ) : (
          missions?.map((mission, i) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={cn(
                "relative overflow-hidden rounded-2xl border transition-all",
                "shadow-[0_6px_20px_rgba(45,42,38,0.06),0_-3px_10px_rgba(255,255,255,0.6)]",
                mission.completed
                  ? "border-sage-300 bg-sage-50/50"
                  : "border-white/20 bg-white/70"
              )}
            >
              <div className="flex items-center gap-4 px-5 py-4">
                <div className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-2xl text-2xl",
                  mission.completed ? "bg-sage-100" : "bg-sun-100"
                )}>
                  {mission.completed ? "✅" : mission.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className={cn("text-sm font-medium", mission.completed ? "text-sage-700 line-through" : "text-ink")}>
                      {mission.title}
                    </p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-sun-600">+{mission.xp} XP</span>
                      <span className="text-sun-500">+{mission.coins} 🪙</span>
                    </div>
                  </div>
                  <p className="mt-0.5 text-xs text-stone-500">{mission.description}</p>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-sand-100">
                    <motion.div
                      className={cn("h-full rounded-full", mission.completed ? "bg-sage-500" : "bg-sun-500")}
                      initial={{ width: 0 }}
                      animate={{ width: `${(mission.progress / mission.target) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </div>
                  <p className="mt-0.5 text-xs text-stone-400">{mission.progress}/{mission.target}</p>
                </div>
                <button
                  onClick={() => handleComplete(mission)}
                  disabled={mission.completed || completingId === mission.id}
                  className={cn(
                    "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-all",
                    mission.completed
                      ? "bg-sage-200 text-sage-600"
                      : "border-2 border-sun-300 bg-white text-sun-600 hover:bg-sun-50"
                  )}
                >
                  {mission.completed ? "✓" : completingId === mission.id ? "..." : ""}
                </button>
              </div>

              {/* Completion animation */}
              {showAnimation === mission.id && (
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: "-100%" }}
                  transition={{ duration: 1.5, ease: "easeIn" }}
                  className="absolute inset-0 flex items-center justify-center bg-sage-500/80 backdrop-blur-sm"
                >
                  <motion.span
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="text-4xl"
                  >
                    🎉
                  </motion.span>
                </motion.div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

export default function MissionsPage() {
  return (
    <RequireRole role="child">
      <MissionsContent />
    </RequireRole>
  );
}

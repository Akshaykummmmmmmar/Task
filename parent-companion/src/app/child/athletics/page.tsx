"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/lib/session";
import { motion } from "framer-motion";
import { fetchChildById, fetchReminders, updateReminder, sendNotification } from "@/lib/mockApi";
import { isOverdue } from "@/lib/utils";
import { Reminder } from "@/types";
import { ChildTaskCard } from "@/components/ChildTaskCard";
import { ExerciseIcon, BadgeIcon, SparkleIcon, StarIcon } from "@/components/icons";
import { RequireRole } from "@/components/RequireRole";
import { HeroBanner } from "@/components/child/HeroBanner";
import { ClayCard } from "@/components/child/ClayCard";
import { StatCard } from "@/components/child/StatCard";
import { GreetingHeader } from "@/components/child/GreetingHeader";
import { AthleteIllustration } from "@/components/child/illustrations";

const WORKOUT_TIPS = [
  { title: "Warm-up", desc: "5 min jumping jacks or light jog", emoji: "\u{1F525}" },
  { title: "Cardio", desc: "15 min running, cycling, or dancing", emoji: "\u{1F3C3}" },
  { title: "Strength", desc: "10 push-ups, squats, or planks", emoji: "\u{1F4AA}" },
  { title: "Cool Down", desc: "5 min stretching exercises", emoji: "\u{1F9D8}" },
];

function AthleticsContent() {
  const { session } = useSession();
  const queryClient = useQueryClient();
  const childId = session?.childId;

  const { data: child } = useQuery({
    queryKey: ["child", childId],
    queryFn: () => fetchChildById(childId!),
    enabled: !!childId,
  });

  const { data: reminders, isLoading } = useQuery({
    queryKey: ["reminders"],
    queryFn: fetchReminders,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: { status: "pending" | "completed" } }) =>
      updateReminder(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reminders"] }),
  });

  function handleComplete(r: Reminder) {
    const nextStatus = r.status === "completed" ? "pending" : "completed";
    updateMutation.mutate({ id: r.id, patch: { status: nextStatus } });
    if (nextStatus === "completed") sendNotification({ ...r, status: nextStatus });
  }

  const mine = useMemo(
    () => (reminders ?? []).filter((r) => r.childId === childId && r.type === "exercise"),
    [reminders, childId]
  );

  const todo = mine.filter((r) => r.status === "pending");
  const done = mine.filter((r) => r.status === "completed");
  const streak = done.length;
  const progress = mine.length > 0 ? Math.round((done.length / mine.length) * 100) : 0;

  const name = child?.name?.split(" ")[0] ?? "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="mx-auto min-h-screen max-w-4xl bg-[#faf7f2] px-4 py-6 sm:px-8 sm:py-10">
      <GreetingHeader
        childName={child?.name?.split(" ")[0]}
        subtitle="Move your body every day!"
        className="mb-6"
      />

      <HeroBanner
        greeting={`${greeting}, ${name} 👋`}
        subtitle="Time to get moving! Let's build a healthy body!"
        illustration={<AthleteIllustration />}
        accent="text-orange-700"
        gradient="bg-gradient-to-br from-orange-50 via-white to-orange-100/30"
        className="mb-8"
      />

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={<ExerciseIcon className="h-5 w-5" />} label="Today's Tasks" value={mine.length} accent="text-orange-600" delay={0.1} />
        <StatCard icon={<BadgeIcon className="h-5 w-5" />} label="Completed" value={done.length} accent="text-sage-600" delay={0.15} />
        <StatCard icon={<SparkleIcon className="h-5 w-5" />} label="Fitness Score" value={`${progress}%`} accent="text-orange-600" delay={0.2} />
        <StatCard icon={<StarIcon className="h-5 w-5" />} label="Streak" value={`${streak}d`} accent="text-sun-600" delay={0.25} />
      </div>

      {/* Daily Workout Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mb-8"
      >
        <ClayCard className="p-5 sm:p-6">
          <h2 className="mb-4 font-display text-lg italic text-ink">Today&apos;s Workout Plan</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {WORKOUT_TIPS.map((tip, i) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                className="flex items-start gap-3 rounded-xl border border-orange-200/60 bg-orange-50/50 px-4 py-3 shadow-[0_2px_6px_rgba(0,0,0,0.03)]"
              >
                <span className="text-xl">{tip.emoji}</span>
                <div>
                  <p className="text-sm font-medium text-ink">{tip.title}</p>
                  <p className="text-xs text-stone-500">{tip.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </ClayCard>
      </motion.div>

      {/* Exercise Tasks */}
      <ClayCard className="p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl italic text-ink">Exercise Tasks</h2>
          {mine.length > 0 && (
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">{done.length}/{mine.length} done</span>
          )}
        </div>

        {mine.length > 0 && (
          <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-orange-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="h-full rounded-full bg-orange-500"
            />
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-white/60" />
            ))}
          </div>
        ) : todo.length > 0 ? (
          <div className="flex flex-col gap-3">
            {todo.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}>
                <ChildTaskCard reminder={r} overdue={isOverdue(r)} onComplete={handleComplete} />
              </motion.div>
            ))}
          </div>
        ) : mine.length > 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/30 px-6 py-10 text-center">
            <BadgeIcon className="h-10 w-10 text-orange-500" />
            <p className="font-display text-lg italic text-ink">All exercise done! 💪</p>
          </div>
        ) : (
          <p className="text-sm text-stone-400 italic">No exercise tasks today.</p>
        )}
      </ClayCard>

      {done.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }} className="mt-8">
          <ClayCard className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <SparkleIcon className="h-5 w-5 text-sun-500" />
              <h2 className="font-display text-lg italic text-ink">Completed</h2>
            </div>
            <div className="flex flex-col gap-3">
              {done.map((r) => (
                <ChildTaskCard key={r.id} reminder={r} onComplete={handleComplete} />
              ))}
            </div>
          </ClayCard>
        </motion.div>
      )}
    </div>
  );
}

export default function AthleticsPage() {
  return (
    <RequireRole role="child">
      <AthleticsContent />
    </RequireRole>
  );
}

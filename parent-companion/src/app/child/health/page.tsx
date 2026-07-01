"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/lib/session";
import { motion } from "framer-motion";
import { fetchChildById, fetchReminders, updateReminder, sendNotification } from "@/lib/mockApi";
import { isOverdue } from "@/lib/utils";
import { Reminder, ReminderType } from "@/types";
import { ChildTaskCard } from "@/components/ChildTaskCard";
import { MealIcon, SupplementIcon, WaterIcon, ExerciseIcon, SleepIcon, BadgeIcon, SparkleIcon } from "@/components/icons";
import { RequireRole } from "@/components/RequireRole";
import { HeroBanner } from "@/components/child/HeroBanner";
import { ClayCard } from "@/components/child/ClayCard";
import { StatCard } from "@/components/child/StatCard";
import { GreetingHeader } from "@/components/child/GreetingHeader";
import { DoctorIllustration } from "@/components/child/illustrations";
import { cn } from "@/lib/utils";

const HEALTH_GROUPS: { label: string; types: ReminderType[]; icon: React.ComponentType<{ className?: string }>; accent: string; bg: string }[] = [
  { label: "Meals", types: ["meal"], icon: MealIcon, accent: "text-sage-600", bg: "bg-sage-50" },
  { label: "Medicine", types: ["supplement"], icon: SupplementIcon, accent: "text-clay-600", bg: "bg-clay-50" },
  { label: "Water", types: ["water"], icon: WaterIcon, accent: "text-sky-600", bg: "bg-sky-50" },
  { label: "Exercise", types: ["exercise"], icon: ExerciseIcon, accent: "text-lime-600", bg: "bg-lime-50" },
  { label: "Sleep", types: ["sleep"], icon: SleepIcon, accent: "text-violet-600", bg: "bg-violet-50" },
];

const ALL_HEALTH_TYPES: ReminderType[] = HEALTH_GROUPS.flatMap((g) => g.types);

function HealthContent() {
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
    () => (reminders ?? []).filter((r) => r.childId === childId && ALL_HEALTH_TYPES.includes(r.type)),
    [reminders, childId]
  );

  const todo = mine.filter((r) => r.status === "pending");
  const done = mine.filter((r) => r.status === "completed");
  const streak = done.length;
  const progress = mine.length > 0 ? Math.round((done.length / mine.length) * 100) : 0;

  const name = child?.name?.split(" ")[0] ?? "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const grouped = useMemo(
    () => HEALTH_GROUPS.map((g) => ({ ...g, Icon: g.icon, items: mine.filter((r) => g.types.includes(r.type)) })),
    [mine]
  );

  return (
    <div className="mx-auto min-h-screen max-w-4xl bg-[#faf7f2] px-4 py-6 sm:px-8 sm:py-10">
      <GreetingHeader
        childName={child?.name?.split(" ")[0]}
        subtitle="Let's stay healthy today!"
        className="mb-6"
      />

      <HeroBanner
        greeting={`${greeting}, ${name} 👋`}
        subtitle="Let's stay healthy today!"
        illustration={<DoctorIllustration />}
        accent="text-sky-700"
        gradient="bg-gradient-to-br from-sky-50 via-white to-sky-100/30"
        className="mb-8"
      />

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={<SparkleIcon className="h-5 w-5" />} label="Tasks Today" value={mine.length} accent="text-sky-600" delay={0.1} />
        <StatCard icon={<BadgeIcon className="h-5 w-5" />} label="Completed" value={done.length} accent="text-sage-600" delay={0.15} />
        <StatCard icon={<SparkleIcon className="h-5 w-5" />} label="Health Score" value={`${progress}%`} accent="text-sky-600" delay={0.2} />
        <StatCard icon={<BadgeIcon className="h-5 w-5" />} label="Streak" value={`${streak}d`} accent="text-sun-600" delay={0.25} />
      </div>

      {mine.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8"
        >
          <ClayCard className="p-5">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-display text-lg italic text-ink">Daily Progress</h2>
              <span className="text-sm text-sky-600">{done.length}/{mine.length}</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-sky-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="h-full rounded-full bg-sky-500"
              />
            </div>
          </ClayCard>
        </motion.div>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-white/60" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {grouped.map((group) => {
            if (group.items.length === 0) return null;
            const pendingCount = group.items.filter((r) => r.status === "pending").length;
            return (
              <motion.div
                key={group.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <ClayCard className="p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <group.Icon className={cn("h-5 w-5", group.accent)} />
                    <h3 className="font-display text-base italic text-ink">{group.label}</h3>
                    {pendingCount > 0 && (
                      <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-700">{pendingCount} left</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {group.items.map((r, i) => (
                      <motion.div
                        key={r.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.05 + i * 0.03 }}
                      >
                        <ChildTaskCard reminder={r} overdue={isOverdue(r)} onComplete={handleComplete} />
                      </motion.div>
                    ))}
                  </div>
                </ClayCard>
              </motion.div>
            );
          })}

          {todo.length === 0 && mine.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50/30 px-6 py-10 text-center shadow-[inset_0_2px_4px_rgba(45,42,38,0.04)]"
            >
              <BadgeIcon className="h-10 w-10 text-sky-500" />
              <p className="font-display text-lg italic text-ink">All health tasks done! 🎉</p>
              <p className="text-sm text-stone-500">Great job taking care of yourself today.</p>
            </motion.div>
          )}

          {mine.length === 0 && (
            <ClayCard className="p-6 text-center">
              <p className="font-display text-base italic text-ink">No health tasks today</p>
              <p className="mt-1 text-sm text-stone-500">Check back later for new tasks.</p>
            </ClayCard>
          )}
        </div>
      )}
    </div>
  );
}

export default function HealthPage() {
  return (
    <RequireRole role="child">
      <HealthContent />
    </RequireRole>
  );
}

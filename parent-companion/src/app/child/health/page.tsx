"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { ChildShell } from "@/components/ChildShell";
import { ChildTaskCard } from "@/components/ChildTaskCard";
import {
  MealIcon,
  SupplementIcon,
  WaterIcon,
  ExerciseIcon,
  SleepIcon,
} from "@/components/icons";
import { RequireRole } from "@/components/RequireRole";
import { fetchChildById, fetchReminders, sendNotification, updateReminder } from "@/lib/mockApi";
import { useSession } from "@/lib/session";
import { isOverdue } from "@/lib/utils";
import { Reminder, ReminderType } from "@/types";

const HEALTH_GROUPS: {
  label: string;
  types: ReminderType[];
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}[] = [
  { label: "Meals", types: ["meal"], icon: MealIcon, accent: "text-sage-600" },
  { label: "Medicine", types: ["supplement"], icon: SupplementIcon, accent: "text-clay-600" },
  { label: "Water", types: ["water"], icon: WaterIcon, accent: "text-sky-600" },
  { label: "Exercise", types: ["exercise"], icon: ExerciseIcon, accent: "text-lime-600" },
  { label: "Sleep", types: ["sleep"], icon: SleepIcon, accent: "text-violet-600" },
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
    if (nextStatus === "completed") {
      sendNotification({ ...r, status: nextStatus });
    }
  }

  const mine = useMemo(
    () => (reminders ?? []).filter((r) => r.childId === childId && ALL_HEALTH_TYPES.includes(r.type)),
    [reminders, childId]
  );

  const grouped = useMemo(() => {
    return HEALTH_GROUPS.map((group) => ({
      ...group,
      Icon: group.icon,
      items: mine.filter((r) => group.types.includes(r.type)),
    }));
  }, [mine]);

  const todo = mine.filter((r) => r.status === "pending");
  const done = mine.filter((r) => r.status === "completed");
  const streak = done.length;

  if (isLoading) {
    return (
      <ChildShell child={child} streak={streak}>
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-[24px] border-2 border-transparent bg-white/60" />
          ))}
        </div>
      </ChildShell>
    );
  }

  return (
    <ChildShell child={child} streak={streak}>
      <Link
        href="/child"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 transition-colors hover:text-sky-800"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to Dashboard
      </Link>

      {mine.length > 0 && (
        <div className="fade-in mb-6 rounded-[24px] bg-white/70 px-5 py-4 shadow-soft">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-ink">
              {done.length} of {mine.length} done today
            </p>
            <p className="text-sm text-sky-600">
              {Math.round((done.length / mine.length) * 100)}%
            </p>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-sky-100">
            <div
              className="h-full rounded-full bg-sky-500 transition-all duration-500"
              style={{ width: `${(done.length / mine.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-8">
        {grouped.map((group) => {
          if (group.items.length === 0) return null;
          const pendingCount = group.items.filter((r) => r.status === "pending").length;
          return (
            <section key={group.label}>
              <div className="mb-4 flex items-center gap-2">
                <group.Icon className={`h-5 w-5 ${group.accent}`} />
                <h2 className="font-display text-xl italic text-ink">{group.label}</h2>
                {pendingCount > 0 && (
                  <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-700">
                    {pendingCount} left
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-3">
                {group.items.map((r, i) => (
                  <div key={r.id} className="fade-in" style={{ animationDelay: `${Math.min(i, 6) * 0.05}s` }}>
                    <ChildTaskCard reminder={r} overdue={isOverdue(r)} onComplete={handleComplete} />
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {todo.length === 0 && mine.length > 0 && (
          <div className="fade-in flex flex-col items-center gap-3 rounded-[24px] border-2 border-dashed border-sky-200 bg-white/50 px-6 py-10 text-center">
            <p className="font-display text-lg italic text-ink">All health tasks done!</p>
            <p className="text-sm text-stone-500">Great job taking care of yourself today.</p>
          </div>
        )}

        {mine.length === 0 && (
          <div className="fade-in flex flex-col items-center gap-3 rounded-[24px] border-2 border-dashed border-sky-200 bg-white/50 px-6 py-10 text-center">
            <p className="font-display text-lg italic text-ink">No health tasks today</p>
            <p className="text-sm text-stone-500">Check back later for new tasks.</p>
          </div>
        )}
      </div>
    </ChildShell>
  );
}

export default function HealthPage() {
  return (
    <RequireRole role="child">
      <HealthContent />
    </RequireRole>
  );
}

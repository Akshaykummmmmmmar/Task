"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChildShell } from "@/components/ChildShell";
import { ChildTaskCard } from "@/components/ChildTaskCard";
import { RequireRole } from "@/components/RequireRole";
import { BadgeIcon, SparkleIcon } from "@/components/icons";
import { fetchChildById, fetchReminders, sendNotification, updateReminder } from "@/lib/mockApi";
import { useSession } from "@/lib/session";
import { isOverdue } from "@/lib/utils";
import { Reminder } from "@/types";

function ChildContent() {
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
    () => (reminders ?? []).filter((r) => r.childId === childId),
    [reminders, childId]
  );

  const todo = mine.filter((r) => r.status === "pending");
  const done = mine.filter((r) => r.status === "completed");
  const overdueCount = todo.filter((r) => isOverdue(r)).length;
  const streak = done.length;

  return (
    <ChildShell child={child} streak={streak}>
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-[24px] border-2 border-transparent bg-white/60"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {mine.length > 0 && (
            <div className="fade-in rounded-[24px] bg-white/70 px-5 py-4 shadow-soft">
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

          <section>
            <div className="mb-4 flex items-center gap-2">
              <h2 className="font-display text-xl italic text-ink">To do</h2>
              {overdueCount > 0 && (
                <span className="rounded-full bg-clay-100 px-2.5 py-0.5 text-xs font-medium text-clay-700">
                  {overdueCount} need attention
                </span>
              )}
            </div>
            {todo.length === 0 ? (
              <div className="fade-in flex flex-col items-center gap-3 rounded-[24px] border-2 border-dashed border-sky-200 bg-white/50 px-6 py-10 text-center">
                <BadgeIcon className="h-10 w-10 text-sky-500" />
                <p className="font-display text-lg italic text-ink">
                  All done for now!
                </p>
                <p className="text-sm text-stone-500">
                  Nice work — check back later for new tasks.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {todo.map((r, i) => (
                  <div
                    key={r.id}
                    className="fade-in"
                    style={{ animationDelay: `${Math.min(i, 6) * 0.05}s` }}
                  >
                    <ChildTaskCard
                      reminder={r}
                      overdue={isOverdue(r)}
                      onComplete={handleComplete}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>

          {done.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-2">
                <SparkleIcon className="h-5 w-5 text-sun-500" />
                <h2 className="font-display text-xl italic text-ink">Done</h2>
              </div>
              <div className="flex flex-col gap-3">
                {done.map((r) => (
                  <ChildTaskCard key={r.id} reminder={r} onComplete={handleComplete} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </ChildShell>
  );
}

export default function ChildPage() {
  return (
    <RequireRole role="child">
      <ChildContent />
    </RequireRole>
  );
}

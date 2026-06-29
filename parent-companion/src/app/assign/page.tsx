"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { RequireRole } from "@/components/RequireRole";
import { StudyIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import {
  createReminder,
  fetchChildren,
  fetchParent,
  fetchReminders,
} from "@/lib/mockApi";
import { ReminderRepeat, SUBJECTS, Subject } from "@/types";

const REPEATS: { value: ReminderRepeat; label: string }[] = [
  { value: "none", label: "One time" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
];

function AssignContent() {
  const queryClient = useQueryClient();
  const { data: parent } = useQuery({ queryKey: ["parent"], queryFn: fetchParent });
  const { data: children } = useQuery({ queryKey: ["children"], queryFn: fetchChildren });
  const { data: reminders } = useQuery({ queryKey: ["reminders"], queryFn: fetchReminders });
  const child = children?.[0];

  const [subject, setSubject] = useState<Subject>("Math");
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("2026-06-29");
  const [time, setTime] = useState("18:00");
  const [repeat, setRepeat] = useState<ReminderRepeat>("none");
  const [confirmed, setConfirmed] = useState(false);

  const mutation = useMutation({
    mutationFn: createReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      setConfirmed(true);
      setTopic("");
      setTimeout(() => setConfirmed(false), 2500);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!child || !topic.trim()) return;
    mutation.mutate({
      childId: child.id,
      title: `Study — ${subject}: ${topic.trim()}`,
      type: "study",
      subject,
      topic: topic.trim(),
      dueAt: new Date(`${date}T${time}:00.000Z`).toISOString(),
      repeat,
    });
  }

  const assignedStudy = (reminders ?? [])
    .filter((r) => r.type === "study")
    .sort((a, b) => new Date(b.dueAt).getTime() - new Date(a.dueAt).getTime());

  return (
    <AppShell>
      <PageHeader
        parent={parent}
        child={child}
        title="Assign study"
        subtitle="Choose what Riya should study next, and when it's due."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 flex flex-col gap-4 rounded-card border border-sand-300 bg-white/70 p-6 shadow-soft"
        >
          <div>
            <label className="mb-1.5 block text-xs font-medium text-stone-500">
              Subject
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SUBJECTS.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSubject(s)}
                  className={cn(
                    "focus-ring rounded-lg border px-3 py-2 text-sm transition-colors",
                    subject === s
                      ? "border-clay-500 bg-clay-50 font-medium text-clay-700"
                      : "border-sand-300 bg-white text-stone-500 hover:border-stone-400"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="topic" className="mb-1.5 block text-xs font-medium text-stone-500">
              Topic
            </label>
            <input
              id="topic"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Fractions"
              className="focus-ring w-full rounded-lg border border-sand-300 bg-white px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-stone-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="date" className="mb-1.5 block text-xs font-medium text-stone-500">
                Due date
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="focus-ring w-full rounded-lg border border-sand-300 bg-white px-3 py-2.5 text-sm text-ink outline-none"
              />
            </div>
            <div>
              <label htmlFor="time" className="mb-1.5 block text-xs font-medium text-stone-500">
                Due time
              </label>
              <input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="focus-ring w-full rounded-lg border border-sand-300 bg-white px-3 py-2.5 text-sm text-ink outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-stone-500">
              Schedule
            </label>
            <div className="grid grid-cols-3 gap-2">
              {REPEATS.map((r) => (
                <button
                  type="button"
                  key={r.value}
                  onClick={() => setRepeat(r.value)}
                  className={cn(
                    "focus-ring rounded-lg border px-3 py-2 text-sm transition-colors",
                    repeat === r.value
                      ? "border-sage-500 bg-sage-50 font-medium text-sage-700"
                      : "border-sand-300 bg-white text-stone-500 hover:border-stone-400"
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="focus-ring mt-2 w-full rounded-full bg-clay-500 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-clay-600 disabled:opacity-60"
          >
            {mutation.isPending ? "Assigning…" : "Assign to Riya"}
          </button>
          {confirmed && (
            <p className="text-center text-sm text-sage-700">Assigned — Riya will see it in her tasks.</p>
          )}
        </form>

        <div className="lg:col-span-3 rounded-card border border-sand-300 bg-white/70 p-6 shadow-soft">
          <h2 className="mb-5 font-display text-lg italic text-ink">
            Currently assigned
          </h2>
          {assignedStudy.length === 0 ? (
            <p className="text-sm text-stone-400">No study tasks assigned yet.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {assignedStudy.map((r) => (
                <li
                  key={r.id}
                  className="flex items-start gap-3 rounded-lg border border-sand-300 bg-white px-3.5 py-3"
                >
                  <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-clay-50 text-clay-700">
                    <StudyIcon className="h-4 w-4" />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink">
                      {r.subject} — {r.topic}
                    </p>
                    <p className="mt-0.5 text-xs text-stone-400">
                      Due {new Date(r.dueAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" })}
                      {" · "}
                      {r.repeat === "none" ? "One time" : r.repeat}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-medium",
                      r.status === "completed"
                        ? "bg-sage-50 text-sage-700"
                        : "bg-sand-100 text-stone-500"
                    )}
                  >
                    {r.status === "completed" ? "Done" : "Pending"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AppShell>
  );
}

export default function AssignPage() {
  return (
    <RequireRole role="parent">
      <AssignContent />
    </RequireRole>
  );
}

"use client";

import { Reminder } from "@/types";
import { TYPE_ICON } from "./icons";
import { cn, formatTime } from "@/lib/utils";

const DAY_START_HOUR = 6;
const DAY_END_HOUR = 22;

function hourPosition(iso: string) {
  const d = new Date(iso);
  const hour = d.getUTCHours() + d.getUTCMinutes() / 60;
  const clamped = Math.min(Math.max(hour, DAY_START_HOUR), DAY_END_HOUR);
  return ((clamped - DAY_START_HOUR) / (DAY_END_HOUR - DAY_START_HOUR)) * 100;
}

const TYPE_DOT: Record<Reminder["type"], string> = {
  meal: "bg-sage-500",
  supplement: "bg-clay-500",
  appointment: "bg-stone-500",
  assessment: "bg-sage-700",
  study: "bg-clay-700",
  water: "bg-sky-500",
  exercise: "bg-lime-500",
  sleep: "bg-violet-500",
};

export function DayRhythm({ reminders }: { reminders: Reminder[] }) {
  const now = new Date("2026-06-28T12:00:00.000Z");
  const nowPos = hourPosition(now.toISOString());

  const sorted = [...reminders].sort(
    (a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()
  );

  return (
    <div className="rounded-card border border-sand-300 bg-white/70 p-6 shadow-soft">
      <div className="mb-1 flex items-baseline justify-between">
        <h2 className="font-display text-lg italic text-ink">Today&apos;s rhythm</h2>
        <span className="text-xs text-stone-400">6 AM – 10 PM</span>
      </div>
      <p className="mb-7 text-sm text-stone-500">
        How Riya&apos;s day is shaping up, at a glance.
      </p>

      <div className="relative mt-2 mb-3 h-1.5 rounded-full bg-sand-200">
        <div
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-paper bg-ink"
          style={{ left: `${nowPos}%` }}
          aria-hidden="true"
        />
        {sorted.map((r) => {
          const Icon = TYPE_ICON[r.type];
          const pos = hourPosition(r.dueAt);
          return (
            <div
              key={r.id}
              className="group absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pos}%` }}
            >
              <span
                className={cn(
                  "block h-2.5 w-2.5 rounded-full ring-2 ring-paper",
                  TYPE_DOT[r.type],
                  r.status === "completed" && "opacity-40"
                )}
              />
              <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 hidden w-44 -translate-x-1/2 rounded-lg border border-sand-300 bg-white px-3 py-2 text-left shadow-soft group-hover:block">
                <div className="mb-1 flex items-center gap-1.5 text-stone-500">
                  <Icon className="h-3.5 w-3.5" />
                  <span className="text-[11px] uppercase tracking-wide">
                    {formatTime(r.dueAt)}
                  </span>
                </div>
                <p className="text-xs font-medium leading-snug text-ink">
                  {r.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
        {(
          [
            ["meal", "Meal"],
            ["supplement", "Medicine"],
            ["appointment", "Appointment"],
            ["assessment", "Assessment"],
            ["study", "Study"],
            ["water", "Water"],
            ["exercise", "Exercise"],
            ["sleep", "Sleep"],
          ] as const
        ).map(([type, label]) => (
          <div key={type} className="flex items-center gap-1.5">
            <span className={cn("h-2 w-2 rounded-full", TYPE_DOT[type])} />
            <span className="text-xs text-stone-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

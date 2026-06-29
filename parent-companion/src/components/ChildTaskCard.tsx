"use client";

import { Reminder } from "@/types";
import { TYPE_ICON } from "./icons";
import { CheckIcon } from "./icons";
import { cn, formatTime, TYPE_LABEL } from "@/lib/utils";

const TYPE_BG: Record<Reminder["type"], string> = {
  meal: "bg-sage-50",
  supplement: "bg-clay-50",
  appointment: "bg-sand-100",
  assessment: "bg-sage-50",
  study: "bg-sun-50",
  water: "bg-sky-50",
  exercise: "bg-lime-50",
  sleep: "bg-violet-50",
};

const TYPE_FG: Record<Reminder["type"], string> = {
  meal: "text-sage-700",
  supplement: "text-clay-700",
  appointment: "text-stone-600",
  assessment: "text-sage-700",
  study: "text-sun-600",
  water: "text-sky-700",
  exercise: "text-lime-700",
  sleep: "text-violet-700",
};

export function ChildTaskCard({
  reminder,
  overdue,
  onComplete,
}: {
  reminder: Reminder;
  overdue?: boolean;
  onComplete: (r: Reminder) => void;
}) {
  const Icon = TYPE_ICON[reminder.type];
  const done = reminder.status === "completed";

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-[24px] border-2 bg-white p-4 shadow-soft transition-all sm:p-5",
        done
          ? "border-sage-100 opacity-60"
          : overdue
          ? "border-clay-300"
          : "border-transparent"
      )}
    >
      <span
        className={cn(
          "flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full",
          TYPE_BG[reminder.type],
          TYPE_FG[reminder.type]
        )}
      >
        <Icon className="h-7 w-7" />
      </span>

      <div className="flex-1">
        <p className={cn("font-display text-lg italic text-ink", done && "line-through")}>
          {reminder.subject ? `${reminder.subject} — ${reminder.topic}` : reminder.title}
        </p>
        <p className="mt-0.5 text-sm text-stone-500">
          {TYPE_LABEL[reminder.type]} · {formatTime(reminder.dueAt)}
          {overdue && !done && (
            <span className="ml-1.5 font-medium text-clay-600">· was due</span>
          )}
        </p>
      </div>

      <button
        onClick={() => onComplete(reminder)}
        aria-pressed={done}
        aria-label={done ? "Mark as not done" : "Mark as done"}
        className={cn(
          "focus-ring flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 text-paper transition-all active:scale-95",
          done
            ? "border-sage-500 bg-sage-500"
            : "border-sky-300 bg-sky-500 hover:bg-sky-600"
        )}
      >
        <CheckIcon className="h-6 w-6" />
      </button>
    </div>
  );
}

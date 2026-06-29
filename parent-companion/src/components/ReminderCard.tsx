"use client";

import { Reminder } from "@/types";
import { TYPE_ICON, CheckIcon, TrashIcon, EditIcon } from "./icons";
import { cn, formatFull, TYPE_LABEL } from "@/lib/utils";

const TYPE_TINT: Record<Reminder["type"], string> = {
  meal: "bg-sage-50 text-sage-700",
  supplement: "bg-clay-50 text-clay-700",
  appointment: "bg-sand-100 text-stone-600",
  assessment: "bg-sage-50 text-sage-700",
  study: "bg-clay-50 text-clay-700",
};

export function ReminderCard({
  reminder,
  isOverdue,
  onToggleComplete,
  onEdit,
  onDelete,
}: {
  reminder: Reminder;
  isOverdue?: boolean;
  onToggleComplete: (r: Reminder) => void;
  onEdit: (r: Reminder) => void;
  onDelete: (r: Reminder) => void;
}) {
  const Icon = TYPE_ICON[reminder.type];
  const completed = reminder.status === "completed";

  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-card border bg-white/70 p-4 shadow-soft transition-all duration-200 hover:shadow-[0_6px_20px_rgba(45,42,38,0.08)]",
        isOverdue ? "border-clay-300" : "border-sand-300",
        completed && "opacity-60"
      )}
    >
      <button
        onClick={() => onToggleComplete(reminder)}
        aria-pressed={completed}
        aria-label={completed ? "Mark as not completed" : "Mark as completed"}
        className={cn(
          "focus-ring mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          completed
            ? "border-sage-500 bg-sage-500 text-paper"
            : "border-sand-300 text-transparent hover:border-sage-500"
        )}
      >
        <CheckIcon className="h-3.5 w-3.5" />
      </button>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full",
              TYPE_TINT[reminder.type]
            )}
          >
            <Icon className="h-3.5 w-3.5" />
          </span>
          <p
            className={cn(
              "text-sm font-medium text-ink",
              completed && "line-through"
            )}
          >
            {reminder.title}
          </p>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 pl-8 text-xs text-stone-400">
          <span>{TYPE_LABEL[reminder.type]}</span>
          {reminder.subject && (
            <>
              <span>·</span>
              <span className="font-medium text-clay-600">{reminder.subject}</span>
            </>
          )}
          <span>·</span>
          <span className={isOverdue ? "font-medium text-clay-600" : undefined}>
            {formatFull(reminder.dueAt)}
          </span>
          {reminder.repeat !== "none" && (
            <>
              <span>·</span>
              <span className="capitalize">{reminder.repeat}</span>
            </>
          )}
        </div>
        {reminder.notes && (
          <p className="mt-2 pl-8 text-xs text-stone-500">{reminder.notes}</p>
        )}
      </div>

      <div className="flex flex-shrink-0 gap-1">
        <button
          onClick={() => onEdit(reminder)}
          aria-label="Edit reminder"
          className="focus-ring flex h-8 w-8 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-sand-100 hover:text-ink"
        >
          <EditIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(reminder)}
          aria-label="Delete reminder"
          className="focus-ring flex h-8 w-8 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-clay-50 hover:text-clay-600"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

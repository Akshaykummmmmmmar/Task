import { Reminder } from "@/types";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const DAY_MS = 24 * 60 * 60 * 1000;

// The demo's "today" — kept fixed so the mock data always looks intentional.
export const DEMO_NOW = new Date("2026-06-28T12:00:00.000Z");

export function isSameDay(a: Date, b: Date) {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

export type ReminderTab = "today" | "upcoming" | "overdue" | "completed";

export function bucketReminder(r: Reminder, now: Date = DEMO_NOW): ReminderTab {
  if (r.status === "completed") return "completed";
  const due = new Date(r.dueAt);
  if (due.getTime() < now.getTime() && !isSameDay(due, now)) return "overdue";
  if (isSameDay(due, now)) return "today";
  return "upcoming";
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

export function formatDayLabel(iso: string, now: Date = DEMO_NOW) {
  const date = new Date(iso);
  if (isSameDay(date, now)) return "Today";
  const tomorrow = new Date(now.getTime() + DAY_MS);
  if (isSameDay(date, tomorrow)) return "Tomorrow";
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function formatFull(iso: string) {
  return `${formatDayLabel(iso)} · ${formatTime(iso)}`;
}

export const TYPE_LABEL: Record<Reminder["type"], string> = {
  meal: "Meal",
  supplement: "Medicine",
  appointment: "Appointment",
  assessment: "Assessment",
  study: "Study",
  water: "Water",
  exercise: "Exercise",
  sleep: "Sleep",
};

export function isOverdue(r: Reminder, now: Date = DEMO_NOW) {
  return r.status === "pending" && new Date(r.dueAt).getTime() < now.getTime();
}

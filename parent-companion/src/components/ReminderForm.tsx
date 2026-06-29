"use client";

import { useState } from "react";
import { Reminder, ReminderRepeat, ReminderType, SUBJECTS, Subject } from "@/types";
import { cn } from "@/lib/utils";

const TYPES: { value: ReminderType; label: string }[] = [
  { value: "meal", label: "Meal" },
  { value: "supplement", label: "Supplement" },
  { value: "appointment", label: "Appointment" },
  { value: "assessment", label: "Assessment" },
  { value: "study", label: "Study" },
];

const REPEATS: { value: ReminderRepeat; label: string }[] = [
  { value: "none", label: "Does not repeat" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
];

export interface ReminderFormValues {
  title: string;
  type: ReminderType;
  date: string;
  time: string;
  repeat: ReminderRepeat;
  notes: string;
  subject: Subject;
  topic: string;
}

function toFormValues(r?: Reminder): ReminderFormValues {
  if (!r) {
    return {
      title: "",
      type: "supplement",
      date: "2026-06-28",
      time: "08:00",
      repeat: "none",
      notes: "",
      subject: "Math",
      topic: "",
    };
  }
  const d = new Date(r.dueAt);
  return {
    title: r.title,
    type: r.type,
    date: d.toISOString().slice(0, 10),
    time: d.toISOString().slice(11, 16),
    repeat: r.repeat,
    notes: r.notes ?? "",
    subject: r.subject ?? "Math",
    topic: r.topic ?? "",
  };
}

export function ReminderForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  initial?: Reminder;
  onSubmit: (values: ReminderFormValues) => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  const [values, setValues] = useState<ReminderFormValues>(toFormValues(initial));
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values.title.trim()) {
      setError("Give this reminder a title.");
      return;
    }
    if (!values.date || !values.time) {
      setError("Pick a date and time.");
      return;
    }
    setError(null);
    onSubmit(values);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4 backdrop-blur-sm">
      <div className="fade-in max-h-[90vh] w-full max-w-md overflow-y-auto rounded-card border border-sand-300 bg-paper p-6 shadow-[0_24px_60px_rgba(45,42,38,0.18)]">
        <h2 className="mb-1 font-display text-xl italic text-ink">
          {initial ? "Edit reminder" : "New reminder"}
        </h2>
        <p className="mb-5 text-sm text-stone-500">
          Set a title, type, and when it&apos;s due.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="title" className="mb-1.5 block text-xs font-medium text-stone-500">
              Title
            </label>
            <input
              id="title"
              autoFocus
              value={values.title}
              onChange={(e) => setValues({ ...values, title: e.target.value })}
              placeholder="Take Vitamin D"
              className="focus-ring w-full rounded-lg border border-sand-300 bg-white px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-stone-400"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-stone-500">
              Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TYPES.map((t) => (
                <button
                  type="button"
                  key={t.value}
                  onClick={() => setValues({ ...values, type: t.value })}
                  className={cn(
                    "focus-ring rounded-lg border px-3 py-2 text-sm transition-colors",
                    values.type === t.value
                      ? "border-sage-500 bg-sage-50 font-medium text-sage-700"
                      : "border-sand-300 bg-white text-stone-500 hover:border-stone-400"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {values.type === "study" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="subject" className="mb-1.5 block text-xs font-medium text-stone-500">
                  Subject
                </label>
                <select
                  id="subject"
                  value={values.subject}
                  onChange={(e) =>
                    setValues({ ...values, subject: e.target.value as Subject })
                  }
                  className="focus-ring w-full rounded-lg border border-sand-300 bg-white px-3.5 py-2.5 text-sm text-ink outline-none"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="topic" className="mb-1.5 block text-xs font-medium text-stone-500">
                  Topic
                </label>
                <input
                  id="topic"
                  value={values.topic}
                  onChange={(e) => setValues({ ...values, topic: e.target.value })}
                  placeholder="Fractions"
                  className="focus-ring w-full rounded-lg border border-sand-300 bg-white px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-stone-400"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="date" className="mb-1.5 block text-xs font-medium text-stone-500">
                Date
              </label>
              <input
                id="date"
                type="date"
                value={values.date}
                onChange={(e) => setValues({ ...values, date: e.target.value })}
                className="focus-ring w-full rounded-lg border border-sand-300 bg-white px-3 py-2.5 text-sm text-ink outline-none"
              />
            </div>
            <div>
              <label htmlFor="time" className="mb-1.5 block text-xs font-medium text-stone-500">
                Time
              </label>
              <input
                id="time"
                type="time"
                value={values.time}
                onChange={(e) => setValues({ ...values, time: e.target.value })}
                className="focus-ring w-full rounded-lg border border-sand-300 bg-white px-3 py-2.5 text-sm text-ink outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="repeat" className="mb-1.5 block text-xs font-medium text-stone-500">
              Repeat
            </label>
            <select
              id="repeat"
              value={values.repeat}
              onChange={(e) =>
                setValues({ ...values, repeat: e.target.value as ReminderRepeat })
              }
              className="focus-ring w-full rounded-lg border border-sand-300 bg-white px-3.5 py-2.5 text-sm text-ink outline-none"
            >
              {REPEATS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="notes" className="mb-1.5 block text-xs font-medium text-stone-500">
              Notes <span className="text-stone-400">(optional)</span>
            </label>
            <textarea
              id="notes"
              rows={2}
              value={values.notes}
              onChange={(e) => setValues({ ...values, notes: e.target.value })}
              placeholder="Dr. Iyer — Room 3"
              className="focus-ring w-full resize-none rounded-lg border border-sand-300 bg-white px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-stone-400"
            />
          </div>

          {error && <p className="text-xs text-clay-600">{error}</p>}

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="focus-ring rounded-full px-4 py-2 text-sm text-stone-500 transition-colors hover:bg-sand-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="focus-ring rounded-full bg-sage-500 px-5 py-2 text-sm font-medium text-paper transition-colors hover:bg-sage-600"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

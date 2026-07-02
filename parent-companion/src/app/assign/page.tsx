"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { RequireRole } from "@/components/RequireRole";
import { StudyIcon, CloseIcon, TrashIcon, EditIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import {
  createReminder,
  updateReminder,
  deleteReminder,
  fetchChildren,
  fetchParent,
  fetchReminders,
} from "@/lib/mockApi";
import { Reminder, ReminderRepeat, SUBJECTS, Subject } from "@/types";

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
  const [editTarget, setEditTarget] = useState<Reminder | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Reminder | null>(null);

  const editSubject = editTarget?.subject ?? "Math";
  const editTopic = editTarget?.topic ?? "";
  const editDate = editTarget
    ? new Date(editTarget.dueAt).toISOString().slice(0, 10)
    : "2026-06-29";
  const editTime = editTarget
    ? new Date(editTarget.dueAt).toISOString().slice(11, 16)
    : "18:00";
  const editRepeat = editTarget?.repeat ?? "none";

  const createMutation = useMutation({
    mutationFn: createReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      setConfirmed(true);
      setTopic("");
      setTimeout(() => setConfirmed(false), 2500);
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ id, ...patch }: Partial<Reminder> & { id: string }) =>
      updateReminder(id, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      setEditTarget(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      setDeleteTarget(null);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!child || !topic.trim()) return;
    createMutation.mutate({
      childId: child.id,
      title: `Study — ${subject}: ${topic.trim()}`,
      type: "study",
      subject,
      topic: topic.trim(),
      dueAt: new Date(`${date}T${time}:00.000Z`).toISOString(),
      repeat,
    });
  }

  function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editTarget) return;
    editMutation.mutate({
      id: editTarget.id,
      subject: editSubject,
      topic: editTopic,
      title: `Study — ${editSubject}: ${editTopic.trim()}`,
      dueAt: new Date(`${editDate}T${editTime}:00.000Z`).toISOString(),
      repeat: editRepeat,
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
            disabled={createMutation.isPending}
            className="focus-ring mt-2 w-full rounded-full bg-clay-500 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-clay-600 disabled:opacity-60"
          >
            {createMutation.isPending ? "Assigning…" : "Assign to Riya"}
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
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">
                      {r.subject} — {r.topic}
                    </p>
                    <p className="mt-0.5 text-xs text-stone-400">
                      Due {new Date(r.dueAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" })}
                      {" · "}
                      {r.repeat === "none" ? "One time" : r.repeat}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
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
                    <button
                      onClick={() => setEditTarget(r)}
                      className="focus-ring rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-sand-100 hover:text-ink"
                      aria-label="Edit study task"
                    >
                      <EditIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(r)}
                      className="focus-ring rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-clay-50 hover:text-clay-600"
                      aria-label="Delete study task"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Edit modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/20 backdrop-blur-sm pt-10 md:pt-20">
          <div className="mx-4 w-full max-w-lg rounded-2xl border border-sand-300 bg-paper shadow-2xl">
            <div className="flex items-center justify-between border-b border-sand-300/70 px-6 py-4">
              <h2 className="font-display text-xl italic text-ink">Edit study task</h2>
              <button
                onClick={() => setEditTarget(null)}
                className="focus-ring flex h-9 w-9 items-center justify-center rounded-full text-stone-500 hover:bg-sand-100"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4 p-6">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-stone-500">Subject</label>
                <div className="grid grid-cols-2 gap-2">
                  {SUBJECTS.map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setEditTarget({ ...editTarget, subject: s })}
                      className={cn(
                        "focus-ring rounded-lg border px-3 py-2 text-sm transition-colors",
                        editSubject === s
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
                <label className="mb-1.5 block text-xs font-medium text-stone-500">Topic</label>
                <input
                  required
                  value={editTopic}
                  onChange={(e) => setEditTarget({ ...editTarget, topic: e.target.value })}
                  placeholder="Fractions"
                  className="focus-ring w-full rounded-lg border border-sand-300 bg-white px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-stone-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-500">Due date</label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditTarget({ ...editTarget, dueAt: new Date(`${e.target.value}T${editTime}:00.000Z`).toISOString() })}
                    className="focus-ring w-full rounded-lg border border-sand-300 bg-white px-3 py-2.5 text-sm text-ink outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-500">Due time</label>
                  <input
                    type="time"
                    value={editTime}
                    onChange={(e) => setEditTarget({ ...editTarget, dueAt: new Date(`${editDate}T${e.target.value}:00.000Z`).toISOString() })}
                    className="focus-ring w-full rounded-lg border border-sand-300 bg-white px-3 py-2.5 text-sm text-ink outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-stone-500">Schedule</label>
                <div className="grid grid-cols-3 gap-2">
                  {REPEATS.map((r) => (
                    <button
                      type="button"
                      key={r.value}
                      onClick={() => setEditTarget({ ...editTarget, repeat: r.value })}
                      className={cn(
                        "focus-ring rounded-lg border px-3 py-2 text-sm transition-colors",
                        editRepeat === r.value
                          ? "border-sage-500 bg-sage-50 font-medium text-sage-700"
                          : "border-sand-300 bg-white text-stone-500 hover:border-stone-400"
                      )}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  className="focus-ring flex-1 rounded-lg border border-sand-300 bg-white py-2.5 text-sm font-medium text-stone-500 transition-colors hover:bg-sand-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editMutation.isPending}
                  className="focus-ring flex-1 rounded-lg bg-clay-500 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-clay-600 disabled:opacity-60"
                >
                  {editMutation.isPending ? "Saving…" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/20 backdrop-blur-sm pt-10 md:pt-20">
          <div className="mx-4 w-full max-w-md rounded-2xl border border-sand-300 bg-paper shadow-2xl">
            <div className="flex items-center justify-between border-b border-sand-300/70 px-6 py-4">
              <h2 className="font-display text-xl italic text-ink">Delete study task</h2>
              <button
                onClick={() => setDeleteTarget(null)}
                className="focus-ring flex h-9 w-9 items-center justify-center rounded-full text-stone-500 hover:bg-sand-100"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-ink">
                Are you sure you want to delete <span className="font-medium">{deleteTarget.subject} — {deleteTarget.topic}</span>?
              </p>
              <p className="mt-1 text-xs text-stone-400">This action cannot be undone.</p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="focus-ring flex-1 rounded-lg border border-sand-300 bg-white py-2.5 text-sm font-medium text-stone-500 transition-colors hover:bg-sand-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteMutation.mutate(deleteTarget.id)}
                  disabled={deleteMutation.isPending}
                  className="focus-ring flex-1 rounded-lg bg-clay-500 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-clay-600 disabled:opacity-60"
                >
                  {deleteMutation.isPending ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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

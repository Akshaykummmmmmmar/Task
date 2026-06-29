"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { ReminderCard } from "@/components/ReminderCard";
import { ReminderForm, ReminderFormValues } from "@/components/ReminderForm";
import { PlusIcon } from "@/components/icons";
import { RequireRole } from "@/components/RequireRole";
import {
  createReminder,
  deleteReminder,
  fetchChildren,
  fetchParent,
  fetchReminders,
  sendNotification,
  updateReminder,
} from "@/lib/mockApi";
import { Reminder } from "@/types";
import { bucketReminder, cn, ReminderTab } from "@/lib/utils";

const TABS: { value: ReminderTab; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "upcoming", label: "Upcoming" },
  { value: "overdue", label: "Overdue" },
  { value: "completed", label: "Completed" },
];

function valuesToDueAt(v: ReminderFormValues) {
  return new Date(`${v.date}T${v.time}:00.000Z`).toISOString();
}

function RemindersContent() {
  const [tab, setTab] = useState<ReminderTab>("today");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Reminder | undefined>(undefined);

  const queryClient = useQueryClient();
  const { data: parent } = useQuery({ queryKey: ["parent"], queryFn: fetchParent });
  const { data: children } = useQuery({ queryKey: ["children"], queryFn: fetchChildren });
  const child = children?.[0];

  const { data: reminders, isLoading } = useQuery({
    queryKey: ["reminders"],
    queryFn: fetchReminders,
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["reminders"] });
  }

  const createMutation = useMutation({
    mutationFn: createReminder,
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Reminder> }) =>
      updateReminder(id, patch),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReminder,
    onSuccess: invalidate,
  });

  const grouped = useMemo(() => {
    const buckets: Record<ReminderTab, Reminder[]> = {
      today: [],
      upcoming: [],
      overdue: [],
      completed: [],
    };
    (reminders ?? []).forEach((r) => {
      buckets[bucketReminder(r)].push(r);
    });
    Object.values(buckets).forEach((list) =>
      list.sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
    );
    return buckets;
  }, [reminders]);

  function openCreate() {
    setEditing(undefined);
    setFormOpen(true);
  }

  function openEdit(r: Reminder) {
    setEditing(r);
    setFormOpen(true);
  }

  function handleSubmit(values: ReminderFormValues) {
    if (!child) return;
    const isStudy = values.type === "study";
    if (editing) {
      updateMutation.mutate({
        id: editing.id,
        patch: {
          title: values.title,
          type: values.type,
          dueAt: valuesToDueAt(values),
          repeat: values.repeat,
          notes: values.notes || undefined,
          subject: isStudy ? values.subject : undefined,
          topic: isStudy ? values.topic || undefined : undefined,
        },
      });
    } else {
      createMutation.mutate({
        childId: child.id,
        title: values.title,
        type: values.type,
        dueAt: valuesToDueAt(values),
        repeat: values.repeat,
        notes: values.notes || undefined,
        subject: isStudy ? values.subject : undefined,
        topic: isStudy ? values.topic || undefined : undefined,
      });
    }
    setFormOpen(false);
  }

  function handleToggleComplete(r: Reminder) {
    const nextStatus = r.status === "completed" ? "pending" : "completed";
    updateMutation.mutate({ id: r.id, patch: { status: nextStatus } });
    if (nextStatus === "completed") {
      sendNotification({ ...r, status: nextStatus });
    }
  }

  function handleDelete(r: Reminder) {
    deleteMutation.mutate(r.id);
  }

  const activeList = grouped[tab];

  return (
    <AppShell>
      <PageHeader
        parent={parent}
        child={child}
        title="Reminders"
        subtitle="Meals, supplements, appointments, study, and assessments — all in one place."
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-1 rounded-full border border-sand-300 bg-white/60 p-1">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={cn(
                "focus-ring rounded-full px-4 py-1.5 text-sm transition-colors",
                tab === t.value
                  ? "bg-sage-500 font-medium text-paper"
                  : "text-stone-500 hover:text-ink"
              )}
            >
              {t.label}
              <span className="ml-1.5 text-xs opacity-70">
                {grouped[t.value].length}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={openCreate}
          className="focus-ring flex items-center gap-1.5 rounded-full bg-clay-500 px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-clay-600"
        >
          <PlusIcon className="h-4 w-4" />
          New reminder
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-card border border-sand-300 bg-white/50"
            />
          ))
        ) : activeList.length === 0 ? (
          <div className="rounded-card border border-dashed border-sand-300 bg-white/40 p-10 text-center">
            <p className="text-sm text-stone-500">
              {tab === "completed"
                ? "Nothing completed yet."
                : "Nothing here right now — enjoy the quiet."}
            </p>
          </div>
        ) : (
          activeList.map((r) => (
            <ReminderCard
              key={r.id}
              reminder={r}
              isOverdue={tab === "overdue"}
              onToggleComplete={handleToggleComplete}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {formOpen && (
        <ReminderForm
          initial={editing}
          submitLabel={editing ? "Save changes" : "Create reminder"}
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
        />
      )}
    </AppShell>
  );
}

export default function RemindersPage() {
  return (
    <RequireRole role="parent">
      <RemindersContent />
    </RequireRole>
  );
}

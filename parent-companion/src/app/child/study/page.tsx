"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { StudyIcon, PlusIcon, TrashIcon } from "@/components/icons";
import { RequireRole } from "@/components/RequireRole";
import { ChildTaskPage } from "@/components/ChildTaskPage";
import { fetchWeeklyPlan, updateWeeklyPlan } from "@/lib/mockApi";
import { cn, DEMO_NOW } from "@/lib/utils";
import { SUBJECTS, Subject, WeeklyPlan, WeeklyPlanItem } from "@/types";

function getDefaultDays(): WeeklyPlan["days"] {
  const start = new Date(DEMO_NOW);
  const dayOfWeek = start.getUTCDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(start.getTime() + mondayOffset * 86400000);

  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday.getTime() + i * 86400000);
    return {
      day: d.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" }),
      items: [] as WeeklyPlanItem[],
    };
  });
}

function buildWeekLabel(): string {
  const start = new Date(DEMO_NOW);
  const dayOfWeek = start.getUTCDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(start.getTime() + mondayOffset * 86400000);
  const sunday = new Date(monday.getTime() + 4 * 86400000);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  return `${fmt(monday)} – ${fmt(sunday)}`;
}

function WeeklyPlanView({
  plan,
  onEdit,
}: {
  plan: WeeklyPlan;
  onEdit: () => void;
}) {
  return (
    <section className="fade-in rounded-[24px] bg-white/70 px-5 py-4 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StudyIcon className="h-5 w-5 text-sun-600" />
          <h2 className="font-display text-xl italic text-ink">This Week&apos;s Plan</h2>
          <span className="rounded-full bg-sun-100 px-2.5 py-0.5 text-xs font-medium text-sun-700">
            {plan.weekLabel}
          </span>
        </div>
        <button
          onClick={onEdit}
          className="focus-ring rounded-full bg-sun-100 px-4 py-1.5 text-sm font-medium text-sun-700 transition-colors hover:bg-sun-200"
        >
          Edit Plan
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {plan.days.map((day) => (
          <div key={day.day}>
            <p className="mb-2 text-sm font-semibold text-stone-500">{day.day}</p>
            {day.items.length === 0 ? (
              <p className="text-xs text-stone-400 italic">Nothing planned</p>
            ) : (
              <div className="flex flex-col gap-2">
                {day.items.map((item, i) => (
                  <div
                    key={`${day.day}-${i}`}
                    className="flex items-center gap-3 rounded-xl border border-sand-200 bg-white px-4 py-3"
                  >
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-sun-50 text-sun-600">
                      <StudyIcon className="h-4 w-4" />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-ink">{item.subject}</p>
                      <p className="text-xs text-stone-500">{item.topic}</p>
                    </div>
                    <span className="rounded-full bg-sun-50 px-2.5 py-0.5 text-xs font-medium text-sun-700">
                      {item.subject}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function WeeklyPlanEditor({
  plan,
  onSave,
  onCancel,
}: {
  plan: WeeklyPlan;
  onSave: (p: WeeklyPlan) => void;
  onCancel: () => void;
}) {
  const [label, setLabel] = useState(plan.weekLabel);
  const [days, setDays] = useState(plan.days);

  function updateItem(dayIdx: number, itemIdx: number, field: keyof WeeklyPlanItem, value: string) {
    setDays((prev) => {
      const next = [...prev];
      const items = [...next[dayIdx].items];
      items[itemIdx] = { ...items[itemIdx], [field]: value };
      next[dayIdx] = { ...next[dayIdx], items };
      return next;
    });
  }

  function addItem(dayIdx: number) {
    setDays((prev) => {
      const next = [...prev];
      next[dayIdx] = { ...next[dayIdx], items: [...next[dayIdx].items, { subject: "Math" as Subject, topic: "" }] };
      return next;
    });
  }

  function removeItem(dayIdx: number, itemIdx: number) {
    setDays((prev) => {
      const next = [...prev];
      const items = next[dayIdx].items.filter((_, i) => i !== itemIdx);
      next[dayIdx] = { ...next[dayIdx], items };
      return next;
    });
  }

  function handleSave() {
    onSave({ weekLabel: label, days });
  }

  return (
    <section className="fade-in rounded-[24px] bg-white/70 px-5 py-4 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StudyIcon className="h-5 w-5 text-sun-600" />
          <h2 className="font-display text-xl italic text-ink">Edit Weekly Plan</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="focus-ring rounded-full border border-sand-300 px-4 py-1.5 text-sm font-medium text-stone-600 transition-colors hover:bg-sand-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="focus-ring rounded-full bg-sun-500 px-4 py-1.5 text-sm font-medium text-paper transition-colors hover:bg-sun-600"
          >
            Save Plan
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-xs font-medium text-stone-500">Week label</label>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="focus-ring w-full rounded-lg border border-sand-300 bg-white px-3 py-2 text-sm text-ink outline-none"
        />
      </div>

      <div className="flex flex-col gap-5">
        {days.map((day, di) => (
          <div key={day.day}>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-stone-500">{day.day}</p>
              <button
                onClick={() => addItem(di)}
                className="focus-ring flex items-center gap-1 text-xs font-medium text-sky-600 transition-colors hover:text-sky-800"
              >
                <PlusIcon className="h-3.5 w-3.5" />
                Add
              </button>
            </div>
            {day.items.length === 0 ? (
              <p className="text-xs text-stone-400 italic">Nothing planned — click Add to add a subject.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {day.items.map((item, ii) => (
                  <div
                    key={ii}
                    className="flex items-center gap-2 rounded-xl border border-sand-200 bg-white px-3 py-2"
                  >
                    <select
                      value={item.subject}
                      onChange={(e) => updateItem(di, ii, "subject", e.target.value)}
                      className="focus-ring rounded-lg border border-sand-300 bg-white px-2 py-1.5 text-sm text-ink outline-none"
                    >
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <input
                      value={item.topic}
                      onChange={(e) => updateItem(di, ii, "topic", e.target.value)}
                      placeholder="Topic, chapter, or area"
                      className="focus-ring flex-1 rounded-lg border border-sand-300 bg-white px-3 py-1.5 text-sm text-ink outline-none placeholder:text-stone-400"
                    />
                    <button
                      onClick={() => removeItem(di, ii)}
                      className="focus-ring flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-clay-50 hover:text-clay-600"
                      aria-label="Remove item"
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function WeeklyPlanSection() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);

  const { data: plan, isLoading } = useQuery({
    queryKey: ["weeklyPlan"],
    queryFn: fetchWeeklyPlan,
  });

  const saveMutation = useMutation({
    mutationFn: updateWeeklyPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weeklyPlan"] });
      setEditing(false);
    },
  });

  if (isLoading) {
    return (
      <div className="rounded-[24px] bg-white/70 px-5 py-4 shadow-soft">
        <div className="mb-4 h-6 w-40 animate-pulse rounded bg-sand-200" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-sand-100" />
          ))}
        </div>
      </div>
    );
  }

  if (!plan) return null;

  if (editing) {
    return (
      <WeeklyPlanEditor
        plan={plan}
        onSave={(p) => saveMutation.mutate(p)}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return <WeeklyPlanView plan={plan} onEdit={() => setEditing(true)} />;
}

export default function StudyPage() {
  return (
    <RequireRole role="child">
      <ChildTaskPage types={["study"]} backHref="/child">
        <WeeklyPlanSection />
      </ChildTaskPage>
    </RequireRole>
  );
}

"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fetchWeeklyPlan, updateWeeklyPlan } from "@/lib/mockApi";
import { StudyIcon, PlusIcon, TrashIcon } from "@/components/icons";
import { ClayCard } from "@/components/child/ClayCard";
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
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  return `${fmt(monday)} \u2013 ${fmt(sunday)}`;
}

function WeeklyPlanView({ plan, onEdit }: { plan: WeeklyPlan; onEdit: () => void }) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StudyIcon className="h-5 w-5 text-violet-600" />
          <h2 className="font-display text-lg italic text-ink">Weekly Plan</h2>
          <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700">{plan.weekLabel}</span>
        </div>
        <button
          onClick={onEdit}
          className="rounded-full bg-violet-100 px-3.5 py-1.5 text-xs font-medium text-violet-700 shadow-[0_4px_12px_rgba(45,42,38,0.06),0_-2px_6px_rgba(255,255,255,0.5)] transition-all hover:shadow-[0_6px_16px_rgba(45,42,38,0.1),0_-2px_8px_rgba(255,255,255,0.7)]"
        >
          Edit Plan
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {plan.days.map((day) => (
          <div key={day.day}>
            <p className="mb-1.5 text-xs font-semibold text-stone-500">{day.day}</p>
            {day.items.length === 0 ? (
              <p className="text-xs text-stone-400 italic">Nothing planned</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {day.items.map((item, i) => (
                  <span
                    key={i}
                    className="rounded-lg border border-violet-200 bg-violet-50/50 px-3 py-1.5 text-xs font-medium text-ink shadow-[0_2px_6px_rgba(0,0,0,0.03)]"
                  >
                    {item.subject}{item.topic ? ` \u2014 ${item.topic}` : ""}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function WeeklyPlanEditor({ plan, onSave, onCancel }: { plan: WeeklyPlan; onSave: (p: WeeklyPlan) => void; onCancel: () => void }) {
  const [label, setLabel] = useState(plan.weekLabel);
  const [days, setDays] = useState(plan.days);

  function updateItem(dayIdx: number, itemIdx: number, field: "subject" | "topic", value: string) {
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
      next[dayIdx] = { ...next[dayIdx], items: next[dayIdx].items.filter((_, i) => i !== itemIdx) };
      return next;
    });
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StudyIcon className="h-5 w-5 text-violet-600" />
          <h2 className="font-display text-lg italic text-ink">Edit Weekly Plan</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="rounded-full border border-sand-300 bg-white/50 px-3 py-1.5 text-xs font-medium text-stone-600 shadow-[0_4px_12px_rgba(45,42,38,0.06),0_-2px_6px_rgba(255,255,255,0.5)] transition-all hover:shadow-[0_6px_16px_rgba(45,42,38,0.1),0_-2px_8px_rgba(255,255,255,0.7)]"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ weekLabel: label, days })}
            className="rounded-full bg-violet-500 px-3 py-1.5 text-xs font-medium text-white shadow-[0_4px_12px_rgba(45,42,38,0.06),0_-2px_6px_rgba(255,255,255,0.5)] transition-all hover:shadow-[0_6px_16px_rgba(45,42,38,0.1),0_-2px_8px_rgba(255,255,255,0.7)]"
          >
            Save Plan
          </button>
        </div>
      </div>
      <div className="mb-3">
        <label className="mb-1 block text-xs font-medium text-stone-500">Week label</label>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full rounded-lg border border-sand-300 bg-white px-3 py-2 text-sm text-ink outline-none focus:ring-2 focus:ring-violet-200"
        />
      </div>
      <div className="flex flex-col gap-4">
        {days.map((day, di) => (
          <div key={day.day}>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-stone-500">{day.day}</p>
              <button
                onClick={() => addItem(di)}
                className="flex items-center gap-1 text-xs font-medium text-violet-600 transition-colors hover:text-violet-800"
              >
                <PlusIcon className="h-3.5 w-3.5" />
                Add
              </button>
            </div>
            {day.items.length === 0 ? (
              <p className="text-xs text-stone-400 italic">Nothing planned \u2014 click Add to add a subject.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {day.items.map((item, ii) => (
                  <div key={ii} className="flex items-center gap-2 rounded-xl border border-sand-200 bg-white px-3 py-2 shadow-[0_2px_6px_rgba(0,0,0,0.03)]">
                    <select
                      value={item.subject}
                      onChange={(e) => updateItem(di, ii, "subject", e.target.value)}
                      className="rounded-lg border border-sand-300 bg-white px-2 py-1.5 text-sm text-ink outline-none"
                    >
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <input
                      value={item.topic}
                      onChange={(e) => updateItem(di, ii, "topic", e.target.value)}
                      placeholder="Topic, chapter, or area"
                      className="flex-1 rounded-lg border border-sand-300 bg-white px-3 py-1.5 text-sm text-ink outline-none placeholder:text-stone-400"
                    />
                    <button
                      onClick={() => removeItem(di, ii)}
                      className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-clay-50 hover:text-clay-600"
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
    </div>
  );
}

export function WeeklyPlanSection() {
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
      <ClayCard className="p-5">
        <div className="mb-4 h-6 w-40 animate-pulse rounded bg-sand-200" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl bg-sand-100" />
          ))}
        </div>
      </ClayCard>
    );
  }

  if (!plan) return null;

  return (
    <ClayCard className="p-5">
      {editing ? (
        <WeeklyPlanEditor
          plan={plan}
          onSave={(p) => saveMutation.mutate(p)}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <WeeklyPlanView plan={plan} onEdit={() => setEditing(true)} />
      )}
    </ClayCard>
  );
}

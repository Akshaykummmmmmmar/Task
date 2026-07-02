"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { SummaryCards } from "@/components/SummaryCards";
import { DayRhythm } from "@/components/DayRhythm";
import { ActivityFeed } from "@/components/ActivityFeed";
import { AttentionPanel } from "@/components/AttentionPanel";
import { RequireRole } from "@/components/RequireRole";
import {
  RemindersIcon,
  MedicineIcon,
  AssignIcon,
} from "@/components/icons";
import {
  fetchChildSummary,
  fetchChildren,
  fetchParent,
  fetchReminders,
  fetchActivity,
} from "@/lib/mockApi";
import { isOverdue, cn } from "@/lib/utils";

const QUICK_ACTIONS = [
  {
    href: "/reminders",
    label: "Reminders",
    desc: "Manage daily tasks",
    icon: RemindersIcon,
    color: "bg-sage-500",
  },
  {
    href: "/medicine",
    label: "Medicine",
    desc: "Set medication schedules",
    icon: MedicineIcon,
    color: "bg-clay-500",
  },
  {
    href: "/assign",
    label: "Assign Study",
    desc: "Plan study sessions",
    icon: AssignIcon,
    color: "bg-sky-500",
  },
] as const;

function CardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-32 animate-pulse rounded-card border border-sand-300 bg-white/50" />
      ))}
    </div>
  );
}

function DashboardContent() {
  const { data: parent } = useQuery({ queryKey: ["parent"], queryFn: fetchParent });
  const { data: children } = useQuery({ queryKey: ["children"], queryFn: fetchChildren });
  const child = children?.[0];

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ["summary", child?.id],
    queryFn: () => fetchChildSummary(child!.id),
    enabled: !!child,
  });

  const { data: reminders } = useQuery({
    queryKey: ["reminders"],
    queryFn: fetchReminders,
  });

  const { data: activity } = useQuery({
    queryKey: ["activity", child?.id],
    queryFn: () => fetchActivity(child!.id),
    enabled: !!child,
  });

  const overdue = useMemo(
    () => (reminders ?? []).filter((r) => isOverdue(r)),
    [reminders]
  );

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <AppShell>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {child && (
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sage-100 font-display text-xl italic text-sage-700 shadow-soft">
              {child.avatarInitials}
            </span>
          )}
          <div>
            <h1 className="font-display text-2xl italic text-ink">
              Good afternoon, {parent?.name?.split(" ")[0] ?? ""}
            </h1>
            <p className="mt-0.5 text-sm text-stone-500">
              {todayStr} &middot; {child?.name ?? "your child"}&apos;s dashboard
            </p>
          </div>
        </div>
        {overdue.length > 0 && (
          <div className="flex items-center gap-2 rounded-full bg-coral-50 px-4 py-2 text-sm text-coral-700">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-coral-200 text-xs font-bold">
              {overdue.length}
            </span>
            <span>Overdue</span>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="group flex items-center gap-4 rounded-xl border border-sand-300 bg-white/70 p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-sm", action.color)}>
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-ink">{action.label}</p>
                <p className="text-xs text-stone-400">{action.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="flex flex-col gap-6">
        {/* Attention Panel */}
        {reminders && child && overdue.length > 0 && (
          <div className="fade-in">
            <AttentionPanel overdue={overdue} childName={child.name} />
          </div>
        )}

        {/* Summary Cards */}
        <div className="fade-in-1">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg italic text-ink">Today&apos;s Progress</h2>
          </div>
          {summaryLoading || !summary ? (
            <CardsSkeleton />
          ) : (
            <SummaryCards summary={summary} />
          )}
        </div>

        {/* Schedule + Activity */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="fade-in-2 lg:col-span-3">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg italic text-ink">Today&apos;s Schedule</h2>
            </div>
            {reminders ? (
              <DayRhythm reminders={reminders} />
            ) : (
              <div className="h-64 animate-pulse rounded-card border border-sand-300 bg-white/50" />
            )}
          </div>
          <div className="fade-in-3 lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg italic text-ink">Recent Activity</h2>
            </div>
            {activity ? (
              <ActivityFeed items={activity} />
            ) : (
              <div className="h-64 animate-pulse rounded-card border border-sand-300 bg-white/50" />
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function DashboardPage() {
  return (
    <RequireRole role="parent">
      <DashboardContent />
    </RequireRole>
  );
}

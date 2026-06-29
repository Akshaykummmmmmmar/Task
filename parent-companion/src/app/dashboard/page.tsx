"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { SummaryCards } from "@/components/SummaryCards";
import { DayRhythm } from "@/components/DayRhythm";
import { ActivityFeed } from "@/components/ActivityFeed";
import { AttentionPanel } from "@/components/AttentionPanel";
import { RequireRole } from "@/components/RequireRole";
import {
  fetchChildSummary,
  fetchChildren,
  fetchParent,
  fetchReminders,
  fetchActivity,
} from "@/lib/mockApi";
import { isOverdue } from "@/lib/utils";

function CardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-32 animate-pulse rounded-card border border-sand-300 bg-white/50"
        />
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

  return (
    <AppShell>
      <PageHeader
        parent={parent}
        child={child}
        title={`Good afternoon, ${parent?.name.split(" ")[0] ?? ""}`}
        subtitle="Here's where things stand for Riya today."
      />

      <div className="flex flex-col gap-6">
        {reminders && child && (
          <div className="fade-in">
            <AttentionPanel overdue={overdue} childName={child.name} />
          </div>
        )}

        <div className="fade-in-1">
          {summaryLoading || !summary ? (
            <CardsSkeleton />
          ) : (
            <SummaryCards summary={summary} />
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="fade-in-2 lg:col-span-3">
            {reminders ? (
              <DayRhythm reminders={reminders} />
            ) : (
              <div className="h-64 animate-pulse rounded-card border border-sand-300 bg-white/50" />
            )}
          </div>
          <div className="fade-in-3 lg:col-span-2">
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

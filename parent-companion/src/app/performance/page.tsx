"use client";

import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { RequireRole } from "@/components/RequireRole";
import { PageHeader } from "@/components/PageHeader";
import { SparkleIcon, StarIcon } from "@/components/icons";
import {
  fetchParent,
  fetchChildren,
  fetchChildSummary,
  fetchReminders,
  fetchActivity,
} from "@/lib/mockApi";
import { cn } from "@/lib/utils";

type Mood = "celebration" | "happy" | "gentle" | "determined";

function getMood(rate: number): Mood {
  if (rate >= 100) return "celebration";
  if (rate >= 80) return "happy";
  if (rate >= 50) return "gentle";
  return "determined";
}

function getMoodData(mood: Mood, name: string) {
  switch (mood) {
    case "celebration":
      return {
        emoji: "😁",
        quote: `${name} completed all tasks!`,
        sub: "Amazing work today — you should be proud!",
        gradient: "from-amber-300 via-sun-300 to-amber-200",
        glow: "rgba(251,191,36,0.4)",
        badge: "100% Complete",
        badgeColor: "bg-sun-500 text-paper",
      };
    case "happy":
      return {
        emoji: "😊",
        quote: `Almost there, ${name}!`,
        sub: "Just a few more tasks — keep going!",
        gradient: "from-sage-300 via-emerald-200 to-sage-200",
        glow: "rgba(80,180,130,0.35)",
        badge: "Almost done",
        badgeColor: "bg-sage-500 text-paper",
      };
    case "gentle":
      return {
        emoji: "😊",
        quote: `Good effort, ${name}!`,
        sub: "You're making progress — every little bit counts!",
        gradient: "from-sky-300 via-blue-200 to-sky-200",
        glow: "rgba(100,160,220,0.3)",
        badge: "In progress",
        badgeColor: "bg-sky-500 text-paper",
      };
    case "determined":
      return {
        emoji: "😔",
        quote: `Let's go, ${name}!`,
        sub: "A fresh start is all it takes — you've got this!",
        gradient: "from-clay-300 via-coral-200 to-clay-200",
        glow: "rgba(200,120,90,0.3)",
        badge: "Getting started",
        badgeColor: "bg-clay-500 text-paper",
      };
  }
}

function Sparkle({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <span
      className={cn("absolute text-xs animate-sparkle", className)}
      style={style}
      aria-hidden="true"
    >
      ✦
    </span>
  );
}

function Confetti({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const colors = ["bg-sun-400", "bg-coral-400", "bg-sky-400", "bg-sage-400", "bg-clay-400"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  return (
    <span
      className={cn(
        "absolute h-2 w-2 rounded-full animate-confetti-fall",
        color,
        className
      )}
      style={style}
      aria-hidden="true"
    />
  );
}

const ACHIEVEMENTS = [
  { min: 100, label: "All tasks completed! 🎉", emoji: "🏆" },
  { min: 80, label: "Nearing perfection", emoji: "⭐" },
  { min: 50, label: "Halfway there!", emoji: "🌱" },
  { min: 0, label: "Every journey starts with one step", emoji: "🚀" },
];

function getAchievement(rate: number) {
  return ACHIEVEMENTS.find((a) => rate >= a.min) ?? ACHIEVEMENTS[ACHIEVEMENTS.length - 1];
}

function PerformanceContent() {
  const { data: parent } = useQuery({ queryKey: ["parent"], queryFn: fetchParent });
  const { data: children } = useQuery({ queryKey: ["children"], queryFn: fetchChildren });
  const child = children?.[0];
  const childName = child?.name ?? "your child";

  const { data: summary } = useQuery({
    queryKey: ["summary", child?.id],
    queryFn: () => fetchChildSummary(child!.id),
    enabled: !!child,
  });

  const { data: reminders } = useQuery({ queryKey: ["reminders"], queryFn: fetchReminders });
  const { data: activity } = useQuery({
    queryKey: ["activity", child?.id],
    queryFn: () => fetchActivity(child!.id),
    enabled: !!child,
  });

  const totalTasks = reminders?.length ?? 0;
  const completedTasks = reminders?.filter((r) => r.status === "completed").length ?? 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const studyReminders = (reminders ?? []).filter((r) => r.type === "study");
  const studyCompleted = studyReminders.filter((r) => r.status === "completed").length;
  const studyTotal = studyReminders.length;

  const todayActivity = (activity ?? []).filter(
    (a) => new Date(a.occurredAt).toDateString() === new Date().toDateString()
  ).length;

  const mood = getMood(completionRate);
  const moodData = getMoodData(mood, childName);
  const achievement = getAchievement(completionRate);

  const statCards = [
    {
      label: "Tasks Done",
      value: `${completedTasks}/${totalTasks}`,
      rate: completionRate,
      color: completionRate >= 80 ? "text-sage-600" : completionRate >= 50 ? "text-sky-600" : "text-clay-600",
      bg: completionRate >= 80 ? "bg-sage-50" : completionRate >= 50 ? "bg-sky-50" : "bg-clay-50",
      border: completionRate >= 80 ? "border-sage-200" : completionRate >= 50 ? "border-sky-200" : "border-clay-200",
    },
    {
      label: "Study Progress",
      value: studyTotal > 0 ? `${studyCompleted}/${studyTotal}` : "—",
      rate: studyTotal > 0 ? Math.round((studyCompleted / studyTotal) * 100) : 0,
      color: "text-sage-600",
      bg: "bg-sage-50",
      border: "border-sage-200",
    },
    {
      label: "Meals Logged",
      value: summary ? `${summary.meals.logged}/${summary.meals.target}` : "—",
      rate: summary ? Math.round((summary.meals.logged / summary.meals.target) * 100) : 0,
      color: "text-sun-600",
      bg: "bg-sun-50",
      border: "border-sun-200",
    },
    {
      label: "Supplements Taken",
      value: summary ? `${summary.supplements.taken}/${summary.supplements.scheduled}` : "—",
      rate: summary ? Math.round((summary.supplements.taken / summary.supplements.scheduled) * 100) : 0,
      color: "text-clay-600",
      bg: "bg-clay-50",
      border: "border-clay-200",
    },
  ];

  return (
    <AppShell>
      <PageHeader
        parent={parent}
        child={child}
        title="Performance"
        subtitle="See how your child is doing today"
      />

      {/* Character & Mood Section */}
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-sand-300/60 bg-white/70 p-8 shadow-soft">
        {/* Background decoration */}
        <div
          className="absolute inset-0 bg-gradient-to-br opacity-30"
          style={{ backgroundImage: `linear-gradient(to bottom right, ${moodData.gradient})` }}
        />

        {/* Floating sparkles */}
        <Sparkle className="left-8 top-6" />
        <Sparkle className="right-12 top-8" style={{ animationDelay: "0.7s" }} />
        <Sparkle className="bottom-10 left-1/4" style={{ animationDelay: "1.4s" }} />
        <Sparkle className="right-8 bottom-8" style={{ animationDelay: "0.4s" }} />

        {mood === "celebration" && (
          <>
            <Confetti className="left-1/3 top-4" style={{ animationDelay: "0s" }} />
            <Confetti className="left-1/2 top-2" style={{ animationDelay: "0.3s" }} />
            <Confetti className="right-1/3 top-3" style={{ animationDelay: "0.6s" }} />
            <Confetti className="left-1/4 top-6" style={{ animationDelay: "0.9s" }} />
            <Confetti className="right-1/4 top-5" style={{ animationDelay: "1.2s" }} />
          </>
        )}

        <div className="relative flex flex-col items-center gap-5 sm:flex-row sm:gap-8">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div
              className="flex h-44 w-44 items-center justify-center rounded-full bg-gradient-to-br animate-float"
              style={{
                backgroundImage: `linear-gradient(to bottom right, ${moodData.gradient})`,
                boxShadow: `0 0 50px ${moodData.glow}`,
              }}
            >
              <span
                className={cn(
                  "select-none transition-all duration-500",
                  mood === "celebration" ? "text-7xl animate-wiggle" : "text-6xl"
                )}
              >
                {moodData.emoji}
              </span>
            </div>
            {mood === "celebration" && (
              <span className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-sun-400 text-xs text-white shadow-lg animate-ping">
                ⭐
              </span>
            )}
          </div>

          {/* Quote bubble */}
          <div className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left">
            <span
              className={cn(
                "inline-block rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider",
                moodData.badgeColor
              )}
            >
              {moodData.badge}
            </span>
            <h2 className="font-display text-2xl italic leading-tight text-ink">
              &ldquo;{moodData.quote}&rdquo;
            </h2>
            <p className="text-sm text-stone-500">{moodData.sub}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className={cn(
              "rounded-xl border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
              stat.bg,
              stat.border
            )}
          >
            <p className="text-xs font-medium text-stone-500">{stat.label}</p>
            <p className={cn("mt-1.5 text-2xl font-semibold", stat.color)}>
              {stat.value}
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/60">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${Math.min(stat.rate, 100)}%`,
                  backgroundColor: stat.rate >= 80 ? "#5b7a6b" : stat.rate >= 50 ? "#3e92b8" : "#c8745c",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Achievement & Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-sand-300 bg-white/70 p-6 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <StarIcon className="h-4.5 w-4.5 text-sun-600" />
            <h3 className="font-display text-base italic text-ink">Today&apos;s Achievement</h3>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-4xl">{achievement.emoji}</span>
            <div>
              <p className="text-sm font-medium text-ink">{achievement.label}</p>
              <p className="mt-1 text-xs text-stone-400">
                {completedTasks} of {totalTasks} tasks completed ({completionRate}%)
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-sand-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sage-400 to-sage-500 transition-all duration-700"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-sand-300 bg-white/70 p-6 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <SparkleIcon className="h-4.5 w-4.5 text-sage-600" />
            <h3 className="font-display text-base italic text-ink">Encouragement</h3>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-3xl">
              {mood === "celebration" ? "🎉" : mood === "happy" ? "🌟" : mood === "gentle" ? "🌿" : "🌈"}
            </span>
            <div>
              <p className="text-sm text-ink">
                {mood === "celebration"
                  ? `${childName} crushed every goal today! The consistency is remarkable. Keep nurturing this wonderful routine!`
                  : mood === "happy"
                  ? `So close to a perfect day! A tiny nudge on the remaining tasks and ${childName} will be all caught up.`
                  : mood === "gentle"
                  ? `Solid progress today! Every completed task builds momentum. Help ${childName} tackle the next one.`
                  : `Today is a fresh canvas! Guide ${childName} through the first few tasks and momentum will build naturally.`}
              </p>
              <p className="mt-2 text-xs text-stone-400">
                {todayActivity > 0
                  ? `${todayActivity} activities logged today`
                  : "No activity logged yet today"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function PerformancePage() {
  return (
    <RequireRole role="parent">
      <PerformanceContent />
    </RequireRole>
  );
}

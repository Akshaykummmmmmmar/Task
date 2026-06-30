"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ChildShell } from "@/components/ChildShell";
import { PassionIcon, SparkleIcon } from "@/components/icons";
import { RequireRole } from "@/components/RequireRole";
import { fetchPassions, fetchPassionData } from "@/lib/mockApi";
import { cn, DEMO_NOW } from "@/lib/utils";
import { PassionDef } from "@/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

function getDayOfYear(d: Date) {
  const start = new Date(Date.UTC(d.getUTCFullYear(), 0, 0));
  return Math.floor((d.getTime() - start.getTime()) / 86400000);
}

function dailyQuote(passionId: string): string {
  const quotes: Record<string, string[]> = {
    football: ["The harder you work, the luckier you get. — Gary Player", "Success is no accident. — Pelé", "Practice doesn't make perfect. Perfect practice makes perfect."],
    cricket: ["You have to keep believing in yourself. — Virat Kohli", "Cricket is a game of patience and timing.", "Champions keep playing until they get it right."],
    basketball: ["Hard work beats talent when talent doesn't work hard.", "The strength of the team is each member. — Michael Jordan"],
    athletics: ["It's not about being the best. It's about being better than yesterday.", "Pain is temporary, quitting lasts forever."],
    chess: ["Chess is the gym of the mind.", "Every master was once a beginner.", "In chess, as in life, the best move is the one you learn from."],
    drawing: ["Every artist was first an amateur.", "Creativity takes courage. — Matisse", "Draw the art you want to see."],
    painting: ["The purpose of art is to wash the dust of daily life off our souls.", "Every child is an artist. — Picasso"],
    music: ["Music is the universal language of mankind.", "Where words fail, music speaks.", "Practice makes progress, not perfection."],
    dance: ["Dance is the hidden language of the soul.", "Do it with passion or not at all.", "Every dancer was once a beginner."],
    coding: ["Everybody should learn to program a computer. — Steve Jobs", "The best way to predict the future is to create it.", "First, solve the problem. Then, write the code."],
    robotics: ["Robotics is where imagination meets engineering.", "Building robots teaches you to think in systems.", "Failure is just a step on the way to success."],
    photography: ["A good photo is one you look at twice.", "Photography is the story you fail to put into words.", "The best camera is the one you have with you."],
    writing: ["The scariest moment is just before you start writing.", "A writer never finishes a book — they just stop writing.", "Write what you know, but write what you love."],
  };
  const list = quotes[passionId] ?? ["Believe you can and you're halfway there.", "The only way to do great work is to love what you do."];
  return list[getDayOfYear(new Date(DEMO_NOW)) % list.length];
}

const LEVEL_COLORS: Record<string, string> = {
  Beginner: "bg-sage-100 text-sage-700",
  Intermediate: "bg-sun-100 text-sun-700",
  Advanced: "bg-clay-100 text-clay-700",
};

function PassionSelector({ passions, onSelect }: { passions: PassionDef[]; onSelect: (id: string) => void }) {
  const categories = [
    { label: "Sports", filter: "sports" },
    { label: "Arts", filter: "arts" },
    { label: "STEM", filter: "stem" },
    { label: "Mind Games", filter: "mind" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-600">
          <PassionIcon className="h-6 w-6" />
        </span>
        <div>
          <h1 className="font-display text-2xl italic text-ink">Passion & Talent</h1>
          <p className="text-sm text-stone-500">Choose what you&apos;d like to learn and grow in</p>
        </div>
      </div>

      {categories.map((cat) => {
        const items = passions.filter((p) => p.category === cat.filter);
        if (items.length === 0) return null;
        return (
          <section key={cat.filter}>
            <h2 className="mb-3 font-display text-lg italic text-ink">{cat.label}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {items.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelect(p.id)}
                  className="focus-ring flex flex-col items-center gap-2 rounded-[20px] border-2 border-transparent bg-white p-4 text-center shadow-soft transition-all hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md active:scale-[0.98]"
                >
                  <span className="text-3xl">{p.emoji}</span>
                  <span className="text-sm font-medium text-ink">{p.name}</span>
                </button>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function PassionDashboard({ passionId, onBack }: { passionId: string; onBack: () => void }) {
  const { data, isLoading } = useQuery({
    queryKey: ["passionData", passionId],
    queryFn: () => fetchPassionData(passionId),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-8 w-48 animate-pulse rounded bg-sand-200" />
        <div className="h-32 animate-pulse rounded-[24px] bg-white/60" />
        <div className="h-48 animate-pulse rounded-[24px] bg-white/60" />
      </div>
    );
  }

  if (!data) return <p className="text-stone-500">Could not load passion data.</p>;

  const { passion, progress, roadmap, resources } = data;
  const quote = dailyQuote(passionId);
  const canContinue = progress.currentStageIndex >= 0 && progress.currentStageIndex < roadmap.length;
  const currentStage = canContinue ? roadmap[progress.currentStageIndex] : null;

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/child"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 transition-colors hover:text-sky-800"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between rounded-[24px] bg-white/70 px-5 py-4 shadow-soft">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{passion.emoji}</span>
          <div>
            <h1 className="font-display text-2xl italic text-ink">{passion.name}</h1>
            <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", LEVEL_COLORS[progress.level])}>
              {progress.level}
            </span>
          </div>
        </div>
        <button
          onClick={onBack}
          className="focus-ring rounded-full border-2 border-violet-300 px-5 py-1.5 text-sm font-medium text-violet-700 transition-all hover:bg-violet-100"
        >
          Change Passion
        </button>
      </div>

      {/* Quote */}
      <div className="rounded-[24px] bg-violet-50/70 px-5 py-4 shadow-soft">
        <div className="mb-1 flex items-center gap-1.5">
          <SparkleIcon className="h-4 w-4 text-violet-500" />
          <span className="text-xs font-medium text-violet-700">Daily Motivation</span>
        </div>
        <p className="text-sm italic text-ink">&ldquo;{quote}&rdquo;</p>
      </div>

      {/* Progress bar */}
      <div className="rounded-[24px] bg-white/70 px-5 py-4 shadow-soft">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-ink">Overall Progress</p>
          <p className="text-sm text-violet-600">{progress.progress}%</p>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-violet-100">
          <div className="h-full rounded-full bg-violet-500 transition-all duration-500" style={{ width: `${progress.progress}%` }} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Days Practiced", value: progress.daysPracticed },
          { label: "Lessons Done", value: progress.completedLessons },
          { label: "Current Streak", value: `${progress.currentStreak} days` },
          { label: "Started", value: formatDate(progress.selectedAt) },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[20px] bg-white/70 px-4 py-3 text-center shadow-soft">
            <p className="text-lg font-bold text-ink">{stat.value}</p>
            <p className="text-xs text-stone-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Learning Roadmap */}
      <section className="rounded-[24px] bg-white/70 px-5 py-4 shadow-soft">
        <h2 className="mb-4 font-display text-xl italic text-ink">Learning Roadmap</h2>
        <div className="flex flex-col gap-2">
          {roadmap.map((stage, i) => {
            const active = i === progress.currentStageIndex;
            return (
              <div
                key={stage.id}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 transition-all",
                  stage.completed
                    ? "border-sage-300 bg-sage-50/50"
                    : active
                    ? "border-violet-300 bg-violet-50"
                    : stage.locked
                    ? "border-sand-200 bg-white/50 opacity-60"
                    : "border-sand-200 bg-white"
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold",
                    stage.completed
                      ? "bg-sage-200 text-sage-700"
                      : active
                      ? "bg-violet-200 text-violet-700"
                      : "bg-sand-100 text-stone-400"
                  )}
                >
                  {stage.completed ? "✓" : stage.locked ? "🔒" : i + 1}
                </span>
                <div className="flex-1">
                  <p className={cn("text-sm font-medium", stage.completed ? "text-sage-700" : "text-ink")}>
                    {stage.name}
                  </p>
                  <p className="text-xs text-stone-500">{stage.description}</p>
                </div>
                {active && !stage.completed && (
                  <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700">
                    Current
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Continue Learning */}
      {currentStage && (
        <button className="focus-ring w-full rounded-full bg-violet-500 py-3 text-sm font-medium text-paper transition-colors hover:bg-violet-600 active:scale-[0.98]">
          Continue Learning: {currentStage.name}
        </button>
      )}

      {/* Daily Practice Plan */}
      <section className="rounded-[24px] bg-white/70 px-5 py-4 shadow-soft">
        <h2 className="mb-4 font-display text-xl italic text-ink">Today&apos;s Practice Plan</h2>
        <div className="flex flex-col gap-3">
          {[
            { step: "Warm-up", detail: progress.practicePlan.warmUp, color: "bg-sun-100 text-sun-700" },
            { step: "Skill Practice", detail: progress.practicePlan.skillPractice, color: "bg-sky-100 text-sky-700" },
            { step: "Physical Exercise", detail: progress.practicePlan.physicalExercise, color: "bg-sage-100 text-sage-700" },
            { step: "Cool Down", detail: progress.practicePlan.coolDown, color: "bg-clay-100 text-clay-700" },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 rounded-xl border border-sand-200 bg-white px-4 py-3">
              <span className={cn("flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium", item.color)}>
                {item.step}
              </span>
              <p className="text-sm text-stone-600">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Learning Resources */}
      {resources.length > 0 && (
        <section className="rounded-[24px] bg-white/70 px-5 py-4 shadow-soft">
          <h2 className="mb-4 font-display text-xl italic text-ink">Learning Resources</h2>
          <div className="flex flex-col gap-3">
            {resources.map((r, i) => (
              <div key={i} className="rounded-xl border border-sand-200 bg-white px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium",
                    r.type === "video" ? "bg-clay-100 text-clay-700" :
                    r.type === "article" ? "bg-sky-100 text-sky-700" :
                    r.type === "tip" ? "bg-sun-100 text-sun-700" :
                    "bg-sage-100 text-sage-700"
                  )}>
                    {r.type}
                  </span>
                  <p className="text-sm font-medium text-ink">{r.title}</p>
                </div>
                <p className="mt-1.5 text-xs text-stone-500 leading-relaxed">{r.content}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function PassionPage() {
  const [selectedPassion, setSelectedPassion] = useState<string | null>(null);

  const { data: passions } = useQuery({
    queryKey: ["passions"],
    queryFn: fetchPassions,
  });

  if (!passions || passions.length === 0) {
    return (
      <RequireRole role="child">
        <ChildShell>
          <div className="h-32 animate-pulse rounded-[24px] bg-white/60" />
        </ChildShell>
      </RequireRole>
    );
  }

  return (
    <RequireRole role="child">
      <ChildShell>
        {selectedPassion ? (
          <PassionDashboard passionId={selectedPassion} onBack={() => setSelectedPassion(null)} />
        ) : (
          <PassionSelector passions={passions} onSelect={setSelectedPassion} />
        )}
      </ChildShell>
    </RequireRole>
  );
}

"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fetchPassions, fetchPassionData } from "@/lib/mockApi";
import { PassionIcon, SparkleIcon, StarIcon, BadgeIcon } from "@/components/icons";
import { RequireRole } from "@/components/RequireRole";
import { HeroBanner } from "@/components/child/HeroBanner";
import { ClayCard } from "@/components/child/ClayCard";
import { StatCard } from "@/components/child/StatCard";
import { GreetingHeader } from "@/components/child/GreetingHeader";
import { CreativeIllustration } from "@/components/child/illustrations";
import { cn, DEMO_NOW } from "@/lib/utils";
import { PassionDef } from "@/types";

function getDayOfYear(d: Date) {
  const start = new Date(Date.UTC(d.getUTCFullYear(), 0, 0));
  return Math.floor((d.getTime() - start.getTime()) / 86400000);
}

function dailyQuote(passionId: string): string {
  const quotes: Record<string, string[]> = {
    football: ["The harder you work, the luckier you get.", "Success is no accident.", "Practice makes perfect practice."],
    cricket: ["Keep believing in yourself.", "Patience and timing win games.", "Champions keep playing."],
    basketball: ["Hard work beats talent.", "Teamwork makes the dream work."],
    volleyball: ["Teamwork makes the dream work.", "Every touch sets up the next."],
    badminton: ["Speed and precision win rallies.", "Stay light on your feet."],
    table_tennis: ["Chess at lightning speed.", "Spin, speed, placement."],
    chess: ["Chess is the gym of the mind.", "Every master was once a beginner."],
    running: ["The real race is against yourself.", "Every mile is a memory."],
    swimming: ["Make peace with the water.", "Every stroke brings you closer."],
    jumping: ["Believe you can fly.", "Push off and reach for the sky."],
    gymnastics: ["Strength meets grace.", "Every flip is a victory over fear."],
    javelin: ["The javelin flies as far as you dare.", "Precision, power, timing."],
    discus: ["Spin, balance, release.", "Trust the technique."],
    shot_put: ["Power channeled through precision.", "Technique wins."],
    high_jump: ["The bar rises, and so must you.", "Overcome gravity."],
    long_jump: ["Speed builds the jump.", "Launch, glide, land."],
    pole_vault: ["The closest humans get to flying.", "Trust the pole, trust yourself."],
    hurdles: ["Rhythm, not just speed.", "Clear it and move on."],
    marathon: ["A test of will.", "Pain is temporary, finishing lasts forever."],
    drawing: ["Every artist was first an amateur.", "Creativity takes courage."],
    painting: ["The purpose of art is to express.", "Every canvas is a new world."],
    music: ["Music is the universal language.", "Where words fail, music speaks."],
    dance: ["Dance is the hidden language of the soul.", "Do it with passion."],
    coding: ["Everybody should learn to code.", "The best way to predict the future is to create it."],
    robotics: ["Where imagination meets engineering.", "Failure is a step to success."],
    photography: ["A good photo tells a story.", "The best camera is the one you have."],
    writing: ["The scariest moment is before you start.", "Write what you love."],
  };
  const list = quotes[passionId] ?? ["Believe you can and you're halfway there."];
  return list[getDayOfYear(new Date(DEMO_NOW)) % list.length];
}

const LEVEL_COLORS: Record<string, string> = {
  Beginner: "bg-pink-100 text-pink-700",
  Intermediate: "bg-violet-100 text-violet-700",
  Advanced: "bg-sun-100 text-sun-700",
};

const CATEGORIES = [
  { label: "Games", filter: "games" },
  { label: "Athletics", filter: "athletics" },
  { label: "Arts", filter: "arts" },
  { label: "STEM", filter: "stem" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

function PassionSelector({ passions, onSelect }: { passions: PassionDef[]; onSelect: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-6">
      {CATEGORIES.map((cat) => {
        const items = passions.filter((p) => p.category === cat.filter);
        if (items.length === 0) return null;
        return (
          <motion.div
            key={cat.filter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="mb-3 font-display text-lg italic text-ink">{cat.label}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {items.map((p, i) => (
                <motion.button
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(45,42,38,0.1), 0 -4px 16px rgba(255,255,255,0.8)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSelect(p.id)}
                  className="flex flex-col items-center gap-2 rounded-2xl border-2 border-transparent bg-white/80 p-4 text-center shadow-[0_6px_20px_rgba(45,42,38,0.06),0_-3px_10px_rgba(255,255,255,0.6)] transition-all hover:border-pink-300"
                >
                  <span className="text-3xl">{p.emoji}</span>
                  <span className="text-sm font-medium text-ink">{p.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
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
        <div className="h-32 animate-pulse rounded-2xl bg-white/60" />
        <div className="h-48 animate-pulse rounded-2xl bg-white/60" />
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
      {/* Header card */}
      <ClayCard className="flex items-center justify-between p-5">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{passion.emoji}</span>
          <div>
            <h1 className="font-display text-xl italic text-ink">{passion.name}</h1>
            <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", LEVEL_COLORS[progress.level])}>
              {progress.level}
            </span>
          </div>
        </div>
        <button
          onClick={onBack}
          className="rounded-full border-2 border-pink-300 bg-white/50 px-4 py-1.5 text-xs font-medium text-pink-700 shadow-[0_4px_12px_rgba(45,42,38,0.06),0_-2px_6px_rgba(255,255,255,0.5)] transition-all hover:bg-pink-100 hover:shadow-[0_6px_16px_rgba(45,42,38,0.1),0_-2px_8px_rgba(255,255,255,0.7)]"
        >
          Change
        </button>
      </ClayCard>

      {/* Quote */}
      <ClayCard className="flex items-start gap-2 p-5">
        <SparkleIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-pink-500" />
        <p className="text-sm italic text-ink">&ldquo;{quote}&rdquo;</p>
      </ClayCard>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={<StarIcon className="h-5 w-5" />} label="Days Practiced" value={progress.daysPracticed} accent="text-pink-600" delay={0.1} />
        <StatCard icon={<BadgeIcon className="h-5 w-5" />} label="Lessons Done" value={progress.completedLessons} accent="text-violet-600" delay={0.15} />
        <StatCard icon={<SparkleIcon className="h-5 w-5" />} label="Streak" value={`${progress.currentStreak}d`} accent="text-sun-600" delay={0.2} />
        <StatCard icon={<BadgeIcon className="h-5 w-5" />} label="Started" value={formatDate(progress.selectedAt)} accent="text-sage-600" delay={0.25} />
      </div>

      {/* Progress */}
      <ClayCard className="p-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-ink">Overall Progress</p>
          <p className="text-sm text-pink-600">{progress.progress}%</p>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-pink-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress.progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full bg-pink-500"
          />
        </div>
      </ClayCard>

      {/* Learning Roadmap */}
      <ClayCard className="p-5">
        <h2 className="mb-4 font-display text-lg italic text-ink">Learning Roadmap</h2>
        <div className="flex flex-col gap-2">
          {roadmap.map((stage, i) => {
            const active = i === progress.currentStageIndex;
            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 transition-all shadow-[0_2px_6px_rgba(0,0,0,0.03)]",
                  stage.completed
                    ? "border-sage-300 bg-sage-50/50"
                    : active
                    ? "border-pink-300 bg-pink-50"
                    : stage.locked
                    ? "border-sand-200 bg-white/50 opacity-60"
                    : "border-sand-200 bg-white"
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold",
                    stage.completed
                      ? "bg-sage-200 text-sage-700"
                      : active
                      ? "bg-pink-200 text-pink-700"
                      : "bg-sand-100 text-stone-400"
                  )}
                >
                  {stage.completed ? "\u2713" : stage.locked ? "\uD83D\uDD12" : i + 1}
                </span>
                <div className="flex-1">
                  <p className={cn("text-sm font-medium", stage.completed ? "text-sage-700" : "text-ink")}>{stage.name}</p>
                  <p className="text-xs text-stone-500">{stage.description}</p>
                </div>
                {active && !stage.completed && (
                  <span className="rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-medium text-pink-700">Current</span>
                )}
              </motion.div>
            );
          })}
        </div>
      </ClayCard>

      {/* Continue Learning */}
      {currentStage && (
        <motion.button
          whileHover={{ y: -2, boxShadow: "0 12px 32px rgba(45,42,38,0.12)" }}
          whileTap={{ scale: 0.98 }}
          className="w-full rounded-full bg-pink-500 py-3 text-sm font-medium text-white shadow-[0_6px_20px_rgba(45,42,38,0.08)] transition-all hover:bg-pink-600"
        >
          Continue Learning: {currentStage.name}
        </motion.button>
      )}

      {/* Today's Practice Plan */}
      <ClayCard className="p-5">
        <h2 className="mb-4 font-display text-lg italic text-ink">Today&apos;s Practice Plan</h2>
        <div className="flex flex-col gap-3">
          {[
            { step: "Warm-up", detail: progress.practicePlan.warmUp, emoji: "\u{1F525}" },
            { step: "Skill Practice", detail: progress.practicePlan.skillPractice, emoji: "\u{1F3AF}" },
            { step: "Physical Exercise", detail: progress.practicePlan.physicalExercise, emoji: "\u{1F4AA}" },
            { step: "Cool Down", detail: progress.practicePlan.coolDown, emoji: "\u{1F9D8}" },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 rounded-xl border border-pink-200/60 bg-pink-50/30 px-4 py-3 shadow-[0_2px_6px_rgba(0,0,0,0.03)]">
              <span className="text-lg">{item.emoji}</span>
              <div>
                <p className="text-sm font-medium text-ink">{item.step}</p>
                <p className="text-xs text-stone-500">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </ClayCard>

      {/* Learning Resources */}
      {resources.length > 0 && (
        <ClayCard className="p-5">
          <h2 className="mb-4 font-display text-lg italic text-ink">Learning Resources</h2>
          <div className="flex flex-col gap-3">
            {resources.map((r, i) => (
              <div key={i} className="rounded-xl border border-sand-200 bg-white px-4 py-3 shadow-[0_2px_6px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-2">
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", r.type === "video" ? "bg-clay-100 text-clay-700" : r.type === "article" ? "bg-sky-100 text-sky-700" : r.type === "tip" ? "bg-sun-100 text-sun-700" : "bg-sage-100 text-sage-700")}>
                    {r.type}
                  </span>
                  <p className="text-sm font-medium text-ink">{r.title}</p>
                </div>
                <p className="mt-1 text-xs text-stone-500">{r.content}</p>
              </div>
            ))}
          </div>
        </ClayCard>
      )}

      {/* Activities link */}
      <div className="text-center">
        <button
          onClick={() => window.location.href = "/child/activities"}
          className="rounded-full bg-white/70 px-6 py-2.5 text-sm font-medium text-stone-600 shadow-[0_4px_12px_rgba(45,42,38,0.06),0_-2px_6px_rgba(255,255,255,0.5)] transition-all hover:shadow-[0_6px_16px_rgba(45,42,38,0.1),0_-2px_8px_rgba(255,255,255,0.7)] hover:-translate-y-0.5"
        >
          🎮 Play Games & Puzzles
        </button>
      </div>
    </div>
  );
}

function PassionContent() {
  const [selectedPassion, setSelectedPassion] = useState<string | null>(null);

  const { data: passions } = useQuery({
    queryKey: ["passions"],
    queryFn: fetchPassions,
  });

  const name = "there";

  return (
    <div className="mx-auto min-h-screen max-w-4xl bg-[#faf7f2] px-4 py-6 sm:px-8 sm:py-10">
      <GreetingHeader
        childName={name}
        subtitle={selectedPassion ? "Keep building your passion!" : "Explore what you love!"}
        className="mb-6"
      />

      {!selectedPassion && (
        <HeroBanner
          greeting="Let's build your passion today! 🎨"
          subtitle="Choose something you love and start creating!"
          illustration={<CreativeIllustration />}
          accent="text-pink-700"
          gradient="bg-gradient-to-br from-pink-50 via-white to-pink-100/30"
          className="mb-8"
        />
      )}

      {!passions || passions.length === 0 ? (
        <div className="h-32 animate-pulse rounded-2xl bg-white/60" />
      ) : selectedPassion ? (
        <PassionDashboard passionId={selectedPassion} onBack={() => setSelectedPassion(null)} />
      ) : (
        <PassionSelector passions={passions} onSelect={setSelectedPassion} />
      )}
    </div>
  );
}

export default function PassionPage() {
  return (
    <RequireRole role="child">
      <PassionContent />
    </RequireRole>
  );
}

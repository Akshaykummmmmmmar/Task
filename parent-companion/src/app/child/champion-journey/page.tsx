"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSession } from "@/lib/session";
import { fetchAthleteProfile, fetchAthleteStats, fetchDailyMissions, fetchDailyRoutine, fetchAchievements, updateMission } from "@/lib/mockApi";
import { RequireRole } from "@/components/RequireRole";
import { GreetingHeader } from "@/components/child/GreetingHeader";
import { ClayCard } from "@/components/child/ClayCard";
import { cn } from "@/lib/utils";
import { StarIcon, SparkleIcon } from "@/components/icons";

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6 3h12v3c0 3.3-2.7 6-6 6s-6-2.7-6-6V3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M6 5H4a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h2" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M18 5h2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 15v4M8 19h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CoachIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="8" r="4.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 20c0-3.5 3-6 8-6s8 2.5 8 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9 19l2 2 4-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MissionIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 20V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9 20V4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M14 20v-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M19 20v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function NutritionIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 3.5C12 3.5 7 9.5 7 14a5 5 0 0 0 10 0c0-4.5-5-10.5-5-10.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 14h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function SleepIcon2({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4.5 17.5A8.5 8.5 0 0 0 17 7.5a7 7 0 0 1-9 9Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M16.5 4.5v4M18.5 6.5h-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M3 8c0-2 1-3 3-3h2v5H6a3 3 0 0 1-3-3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M10 16c0 2 1 3 3 3h2v-5h-2a3 3 0 0 0-3 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function FireIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 3.5c-1 2-3 4-3 7a3 3 0 0 0 6 0c0-3-2-5-3-7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8 14a4 4 0 0 0 8 0c0-2-1.5-3.5-4-6-2.5 2.5-4 4-4 6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function LightIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M9 18h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M10 21h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 2C9 2 7 4 7 7c0 2 1 3 2 4l1 2h4l1-2c1-1 2-2 2-4 0-3-2-5-5-5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function ProgressRing({ value, size = 100, strokeWidth = 8, color = "#C9821C" }: { value: number; size?: number; strokeWidth?: number; color?: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#F1EAD9" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-1000 ease-out"
      />
    </svg>
  );
}

const NAV_SECTIONS = [
  { id: "coach", label: "Talk to Coach", icon: CoachIcon, href: "/child/champion-journey/coach", color: "text-sun-600", bg: "bg-sun-100" },
  { id: "routine", label: "Daily Routine", icon: MissionIcon, href: "/child/champion-journey/routine", color: "text-sun-600", bg: "bg-sun-100" },
  { id: "missions", label: "Daily Missions", icon: StarIcon, href: "/child/champion-journey/missions", color: "text-sun-600", bg: "bg-sun-100" },
  { id: "progress", label: "My Progress", icon: ChartIcon, href: "/child/champion-journey/progress", color: "text-sun-600", bg: "bg-sun-100" },
  { id: "nutrition", label: "Nutrition Coach", icon: NutritionIcon, href: "/child/champion-journey/nutrition", color: "text-sun-600", bg: "bg-sun-100" },
  { id: "sleep", label: "Sleep & Recovery", icon: SleepIcon2, href: "/child/champion-journey/sleep", color: "text-sun-600", bg: "bg-sun-100" },
  { id: "motivation", label: "Motivation", icon: FireIcon, href: "/child/champion-journey/motivation", color: "text-sun-600", bg: "bg-sun-100" },
  { id: "legends", label: "Learn From Legends", icon: LightIcon, href: "/child/champion-journey/legends", color: "text-sun-600", bg: "bg-sun-100" },
  { id: "competitions", label: "Competitions", icon: TrophyIcon, href: "/child/champion-journey/competitions", color: "text-sun-600", bg: "bg-sun-100" },
  { id: "mental", label: "Mental Coach", icon: QuoteIcon, href: "/child/champion-journey/mental", color: "text-sun-600", bg: "bg-sun-100" },
];

const MOTIVATION_QUOTES = [
  "The harder you work, the luckier you get. — Gary Player",
  "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice. — Pelé",
  "Don't practice until you get it right. Practice until you can't get it wrong.",
  "Your only limit is the one you set for yourself.",
  "Champions keep playing until they get it right.",
];

function ChampionContent() {
  const { session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const childId = session?.childId;
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);

  useEffect(() => {
    const val = localStorage.getItem("champion_onboarding_done");
    if (val === "true") setOnboardingDone(true);
    else setOnboardingDone(false);
  }, []);

  const { data: profile } = useQuery({
    queryKey: ["athleteProfile"],
    queryFn: fetchAthleteProfile,
    enabled: onboardingDone === true,
  });

  const { data: stats } = useQuery({
    queryKey: ["athleteStats"],
    queryFn: fetchAthleteStats,
    enabled: onboardingDone === true,
  });

  const { data: missions } = useQuery({
    queryKey: ["dailyMissions"],
    queryFn: fetchDailyMissions,
    enabled: onboardingDone === true,
  });

  const { data: achievements } = useQuery({
    queryKey: ["achievements"],
    queryFn: fetchAchievements,
    enabled: onboardingDone === true,
  });

  const { data: routine } = useQuery({
    queryKey: ["dailyRoutine"],
    queryFn: fetchDailyRoutine,
    enabled: onboardingDone === true,
  });

  if (onboardingDone === false) {
    router.replace("/child/champion-journey/onboarding");
    return null;
  }

  if (onboardingDone === null) {
    return (
      <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center bg-[#faf7f2] px-4">
        <div className="h-8 w-48 animate-pulse rounded-2xl bg-sand-200" />
      </div>
    );
  }

  const name = profile?.age ? "Champion" : "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const quote = MOTIVATION_QUOTES[new Date().getDate() % MOTIVATION_QUOTES.length];
  const completedMissions = missions?.filter((m) => m.completed).length ?? 0;
  const totalMissions = missions?.length ?? 0;
  const overallScore = stats?.overallScore ?? 0;
  const unlockedCount = achievements?.filter((a) => a.unlocked).length ?? 0;
  const sportLabel = profile?.primarySport ?? "athletics";

  return (
    <div className="mx-auto min-h-screen max-w-5xl bg-[#faf7f2] px-4 py-6 sm:px-8 sm:py-10">
      <GreetingHeader childName={name} subtitle={`Ready for today's ${sportLabel} training?`} className="mb-6" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column — progress and missions */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
              "relative overflow-hidden rounded-3xl border border-sun-200/40",
              "bg-gradient-to-br from-sun-50 via-white to-sun-100/30",
              "shadow-[0_12px_40px_rgba(45,42,38,0.08),0_-6px_20px_rgba(255,255,255,0.7)]",
              "px-6 py-6 sm:px-8 sm:py-8"
            )}
          >
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="font-display text-2xl italic text-sun-700 sm:text-3xl">{greeting}, Champion! 👋</p>
                <p className="mt-2 text-sm text-stone-600 sm:text-base">
                  Your personal coach is ready. Let&apos;s make today amazing!
                </p>
              </div>
              <span className="hidden text-5xl sm:block">🏆</span>
            </div>
          </motion.div>

          {/* Quick nav grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {NAV_SECTIONS.slice(0, 5).map((section, i) => {
              const Icon = section.icon;
              return (
                <motion.button
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.03 }}
                  whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(45,42,38,0.12), 0 -4px 16px rgba(255,255,255,0.8)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push(section.href)}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-white/20 bg-white/60 p-4 text-center shadow-[0_6px_20px_rgba(45,42,38,0.06),0_-3px_10px_rgba(255,255,255,0.6)] backdrop-blur-sm transition-all"
                >
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", section.bg, section.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-ink">{section.label}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Today's Missions */}
          <ClayCard className="p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg italic text-ink">Today&apos;s Missions</h2>
              <span className="rounded-full bg-sun-100 px-3 py-1 text-xs font-medium text-sun-700">
                {completedMissions}/{totalMissions}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {missions?.slice(0, 4).map((mission, i) => (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-4 py-3 shadow-[0_2px_6px_rgba(0,0,0,0.03)]",
                    mission.completed ? "border-sage-300 bg-sage-50/50" : "border-sand-200 bg-white"
                  )}
                >
                  <span className="text-xl">{mission.emoji}</span>
                  <div className="flex-1">
                    <p className={cn("text-sm font-medium", mission.completed ? "text-sage-700 line-through" : "text-ink")}>
                      {mission.title}
                    </p>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-sand-100">
                      <div
                        className="h-full rounded-full bg-sun-500 transition-all duration-500"
                        style={{ width: `${(mission.progress / mission.target) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-stone-500">
                    {mission.completed ? "✓" : `${mission.xp} XP`}
                  </span>
                </motion.div>
              ))}
            </div>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/child/champion-journey/missions")}
              className="mt-4 w-full rounded-xl border border-sun-200 bg-sun-50/50 py-2.5 text-sm font-medium text-sun-700 transition-all hover:bg-sun-100"
            >
              View All Missions
            </motion.button>
          </ClayCard>

          {/* Daily Routine Preview */}
          <ClayCard className="p-5 sm:p-6">
            <h2 className="mb-4 font-display text-lg italic text-ink">Today&apos;s Routine</h2>
            <div className="flex flex-col gap-2">
              {routine?.slice(0, 6).map((item, i) => (
                <motion.div
                  key={item.time}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  className="flex items-center gap-3 rounded-xl bg-white/50 px-4 py-2.5 shadow-[0_2px_6px_rgba(0,0,0,0.03)]"
                >
                  <span className="w-16 text-xs font-medium text-stone-500">{item.time}</span>
                  <span className="text-lg">{item.emoji}</span>
                  <span className="text-sm text-ink">{item.label}</span>
                </motion.div>
              ))}
            </div>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/child/champion-journey/routine")}
              className="mt-4 w-full rounded-xl border border-sun-200 bg-sun-50/50 py-2.5 text-sm font-medium text-sun-700 transition-all hover:bg-sun-100"
            >
              View Full Routine
            </motion.button>
          </ClayCard>
        </div>

        {/* Right column — stats and achievements */}
        <div className="flex flex-col gap-6">
          {/* Overall Score Ring */}
          <ClayCard className="flex flex-col items-center p-6">
            <div className="relative mb-3">
              <ProgressRing value={overallScore} size={140} color="#C9821C" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-sun-600">{overallScore}%</p>
                  <p className="text-[10px] text-stone-500">Overall Score</p>
                </div>
              </div>
            </div>
            <div className="grid w-full grid-cols-2 gap-2 text-center">
              <div className="rounded-xl bg-sun-50/50 px-3 py-2">
                <p className="text-sm font-bold text-sun-600">{stats?.strength ?? 0}%</p>
                <p className="text-[10px] text-stone-500">Strength</p>
              </div>
              <div className="rounded-xl bg-sun-50/50 px-3 py-2">
                <p className="text-sm font-bold text-sun-600">{stats?.speed ?? 0}%</p>
                <p className="text-[10px] text-stone-500">Speed</p>
              </div>
              <div className="rounded-xl bg-sun-50/50 px-3 py-2">
                <p className="text-sm font-bold text-sun-600">{stats?.endurance ?? 0}%</p>
                <p className="text-[10px] text-stone-500">Endurance</p>
              </div>
              <div className="rounded-xl bg-sun-50/50 px-3 py-2">
                <p className="text-sm font-bold text-sun-600">{stats?.agility ?? 0}%</p>
                <p className="text-[10px] text-stone-500">Agility</p>
              </div>
            </div>
          </ClayCard>

          {/* Motivation Quote */}
          <ClayCard className="p-5">
            <div className="flex items-start gap-3">
              <SparkleIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-sun-500" />
              <div>
                <p className="text-sm italic text-ink">&ldquo;{quote}&rdquo;</p>
                <button
                  onClick={() => router.push("/child/champion-journey/motivation")}
                  className="mt-2 text-xs font-medium text-sun-600 hover:text-sun-700"
                >
                  More motivation →
                </button>
              </div>
            </div>
          </ClayCard>

          {/* Achievements */}
          <ClayCard className="p-5">
            <h2 className="mb-3 font-display text-lg italic text-ink">Achievements</h2>
            <div className="flex flex-wrap gap-2">
              {achievements?.slice(0, 5).map((ach) => (
                <div
                  key={ach.id}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium",
                    ach.unlocked ? "bg-sun-100 text-sun-700" : "bg-sand-100 text-stone-400"
                  )}
                >
                  <span>{ach.emoji}</span>
                  <span>{ach.title}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-stone-500">{unlockedCount} of {achievements?.length ?? 0} unlocked</p>
          </ClayCard>

          {/* Talk to Coach button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -4, boxShadow: "0 20px 48px rgba(201,130,28,0.2), 0 -6px 20px rgba(255,255,255,0.8)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/child/champion-journey/coach")}
            className={cn(
              "flex items-center justify-center gap-3 rounded-2xl border border-sun-300/40 py-5",
              "bg-gradient-to-br from-sun-500 to-sun-600",
              "shadow-[0_8px_24px_rgba(45,42,38,0.12),0_-4px_12px_rgba(255,255,255,0.7)]",
              "text-white transition-all"
            )}
          >
            <CoachIcon className="h-7 w-7" />
            <span className="font-display text-xl italic">Talk to Coach</span>
          </motion.button>

          {/* Parent Insights */}
          <button
            onClick={() => router.push("/child/champion-journey/parent")}
            className="rounded-xl bg-white/60 px-5 py-3 text-center text-sm font-medium text-stone-600 shadow-[0_4px_12px_rgba(45,42,38,0.06),0_-2px_6px_rgba(255,255,255,0.5)] transition-all hover:shadow-[0_6px_16px_rgba(45,42,38,0.1),0_-2px_8px_rgba(255,255,255,0.7)]"
          >
            👨‍👩‍👧 Parent Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChampionJourneyPage() {
  return (
    <RequireRole role="child">
      <ChampionContent />
    </RequireRole>
  );
}

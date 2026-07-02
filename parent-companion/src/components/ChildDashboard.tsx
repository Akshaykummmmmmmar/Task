"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fetchChildById, fetchReminders } from "@/lib/mockApi";
import { useSession } from "@/lib/session";
import { GreetingHeader } from "@/components/child/GreetingHeader";
import { cn } from "@/lib/utils";
import { StudyIcon, GamesIcon, PassionIcon, StarIcon } from "@/components/icons";

function HealthSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 21.5C12 21.5 4 16 4 10.5 4 7 7 4.5 12 4.5c5 0 8 2.5 8 6 0 5.5-8 11-8 11z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 10.5h6M12 7.5v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ChampionIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6 3h12v3c0 3.3-2.7 6-6 6s-6-2.7-6-6V3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M6 5H4a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h2" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M18 5h2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 15v4M8 19h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 12v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function RightArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const NAV_CARDS = [
  {
    id: "study",
    label: "Study",
    icon: StudyIcon,
    href: "/child/study",
    gradient: "bg-gradient-to-br from-violet-50 to-violet-100/50",
    accent: "text-violet-600",
    iconBg: "bg-violet-100 text-violet-600",
    border: "border-violet-200/40",
    subtitle: "Learn something amazing today!",
  },
  {
    id: "health",
    label: "Health",
    icon: HealthSvg,
    href: "/child/health",
    gradient: "bg-gradient-to-br from-sky-50 to-sky-100/50",
    accent: "text-sky-600",
    iconBg: "bg-sky-100 text-sky-600",
    border: "border-sky-200/40",
    subtitle: "Stay healthy and strong!",
  },
  {
    id: "athletics",
    label: "Athletics",
    icon: GamesIcon,
    href: "/child/athletics",
    gradient: "bg-gradient-to-br from-orange-50 to-orange-100/50",
    accent: "text-orange-600",
    iconBg: "bg-orange-100 text-orange-600",
    border: "border-orange-200/40",
    subtitle: "Move your body every day!",
  },
  {
    id: "passions",
    label: "Passions",
    icon: PassionIcon,
    href: "/child/passion",
    gradient: "bg-gradient-to-br from-pink-50 to-pink-100/50",
    accent: "text-pink-600",
    iconBg: "bg-pink-100 text-pink-600",
    border: "border-pink-200/40",
    subtitle: "Explore what you love!",
  },
  {
    id: "champion",
    label: "Champion Journey",
    icon: ChampionIcon,
    href: "/child/champion-journey",
    gradient: "bg-gradient-to-br from-sun-50 to-sun-100/50",
    accent: "text-sun-600",
    iconBg: "bg-sun-100 text-sun-600",
    border: "border-sun-200/40",
    subtitle: "Your personal AI coach! ⭐",
  },
];

function DashboardContent() {
  const { session } = useSession();
  const router = useRouter();
  const childId = session?.childId!;

  const { data: child } = useQuery({
    queryKey: ["child", childId],
    queryFn: () => fetchChildById(childId),
    enabled: !!childId,
  });

  const { data: reminders } = useQuery({
    queryKey: ["reminders"],
    queryFn: fetchReminders,
  });

  const streak = useMemo(
    () => (reminders ?? []).filter((r) => r.childId === childId && r.status === "completed").length,
    [reminders, childId]
  );

  return (
    <div className="mx-auto min-h-screen max-w-5xl bg-[#faf7f2] px-4 py-6 sm:px-8 sm:py-10">
      <GreetingHeader
        childName={child?.name?.split(" ")[0]}
        subtitle="Let's make today great!"
        className="mb-8"
      />

      {/* Streak */}
      {streak > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8 flex items-center gap-2 rounded-2xl bg-sun-50 px-5 py-3 shadow-[inset_0_2px_4px_rgba(45,42,38,0.04),inset_0_1px_0_rgba(255,255,255,0.9)]"
        >
          <StarIcon className="h-5 w-5 text-sun-500" />
          <span className="text-sm font-semibold text-sun-700">{streak} tasks done! Keep it up! 🔥</span>
        </motion.div>
      )}

      {/* Navigation cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {NAV_CARDS.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.button
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              whileHover={{ y: -6, boxShadow: "0 20px 48px rgba(45,42,38,0.12), 0 -8px 24px rgba(255,255,255,0.8)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(card.href)}
              className={cn(
                "relative flex flex-col items-start gap-4 rounded-3xl border p-6 text-left sm:p-8",
                "shadow-[0_8px_24px_rgba(45,42,38,0.08),0_-4px_12px_rgba(255,255,255,0.7)]",
                "backdrop-blur-sm transition-colors",
                card.gradient,
                card.border
              )}
            >
              <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl", card.iconBg)}>
                <Icon className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <h2 className={cn("font-display text-xl italic", card.accent)}>{card.label}</h2>
                <p className="mt-1 text-sm text-stone-500">{card.subtitle}</p>
              </div>
              <div className={cn("absolute bottom-6 right-6 rounded-full p-2", card.iconBg)}>
                <RightArrow />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Bottom link to Games & Puzzles */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="mt-8 text-center"
      >
        <button
          onClick={() => router.push("/child/activities")}
          className="rounded-full bg-white/70 px-6 py-2.5 text-sm font-medium text-stone-600 shadow-[0_4px_12px_rgba(45,42,38,0.06),0_-2px_6px_rgba(255,255,255,0.5)] transition-all hover:shadow-[0_6px_16px_rgba(45,42,38,0.1),0_-2px_8px_rgba(255,255,255,0.7)] hover:-translate-y-0.5"
        >
          🎮 Play Games & Puzzles
        </button>
      </motion.div>
    </div>
  );
}

export function ChildDashboard() {
  const { session } = useSession();
  const router = useRouter();

  if (!session?.childId) {
    router.push("/login");
    return null;
  }

  return <DashboardContent />;
}

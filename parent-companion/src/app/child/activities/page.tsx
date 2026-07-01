"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session";
import { motion } from "framer-motion";
import { GamesIcon, PuzzleIcon, LogoutIcon } from "@/components/icons";
import { RequireRole } from "@/components/RequireRole";
import { ClayCard } from "@/components/child/ClayCard";
import { Sudoku } from "@/components/Sudoku";
import { Chess } from "@/components/Chess";
import { MemoryMatch } from "@/components/MemoryMatch";
import { cn } from "@/lib/utils";

function ActivitiesContent() {
  const router = useRouter();
  const { setSession } = useSession();
  const [gamesOpen, setGamesOpen] = useState(false);
  const [puzzlesOpen, setPuzzlesOpen] = useState(false);

  function handleLogout() {
    setSession(null);
    router.push("/");
  }

  return (
    <div className="mx-auto min-h-screen max-w-4xl bg-[#faf7f2] px-4 py-6 sm:px-8 sm:py-10">
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push("/child")}
            className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-stone-500 transition-colors hover:text-ink"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="font-display text-2xl italic text-ink">Activities</h1>
          <p className="text-sm text-stone-500">Games, puzzles and fun challenges</p>
        </div>
        <button
          onClick={handleLogout}
          aria-label="Log out"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 shadow-[0_4px_12px_rgba(45,42,38,0.06),0_-2px_6px_rgba(255,255,255,0.5)] transition-all hover:shadow-[0_6px_16px_rgba(45,42,38,0.1),0_-2px_8px_rgba(255,255,255,0.7)]"
        >
          <LogoutIcon className="h-4.5 w-4.5 text-stone-500" />
        </button>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-coral-100 text-coral-600 shadow-[0_4px_12px_rgba(45,42,38,0.06),0_-2px_6px_rgba(255,255,255,0.5)]">
            <GamesIcon className="h-6 w-6" />
          </span>
          <div>
            <p className="text-sm text-stone-500">Choose an activity</p>
          </div>
        </div>

        {/* Games */}
        <ClayCard className="overflow-hidden">
          <button
            onClick={() => setGamesOpen(!gamesOpen)}
            className="flex w-full items-center gap-3 p-5 text-left transition-colors hover:bg-white/40"
          >
            <GamesIcon className="h-5 w-5 flex-shrink-0 text-coral-600" />
            <h2 className="flex-1 font-display text-lg italic text-ink">Games</h2>
            <svg viewBox="0 0 24 24" fill="none" className={cn("h-5 w-5 text-stone-400 transition-transform", gamesOpen && "rotate-180")}>
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {gamesOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-5 pb-5">
              <div className="flex flex-col gap-6">
                <ClayCard className="p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <h3 className="font-display text-base italic text-ink">Sudoku</h3>
                    <span className="rounded-full bg-coral-100 px-2.5 py-0.5 text-xs font-medium text-coral-700">Game</span>
                  </div>
                  <Sudoku />
                </ClayCard>
                <ClayCard className="p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <h3 className="font-display text-base italic text-ink">Chess</h3>
                    <span className="rounded-full bg-coral-100 px-2.5 py-0.5 text-xs font-medium text-coral-700">Game</span>
                  </div>
                  <Chess />
                </ClayCard>
              </div>
            </motion.div>
          )}
        </ClayCard>

        {/* Puzzles */}
        <ClayCard className="overflow-hidden">
          <button
            onClick={() => setPuzzlesOpen(!puzzlesOpen)}
            className="flex w-full items-center gap-3 p-5 text-left transition-colors hover:bg-white/40"
          >
            <PuzzleIcon className="h-5 w-5 flex-shrink-0 text-sky-600" />
            <h2 className="flex-1 font-display text-lg italic text-ink">Puzzles</h2>
            <svg viewBox="0 0 24 24" fill="none" className={cn("h-5 w-5 text-stone-400 transition-transform", puzzlesOpen && "rotate-180")}>
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {puzzlesOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-5 pb-5">
              <ClayCard className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <h3 className="font-display text-base italic text-ink">Memory Match</h3>
                  <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-700">Puzzle</span>
                </div>
                <MemoryMatch />
              </ClayCard>
            </motion.div>
          )}
        </ClayCard>
      </div>
    </div>
  );
}

export default function ActivitiesPage() {
  return (
    <RequireRole role="child">
      <ActivitiesContent />
    </RequireRole>
  );
}

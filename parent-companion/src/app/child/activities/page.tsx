"use client";

import { useState } from "react";
import Link from "next/link";
import { ChildShell } from "@/components/ChildShell";
import { GamesIcon, PuzzleIcon } from "@/components/icons";
import { RequireRole } from "@/components/RequireRole";
import { Sudoku } from "@/components/Sudoku";
import { MemoryMatch } from "@/components/MemoryMatch";
import { cn } from "@/lib/utils";

export default function ActivitiesPage() {
  const [gamesOpen, setGamesOpen] = useState(false);
  const [puzzlesOpen, setPuzzlesOpen] = useState(false);

  return (
    <RequireRole role="child">
      <ChildShell>
        <Link
          href="/child"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 transition-colors hover:text-sky-800"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
            <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Dashboard
        </Link>

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-coral-100 text-coral-600">
              <GamesIcon className="h-6 w-6" />
            </span>
            <div>
              <h1 className="font-display text-2xl italic text-ink">Activities</h1>
              <p className="text-sm text-stone-500">Games, puzzles and fun challenges</p>
            </div>
          </div>

          <section>
            <button
              onClick={() => setGamesOpen(!gamesOpen)}
              className="focus-ring mb-4 flex w-full items-center gap-2 text-left"
            >
              <GamesIcon className="h-5 w-5 text-coral-600" />
              <h2 className="font-display text-xl italic text-ink">Games</h2>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className={cn(
                  "ml-auto h-5 w-5 text-stone-400 transition-transform",
                  gamesOpen && "rotate-180"
                )}
              >
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {gamesOpen && (
              <div className="fade-in rounded-[24px] bg-white/70 px-5 py-6 shadow-soft">
                <div className="mb-5 flex items-center gap-2">
                  <h3 className="font-display text-lg italic text-ink">Sudoku</h3>
                  <span className="rounded-full bg-coral-100 px-2.5 py-0.5 text-xs font-medium text-coral-700">
                    Game
                  </span>
                </div>
                <Sudoku />
              </div>
            )}
          </section>

          <section>
            <button
              onClick={() => setPuzzlesOpen(!puzzlesOpen)}
              className="focus-ring mb-4 flex w-full items-center gap-2 text-left"
            >
              <PuzzleIcon className="h-5 w-5 text-sky-600" />
              <h2 className="font-display text-xl italic text-ink">Puzzles</h2>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className={cn(
                  "ml-auto h-5 w-5 text-stone-400 transition-transform",
                  puzzlesOpen && "rotate-180"
                )}
              >
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {puzzlesOpen && (
              <div className="fade-in rounded-[24px] bg-white/70 px-5 py-6 shadow-soft">
                <div className="mb-5 flex items-center gap-2">
                  <h3 className="font-display text-lg italic text-ink">Memory Match</h3>
                  <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-700">
                    Puzzle
                  </span>
                </div>
                <MemoryMatch />
              </div>
            )}
          </section>
        </div>
      </ChildShell>
    </RequireRole>
  );
}

"use client";

import { useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";

type Grid = number[][];

interface Puzzle {
  puzzle: Grid;
  solution: Grid;
}

const PUZZLES: Puzzle[] = [
  {
    puzzle: [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ],
    solution: [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ],
  },
  {
    puzzle: [
      [0, 0, 0, 2, 6, 0, 7, 0, 1],
      [6, 8, 0, 0, 7, 0, 0, 9, 0],
      [1, 9, 0, 0, 0, 4, 5, 0, 0],
      [8, 2, 0, 1, 0, 0, 0, 4, 0],
      [0, 0, 4, 6, 0, 2, 9, 0, 0],
      [0, 5, 0, 0, 0, 3, 0, 2, 8],
      [0, 0, 9, 3, 0, 0, 0, 7, 4],
      [0, 4, 0, 0, 5, 0, 0, 3, 6],
      [7, 0, 3, 0, 1, 8, 0, 0, 0],
    ],
    solution: [
      [4, 3, 5, 2, 6, 9, 7, 8, 1],
      [6, 8, 2, 5, 7, 1, 4, 9, 3],
      [1, 9, 7, 8, 3, 4, 5, 6, 2],
      [8, 2, 6, 1, 9, 5, 3, 4, 7],
      [3, 7, 4, 6, 8, 2, 9, 1, 5],
      [9, 5, 1, 7, 4, 3, 6, 2, 8],
      [5, 1, 9, 3, 2, 6, 8, 7, 4],
      [2, 4, 8, 9, 5, 7, 1, 3, 6],
      [7, 6, 3, 4, 1, 8, 2, 5, 9],
    ],
  },
];

function cloneGrid(g: Grid): Grid {
  return g.map((row) => [...row]);
}

export function Sudoku() {
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [grid, setGrid] = useState<Grid>(() => cloneGrid(PUZZLES[0].puzzle));
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [mistakes, setMistakes] = useState<Set<string>>(new Set());

  const current = PUZZLES[puzzleIdx];

  const given = useMemo(() => {
    const g = new Set<string>();
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (current.puzzle[r][c] !== 0) g.add(`${r},${c}`);
      }
    }
    return g;
  }, [puzzleIdx, current]);

  const complete = useMemo(() => {
    for (let r = 0; r < 9; r++)
      for (let c = 0; c < 9; c++)
        if (grid[r][c] !== current.solution[r][c]) return false;
    return true;
  }, [grid, current]);

  function handleCellClick(r: number, c: number) {
    setSelected([r, c]);
  }

  function handleNumber(n: number) {
    if (!selected) return;
    const [r, c] = selected;
    if (given.has(`${r},${c}`)) return;

    const next = cloneGrid(grid);
    const key = `${r},${c}`;
    const newMistakes = new Set(mistakes);
    next[r][c] = n;

    if (n !== 0 && n !== current.solution[r][c]) {
      newMistakes.add(key);
    } else {
      newMistakes.delete(key);
    }

    setGrid(next);
    setMistakes(newMistakes);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    const n = parseInt(e.key);
    if (n >= 1 && n <= 9) handleNumber(n);
    if (e.key === "Backspace" || e.key === "Delete") handleNumber(0);
    if (e.key === "ArrowUp" && selected) setSelected([Math.max(0, selected[0] - 1), selected[1]]);
    if (e.key === "ArrowDown" && selected) setSelected([Math.min(8, selected[0] + 1), selected[1]]);
    if (e.key === "ArrowLeft" && selected) setSelected([selected[0], Math.max(0, selected[1] - 1)]);
    if (e.key === "ArrowRight" && selected) setSelected([selected[0], Math.min(8, selected[1] + 1)]);
  }

  const newGame = useCallback(() => {
    const nextIdx = (puzzleIdx + 1) % PUZZLES.length;
    setPuzzleIdx(nextIdx);
    setGrid(cloneGrid(PUZZLES[nextIdx].puzzle));
    setSelected(null);
    setMistakes(new Set());
  }, [puzzleIdx]);

  return (
    <div className="flex flex-col items-center gap-5" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="grid grid-cols-9 gap-px rounded-xl border-2 border-stone-400 bg-stone-400 overflow-hidden">
        {grid.map((row, r) =>
          row.map((val, c) => {
            const isGiven = given.has(`${r},${c}`);
            const isSelected = selected?.[0] === r && selected?.[1] === c;
            const sameRow = selected?.[0] === r;
            const sameCol = selected?.[1] === c;
            const inBox =
              selected &&
              Math.floor(selected[0] / 3) === Math.floor(r / 3) &&
              Math.floor(selected[1] / 3) === Math.floor(c / 3);
            const sameVal = selected && val !== 0 && grid[selected[0]]?.[selected[1]] === val;
            const hasMistake = mistakes.has(`${r},${c}`);

            const isBoxBorderRight = (c + 1) % 3 === 0 && c !== 8;
            const isBoxBorderBottom = (r + 1) % 3 === 0 && r !== 8;

            return (
              <button
                key={`${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                className={cn(
                  "flex h-9 w-9 items-center justify-center text-sm font-medium transition-colors sm:h-11 sm:w-11 sm:text-base",
                  isGiven ? "text-ink font-bold" : "text-sky-700",
                  isSelected && "bg-coral-200 ring-2 ring-coral-400 z-10",
                  !isSelected && sameRow && "bg-amber-50",
                  !isSelected && sameCol && "bg-amber-50",
                  !isSelected && inBox && !sameRow && !sameCol && "bg-amber-50/50",
                  !isSelected && !sameRow && !sameCol && !inBox && "bg-white",
                  sameVal && !isSelected && "bg-sky-100",
                  hasMistake && "text-clay-600 bg-clay-100",
                  isBoxBorderRight && "mr-px",
                  isBoxBorderBottom && "mb-px"
                )}
                aria-label={`Row ${r + 1} Column ${c + 1}, ${val === 0 ? "empty" : val}`}
              >
                {val !== 0 ? val : ""}
              </button>
            );
          })
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-1.5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button
            key={n}
            onClick={() => handleNumber(n)}
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-full border-2 border-coral-300 bg-white text-sm font-semibold text-coral-700 transition-all hover:bg-coral-100 active:scale-95"
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => handleNumber(0)}
          className="focus-ring flex h-10 w-10 items-center justify-center rounded-full border-2 border-stone-300 bg-white text-sm text-stone-500 transition-all hover:bg-stone-100 active:scale-95"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
            <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-3">
        {complete && (
          <span className="fade-in rounded-full bg-sage-100 px-4 py-1.5 text-sm font-medium text-sage-700">
            Puzzle complete!
          </span>
        )}
        <button
          onClick={newGame}
          className="focus-ring rounded-full border-2 border-coral-300 px-5 py-1.5 text-sm font-medium text-coral-700 transition-all hover:bg-coral-100"
        >
          New Puzzle
        </button>
      </div>

      <p className="text-xs text-stone-400">
        Click a cell, then tap a number. Use keyboard or the number pad.
      </p>
    </div>
  );
}

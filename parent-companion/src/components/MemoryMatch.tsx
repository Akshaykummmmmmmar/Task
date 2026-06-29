"use client";

import { useState, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";

const EMOJIS = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildCards() {
  const pairs = shuffle(EMOJIS).slice(0, 8);
  return shuffle([...pairs, ...pairs]).map((emoji, i) => ({
    id: i,
    emoji,
    flipped: false,
    matched: false,
  }));
}

export function MemoryMatch() {
  const [cards, setCards] = useState(buildCards);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);
  const [moves, setMoves] = useState(0);

  const complete = useMemo(() => cards.every((c) => c.matched), [cards]);

  function handleFlip(id: number) {
    if (locked || complete) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;

    const next = cards.map((c) => (c.id === id ? { ...c, flipped: true } : c));
    setCards(next);

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setLocked(true);
      setMoves((m) => m + 1);
      const [a, b] = newFlipped.map((i) => next.find((c) => c.id === i)!);
      if (a.emoji === b.emoji) {
        setTimeout(() => {
          setCards((prev) => prev.map((c) => (c.id === a.id || c.id === b.id ? { ...c, matched: true } : c)));
          setFlipped([]);
          setLocked(false);
        }, 400);
      } else {
        setTimeout(() => {
          setCards((prev) => prev.map((c) => (newFlipped.includes(c.id) ? { ...c, flipped: false } : c)));
          setFlipped([]);
          setLocked(false);
        }, 800);
      }
    }
  }

  const newGame = useCallback(() => {
    setCards(buildCards());
    setFlipped([]);
    setLocked(false);
    setMoves(0);
  }, []);

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleFlip(card.id)}
            disabled={card.flipped || card.matched || locked || complete}
            className={cn(
              "focus-ring flex h-16 w-16 items-center justify-center rounded-xl border-2 text-2xl transition-all duration-300 sm:h-20 sm:w-20 sm:text-3xl",
              card.flipped || card.matched
                ? "border-sky-300 bg-white shadow-soft"
                : "border-coral-200 bg-coral-100 hover:bg-coral-200",
              card.matched && "border-sage-400 bg-sage-50 opacity-80"
            )}
            aria-label={card.flipped || card.matched ? `Card ${card.emoji}` : "Hidden card"}
          >
            {(card.flipped || card.matched) ? card.emoji : "?"}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4 text-sm text-stone-500">
        <span>Moves: {moves}</span>
      </div>

      <div className="flex items-center gap-3">
        {complete && (
          <span className="fade-in rounded-full bg-sage-100 px-4 py-1.5 text-sm font-medium text-sage-700">
            All matched in {moves} moves!
          </span>
        )}
        <button
          onClick={newGame}
          className="focus-ring rounded-full border-2 border-coral-300 px-5 py-1.5 text-sm font-medium text-coral-700 transition-all hover:bg-coral-100"
        >
          New Game
        </button>
      </div>
    </div>
  );
}

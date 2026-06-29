"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LinkChildPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [linking, setLinking] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.trim().length < 4) {
      setError("Enter the child code from your GenExcel app.");
      return;
    }
    setError(null);
    setLinking(true);
    // Frontend-only demo: simulates the link, then routes to the dashboard.
    setTimeout(() => router.push("/dashboard"), 600);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl italic text-ink">
            Link your child&apos;s profile
          </h1>
          <p className="mt-1.5 text-sm text-stone-500">
            Find the child code inside the GenExcel app, under your child&apos;s
            profile settings.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-card border border-sand-300 bg-white/70 p-6 shadow-soft"
        >
          <label htmlFor="code" className="mb-1.5 block text-xs font-medium text-stone-500">
            Child code
          </label>
          <input
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="GX-8841"
            className="focus-ring w-full rounded-lg border border-sand-300 bg-white px-3.5 py-2.5 text-sm uppercase tracking-wide text-ink outline-none placeholder:text-stone-400 placeholder:tracking-normal placeholder:normal-case"
          />
          {error && <p className="mt-2 text-xs text-clay-600">{error}</p>}

          <button
            type="submit"
            disabled={linking}
            className="focus-ring mt-5 w-full rounded-full bg-sage-500 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-sage-600 disabled:opacity-60"
          >
            {linking ? "Linking…" : "Link child"}
          </button>
        </form>
      </div>
    </div>
  );
}

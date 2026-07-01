"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/session";
import { loginChild, loginParent } from "@/lib/mockApi";

type Mode = "parent" | "child";

export default function LoginPage() {
  const router = useRouter();
  const { session, ready, setSession } = useSession();
  const [mode, setMode] = useState<Mode>("parent");

  const [email, setEmail] = useState("asha.varma@example.com");
  const [password, setPassword] = useState("");

  const [childName, setChildName] = useState("Riya");
  const [pin, setPin] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!ready || !session) return;
    router.replace(session.role === "parent" ? "/dashboard" : "/child");
  }, [ready, session, router]);

  async function handleParentSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await loginParent(email, password);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSession({ role: "parent", parentId: result.parentId });
    router.push("/dashboard");
  }

  async function handleChildSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await loginChild(childName, pin);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSession({ role: "child", childId: result.childId });
    router.push("/child");
  }

  return (
    <div className="flex min-h-screen bg-paper">
      <div className="relative hidden w-[42%] flex-col justify-between overflow-hidden bg-sage-700 px-12 py-12 text-paper lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 60% 70%, white 1px, transparent 1px)",
            backgroundSize: "44px 44px, 64px 64px",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper font-display text-base italic text-sage-700">
            P
          </span>
          <span className="font-display text-lg italic">Parent Companion</span>
        </div>

        <div className="relative z-10 max-w-sm">
          <p className="font-display text-[34px] italic leading-[1.2] text-paper">
            A calm place to watch over the things that matter.
          </p>
          <p className="mt-5 text-[15px] leading-relaxed text-sage-50/80">
            Meals, supplements, appointments, and study — one quiet view for
            parents, one simple list for kids. Built on top of GenExcel.
          </p>
        </div>

        <p className="relative z-10 text-xs text-sage-50/60">
          GenExcel ecosystem · intern preview build
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-7 flex gap-1 rounded-full border border-sand-300 bg-white/70 p-1 shadow-clay-inset">
            <button
              type="button"
              onClick={() => {
                setMode("parent");
                setError(null);
              }}
              className={cn(
                "focus-ring flex-1 rounded-full py-2 text-sm font-medium transition-colors",
                mode === "parent"
                  ? "bg-sage-500 text-paper shadow-clay-btn"
                  : "text-stone-500 hover:text-ink"
            )}
          >
            I&apos;m a parent
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("child");
              setError(null);
            }}
            className={cn(
              "focus-ring flex-1 rounded-full py-2 text-sm font-medium transition-all",
              mode === "child"
                ? "bg-clay-500 text-paper shadow-clay-btn"
                : "text-stone-500 hover:text-ink"
            )}
            >
              I&apos;m a kid
            </button>
          </div>

          {mode === "parent" ? (
            <>
              <div className="mb-6">
                <h1 className="font-display text-2xl italic text-ink">
                  Welcome back
                </h1>
                <p className="mt-1.5 text-sm text-stone-500">
                  Sign in to check in on Riya&apos;s day.
                </p>
              </div>

              <form
                onSubmit={handleParentSubmit}
                className="rounded-card border border-sand-300 bg-white/70 p-6 shadow-clay"
              >
                <div className="mb-4">
                  <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-stone-500">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="focus-ring w-full rounded-lg border border-sand-300 bg-white px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-stone-400"
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-stone-500">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="focus-ring w-full rounded-lg border border-sand-300 bg-white px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-stone-400"
                  />
                </div>

                {error && (
                  <p className="mt-2 text-xs text-clay-600" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="focus-ring mt-5 w-full rounded-full bg-sage-500 py-2.5 text-sm font-medium text-paper shadow-clay-btn transition-all hover:bg-sage-600 hover:shadow-clay-lg active:shadow-clay-inset disabled:opacity-60"
                >
                  {submitting ? "Signing in…" : "Log in"}
                </button>
              </form>

              <p className="mt-5 text-center text-xs text-stone-400">
                Demo build — any email and password will work.
              </p>
            </>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="font-display text-2xl italic text-ink">
                  Hey there!
                </h1>
                <p className="mt-1.5 text-sm text-stone-500">
                  Type your name and your secret PIN to see your tasks.
                </p>
              </div>

              <form
                onSubmit={handleChildSubmit}
                className="rounded-card border border-sand-300 bg-white/70 p-6 shadow-clay"
              >
                <div className="mb-4">
                  <label htmlFor="childName" className="mb-1.5 block text-xs font-medium text-stone-500">
                    Your name
                  </label>
                  <input
                    id="childName"
                    required
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="Riya"
                    className="focus-ring w-full rounded-lg border border-sand-300 bg-white px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-stone-400"
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="pin" className="mb-1.5 block text-xs font-medium text-stone-500">
                    4-digit PIN
                  </label>
                  <input
                    id="pin"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                    required
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                    placeholder="••••"
                    className="focus-ring w-full rounded-lg border border-sand-300 bg-white px-3.5 py-2.5 text-center text-lg tracking-[0.5em] text-ink outline-none placeholder:text-stone-400"
                  />
                </div>

                {error && (
                  <p className="mt-2 text-xs text-clay-600" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="focus-ring mt-5 w-full rounded-full bg-clay-500 py-2.5 text-sm font-medium text-paper shadow-clay-btn transition-all hover:bg-clay-600 hover:shadow-clay-lg active:shadow-clay-inset disabled:opacity-60"
                >
                  {submitting ? "Checking…" : "Let's go"}
                </button>
              </form>

              <p className="mt-5 text-center text-xs text-stone-400">
                Demo build — try Riya with PIN 1234.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

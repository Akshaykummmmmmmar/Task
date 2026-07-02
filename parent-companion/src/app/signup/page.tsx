"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Frontend-only demo: no real account creation, just routes to the dashboard.
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-sage-500 font-display text-lg italic text-paper">
            P
          </span>
          <h1 className="font-display text-2xl italic text-ink">
            Create your account
          </h1>
          <p className="mt-1.5 text-sm text-stone-500">
            Set up your Parent Companion in a minute.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-card border border-sand-300 bg-white/70 p-6 shadow-clay"
        >
          <div className="mb-4">
            <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-stone-500">
              Your name
            </label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Asha Varma"
              className="focus-ring w-full rounded-lg border border-sand-300 bg-white px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-stone-400"
            />
          </div>
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
          <div className="mb-6">
            <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-stone-500">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="focus-ring w-full rounded-lg border border-sand-300 bg-white px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-stone-400"
            />
          </div>
          <button
            type="submit"
            className="focus-ring w-full rounded-full bg-sage-500 py-2.5 text-sm font-medium text-paper shadow-clay-btn transition-all hover:bg-sage-600 hover:shadow-clay-lg active:shadow-clay-inset"
          >
            Create account
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-stone-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-sage-700 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

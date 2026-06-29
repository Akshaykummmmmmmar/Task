"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "@/lib/session";

export default function Home() {
  const { session, ready } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (session?.role === "parent") router.replace("/dashboard");
    else if (session?.role === "child") router.replace("/child");
    else router.replace("/login");
  }, [ready, session, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper">
      <div className="flex items-center gap-2.5 text-stone-400">
        <span className="h-2 w-2 animate-pulse rounded-full bg-sage-500" />
        <span className="text-sm">Loading Parent Companion…</span>
      </div>
    </div>
  );
}

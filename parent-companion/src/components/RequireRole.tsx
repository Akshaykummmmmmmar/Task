"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "@/lib/session";
import { Role } from "@/types";

export function RequireRole({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const { session, ready } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!session || session.role !== role) {
      router.replace("/login");
    }
  }, [ready, session, role, router]);

  if (!ready || !session || session.role !== role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <p className="text-sm text-stone-400">Loading…</p>
      </div>
    );
  }

  return <>{children}</>;
}

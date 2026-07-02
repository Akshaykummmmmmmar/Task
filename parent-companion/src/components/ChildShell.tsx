"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session";
import { Child } from "@/types";
import { LogoutIcon, StarIcon } from "./icons";

export function ChildShell({
  child,
  streak,
  children,
}: {
  child?: Child;
  streak?: number;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { setSession } = useSession();

  function handleLogout() {
    setSession(null);
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-sky-50">
      <div className="mx-auto max-w-3xl px-5 py-6 md:px-8 md:py-10">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sun-300 font-display text-xl italic text-ink shadow-soft">
              {child?.avatarInitials ?? "?"}
            </span>
            <div>
              <p className="font-display text-2xl italic text-ink">
                Hi {child?.name ?? "there"}!
              </p>
              <p className="text-sm text-sky-700">Let&apos;s see what&apos;s on today.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {typeof streak === "number" && streak > 0 && (
              <div className="flex items-center gap-1.5 rounded-full bg-sun-100 px-3.5 py-2 text-sun-600">
                <StarIcon className="h-4 w-4" />
                <span className="text-sm font-medium">{streak}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              aria-label="Log out"
              className="focus-ring flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-sky-700 shadow-clay-btn transition-all hover:bg-white hover:shadow-clay-lg"
            >
              <LogoutIcon className="h-4.5 w-4.5" />
            </button>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}

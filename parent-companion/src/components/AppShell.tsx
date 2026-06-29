"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/session";
import { fetchParent } from "@/lib/mockApi";
import {
  DashboardIcon,
  RemindersIcon,
  SettingsIcon,
  AssignIcon,
  LogoutIcon,
} from "./icons";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/reminders", label: "Reminders", icon: RemindersIcon },
  { href: "/assign", label: "Assign study", icon: AssignIcon },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { setSession } = useSession();
  const { data: parent } = useQuery({ queryKey: ["parent"], queryFn: fetchParent });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  function handleLogout() {
    setSession(null);
    router.push("/login");
  }

  const initials = parent?.name
    ? parent.name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "P";

  return (
    <div className="min-h-screen bg-paper">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-sand-300/70 bg-paper/95 px-5 py-3.5 backdrop-blur-sm md:hidden">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sage-500 font-display text-xs italic text-paper">
            P
          </span>
          <span className="font-display text-base italic text-ink">
            Parent Companion
          </span>
        </div>
        <button
          onClick={() => setMobileNavOpen((v) => !v)}
          aria-label="Toggle navigation"
          className="focus-ring flex h-9 w-9 items-center justify-center rounded-full text-stone-500 hover:bg-sand-100"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      {mobileNavOpen && (
        <nav className="border-b border-sand-300/70 bg-white/80 px-5 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={cn(
                    "focus-ring flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-sage-50 font-medium text-sage-700"
                      : "text-stone-500 hover:bg-sand-100 hover:text-ink"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="focus-ring flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-left text-sm text-stone-500 transition-colors hover:bg-clay-50 hover:text-clay-700"
            >
              <LogoutIcon className="h-4 w-4 flex-shrink-0" />
              Log out
            </button>
          </div>
        </nav>
      )}

      <div className="mx-auto flex max-w-6xl">
        <aside className="sticky top-0 hidden h-screen w-64 flex-shrink-0 flex-col justify-between border-r border-sand-300/70 bg-white/40 px-6 py-8 md:flex">
          <div>
            <div className="mb-10 flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-500 font-display text-sm italic text-paper">
                P
              </span>
              <span className="font-display text-lg italic text-ink">
                Parent Companion
              </span>
            </div>
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "focus-ring relative flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm transition-colors",
                      active
                        ? "bg-sage-50 font-medium text-sage-700"
                        : "text-stone-500 hover:bg-sand-100 hover:text-ink"
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-sage-600" />
                    )}
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5 rounded-2xl border border-sand-300 bg-white/70 px-3.5 py-3">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-sage-100 text-xs font-medium text-sage-700">
                {initials}
              </span>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-sm font-medium text-ink">
                  {parent?.name ?? "Parent"}
                </p>
                <p className="truncate text-xs text-stone-400">{parent?.email}</p>
              </div>
            </div>
            <div className="rounded-2xl bg-sand-100 px-4 py-3.5">
              <p className="text-xs leading-relaxed text-stone-500">
                Linked to GenExcel as a{" "}
                <span className="font-medium text-ink">mock data</span> preview.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="focus-ring flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm text-stone-500 transition-colors hover:bg-clay-50 hover:text-clay-700"
            >
              <LogoutIcon className="h-4 w-4 flex-shrink-0" />
              Log out
            </button>
          </div>
        </aside>

        <main className="min-h-screen flex-1 px-5 py-7 md:px-10 md:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}

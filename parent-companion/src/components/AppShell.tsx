"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/session";
import { fetchParent } from "@/lib/mockApi";
import { AIAssistant } from "./AIAssistant";
import {
  DashboardIcon,
  RemindersIcon,
  SettingsIcon,
  AssignIcon,
  LogoutIcon,
  MedicineIcon,
  AddChildIcon,
  CloseIcon,
  TrashIcon,
  SparkleIcon,
  ProfileIcon,
  StarIcon,
} from "./icons";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
      { href: "/performance", label: "Performance", icon: StarIcon },
    ],
  },
  {
    label: "Schedule",
    items: [
      { href: "/reminders", label: "Reminders", icon: RemindersIcon },
      { href: "/medicine", label: "Medicine", icon: MedicineIcon },
      { href: "/assign", label: "Assign Study", icon: AssignIcon },
    ],
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { setSession } = useSession();
  const { data: parent } = useQuery({ queryKey: ["parent"], queryFn: fetchParent });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [childrenModalOpen, setChildrenModalOpen] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);

  interface ChildEntry {
    id: string;
    name: string;
    username: string;
    password: string;
    age: string;
    grade: string;
    notes: string;
  }

  const [childrenList, setChildrenList] = useState<ChildEntry[]>([
    { id: "1", name: "Riya", username: "riya_kid", password: "••••", age: "9", grade: "4th", notes: "Default child" },
  ]);

  const emptyChild: Omit<ChildEntry, "id"> = { name: "", username: "", password: "", age: "", grade: "", notes: "" };
  const [newChild, setNewChild] = useState(emptyChild);

  function handleAddChild() {
    if (!newChild.name.trim() || !newChild.username.trim()) return;
    setChildrenList((prev) => [
      ...prev,
      { ...newChild, id: Date.now().toString() },
    ]);
    setNewChild(emptyChild);
  }

  function handleRemoveChild(id: string) {
    setChildrenList((prev) => prev.filter((c) => c.id !== id));
  }

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

  function NavItems({ mobileClose }: { mobileClose?: () => void }) {
    const linkClass = (active: boolean) =>
      cn(
        "focus-ring flex items-center gap-2.5 rounded-lg px-3.5 py-2 text-sm transition-colors",
        active
          ? "bg-sage-50 font-medium text-sage-700 dark:bg-sage-500/20 dark:text-sage-300"
          : "text-stone-500 hover:bg-sand-100 hover:text-ink dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-ink"
      );

    const iconClass = "h-4 w-4 flex-shrink-0";

    return (
      <>
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-2">
            <p className="mb-1 px-3.5 text-[11px] font-semibold uppercase tracking-widest text-stone-400">
              {group.label}
            </p>
            {group.items.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={mobileClose}
                  className={cn(linkClass(active), "relative")}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-sage-600" />
                  )}
                  <Icon className={iconClass} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-paper overscroll-none">
      {/* Mobile top bar */}
      <div className="z-30 flex flex-shrink-0 items-center justify-between border-b border-sand-300/70 bg-paper/95 px-5 py-3.5 backdrop-blur-sm md:hidden">
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
          className="focus-ring flex h-9 w-9 items-center justify-center rounded-full text-stone-500 hover:bg-sand-100 dark:text-stone-400 dark:hover:bg-white/10"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Mobile nav */}
      {mobileNavOpen && (
        <nav className="flex-shrink-0 border-b border-sand-300/70 bg-white/80 px-5 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            <NavItems mobileClose={() => setMobileNavOpen(false)} />
            <button
              onClick={() => { setAiPanelOpen(true); setMobileNavOpen(false); }}
              className="focus-ring mt-1 flex items-center gap-2.5 rounded-lg bg-gradient-to-r from-sage-500 to-sage-600 px-3.5 py-2.5 text-sm font-medium text-white transition-colors hover:from-sage-600 hover:to-sage-700"
            >
              <SparkleIcon className="h-4 w-4 flex-shrink-0" />
              AI Co-pilot
            </button>
            <button
              onClick={() => { setChildrenModalOpen(true); setMobileNavOpen(false); }}
              className="focus-ring flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm text-stone-500 transition-colors hover:bg-sand-100 hover:text-ink dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-ink"
            >
              <AddChildIcon className="h-4 w-4 flex-shrink-0" />
              Manage Children
            </button>
            <Link
              href="/profile"
              onClick={() => setMobileNavOpen(false)}
              className="focus-ring flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm text-stone-500 transition-colors hover:bg-sand-100 hover:text-ink dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-ink"
            >
              <ProfileIcon className="h-4 w-4 flex-shrink-0" />
              Profile
            </Link>
            <Link
              href="/settings"
              onClick={() => setMobileNavOpen(false)}
              className="focus-ring flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm text-stone-500 transition-colors hover:bg-sand-100 hover:text-ink dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-ink"
            >
              <SettingsIcon className="h-4 w-4 flex-shrink-0" />
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="focus-ring flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-left text-sm text-stone-500 transition-colors hover:bg-clay-50 hover:text-clay-700 dark:text-stone-400 dark:hover:bg-clay-500/15 dark:hover:text-clay-400"
            >
              <LogoutIcon className="h-4 w-4 flex-shrink-0" />
              Log out
            </button>
          </div>
        </nav>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden w-64 flex-shrink-0 flex-col justify-between overflow-y-auto overscroll-none border-r border-sand-300/70 bg-white/40 px-5 py-6 md:flex">
          <div>
            <div className="mb-8 flex items-center gap-2.5 px-1.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-500 font-display text-sm italic text-paper">
                P
              </span>
              <span className="font-display text-lg italic text-ink">
                Parent Companion
              </span>
            </div>

            <NavItems />

            {/* AI Co-pilot — special styled button */}
            <button
              onClick={() => setAiPanelOpen(true)}
              className="focus-ring mt-3 flex w-full items-center gap-2.5 rounded-xl bg-gradient-to-r from-sage-500 to-sage-600 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:from-sage-600 hover:to-sage-700 hover:shadow"
            >
              <SparkleIcon className="h-4 w-4 flex-shrink-0" />
              AI Co-pilot
            </button>

            {/* Separator */}
            <div className="my-4 border-t border-sand-300/60" />

            {/* Secondary actions */}
            <button
              onClick={() => setChildrenModalOpen(true)}
              className="focus-ring flex w-full items-center gap-2.5 rounded-lg px-3.5 py-2 text-sm text-stone-500 transition-colors hover:bg-sand-100 hover:text-ink dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-ink"
            >
              <AddChildIcon className="h-4 w-4 flex-shrink-0" />
              Manage Children
            </button>
            <Link
              href="/profile"
              className={cn(
                "focus-ring flex w-full items-center gap-2.5 rounded-lg px-3.5 py-2 text-sm transition-colors",
                pathname === "/profile"
                  ? "bg-sage-50 font-medium text-sage-700 dark:bg-sage-500/20 dark:text-sage-300"
                  : "text-stone-500 hover:bg-sand-100 hover:text-ink dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-ink"
              )}
            >
              <ProfileIcon className="h-4 w-4 flex-shrink-0" />
              Profile
            </Link>
            <Link
              href="/settings"
              className={cn(
                "focus-ring flex w-full items-center gap-2.5 rounded-lg px-3.5 py-2 text-sm transition-colors",
                pathname === "/settings"
                  ? "bg-sage-50 font-medium text-sage-700 dark:bg-sage-500/20 dark:text-sage-300"
                  : "text-stone-500 hover:bg-sand-100 hover:text-ink dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-ink"
              )}
            >
              <SettingsIcon className="h-4 w-4 flex-shrink-0" />
              Settings
            </Link>
          </div>

          {/* Bottom: user profile + logout */}
          <div className="flex flex-col gap-2 pt-4">
            <div className="flex items-center gap-2.5 rounded-2xl border border-sand-300 bg-white/70 px-3.5 py-3">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-sage-100 text-xs font-medium text-sage-700">
                {initials}
              </span>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-sm font-medium text-ink">{parent?.name ?? "Parent"}</p>
                <p className="truncate text-xs text-stone-400">{parent?.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-sand-100 px-4 py-2.5 dark:bg-white/10">
              <p className="text-xs text-stone-500">
                <span className="font-medium text-ink">Mock</span> preview
              </p>
              <button
                onClick={handleLogout}
                className="focus-ring flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs text-stone-500 transition-colors hover:bg-clay-50 hover:text-clay-700 dark:text-stone-400 dark:hover:bg-clay-500/15 dark:hover:text-clay-400"
              >
                <LogoutIcon className="h-3.5 w-3.5" />
                Log out
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto overscroll-none px-5 py-7 md:px-10 md:py-10">
          {children}
        </main>
      </div>

      {/* Manage Children Modal */}
      {childrenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/20 backdrop-blur-sm pt-10 md:pt-20">
          <div className="mx-4 w-full max-w-2xl rounded-2xl border border-sand-300 bg-paper shadow-2xl">
            <div className="flex items-center justify-between border-b border-sand-300/70 px-6 py-4">
              <div>
                <h2 className="font-display text-xl italic text-ink">Manage Children</h2>
                <p className="mt-0.5 text-sm text-stone-500">Add or remove children linked to your account.</p>
              </div>
              <button
                onClick={() => setChildrenModalOpen(false)}
                className="focus-ring flex h-9 w-9 items-center justify-center rounded-full text-stone-500 hover:bg-sand-100"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-6 max-h-[70vh]">
              {/* Existing children */}
              <div className="mb-8">
                <h3 className="mb-3 font-display text-base italic text-ink">Your Children</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {childrenList.map((c) => (
                    <div key={c.id} className="group flex items-start justify-between rounded-xl border border-sand-300 bg-white/70 p-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-100 font-display text-sm italic text-sage-700">
                          {c.name.charAt(0).toUpperCase()}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-ink">{c.name}</p>
                          <p className="text-xs text-stone-400">@{c.username}</p>
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            {c.age && <span className="rounded-full bg-sand-100 px-2 py-0.5 text-xs text-stone-500">Age {c.age}</span>}
                            {c.grade && <span className="rounded-full bg-sand-100 px-2 py-0.5 text-xs text-stone-500">Grade {c.grade}</span>}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveChild(c.id)}
                        className="rounded-lg p-1.5 text-stone-400 opacity-0 transition-all hover:bg-clay-50 hover:text-clay-600 group-hover:opacity-100"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add child form */}
              <div className="rounded-xl border border-sage-200 bg-white/70 p-5">
                <h3 className="mb-4 font-display text-base italic text-ink">Add a New Child</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-stone-500">Child Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Arjun"
                      value={newChild.name}
                      onChange={(e) => setNewChild((p) => ({ ...p, name: e.target.value }))}
                      className="w-full rounded-lg border border-sand-300 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-stone-400 focus:border-sage-400 focus:outline-none focus:ring-1 focus:ring-sage-200 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-stone-500">Username *</label>
                    <input
                      type="text"
                      placeholder="e.g. arjun_kid"
                      value={newChild.username}
                      onChange={(e) => setNewChild((p) => ({ ...p, username: e.target.value }))}
                      className="w-full rounded-lg border border-sand-300 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-stone-400 focus:border-sage-400 focus:outline-none focus:ring-1 focus:ring-sage-200 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-stone-500">Password</label>
                    <input
                      type="password"
                      placeholder="Set a password"
                      value={newChild.password}
                      onChange={(e) => setNewChild((p) => ({ ...p, password: e.target.value }))}
                      className="w-full rounded-lg border border-sand-300 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-stone-400 focus:border-sage-400 focus:outline-none focus:ring-1 focus:ring-sage-200 transition-colors"
                    />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="mb-1 block text-xs font-medium text-stone-500">Age</label>
                      <input
                        type="number"
                        placeholder="e.g. 8"
                        value={newChild.age}
                        onChange={(e) => setNewChild((p) => ({ ...p, age: e.target.value }))}
                        className="w-full rounded-lg border border-sand-300 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-stone-400 focus:border-sage-400 focus:outline-none focus:ring-1 focus:ring-sage-200 transition-colors"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="mb-1 block text-xs font-medium text-stone-500">Grade</label>
                      <input
                        type="text"
                        placeholder="e.g. 3rd"
                        value={newChild.grade}
                        onChange={(e) => setNewChild((p) => ({ ...p, grade: e.target.value }))}
                        className="w-full rounded-lg border border-sand-300 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-stone-400 focus:border-sage-400 focus:outline-none focus:ring-1 focus:ring-sage-200 transition-colors"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <label className="mb-1 block text-xs font-medium text-stone-500">Notes (optional)</label>
                  <textarea
                    placeholder="Any additional details about the child..."
                    value={newChild.notes}
                    onChange={(e) => setNewChild((p) => ({ ...p, notes: e.target.value }))}
                    rows={2}
                    className="w-full rounded-lg border border-sand-300 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-stone-400 focus:border-sage-400 focus:outline-none focus:ring-1 focus:ring-sage-200 transition-colors resize-none"
                  />
                </div>
                <button
                  onClick={handleAddChild}
                  disabled={!newChild.name.trim() || !newChild.username.trim()}
                  className="focus-ring mt-4 flex items-center gap-2 rounded-lg bg-sage-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sage-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <AddChildIcon className="h-4 w-4" />
                  Add Child
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AIAssistant open={aiPanelOpen} onClose={() => setAiPanelOpen(false)} />
    </div>
  );
}

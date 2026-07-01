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
  MedicineIcon,
  AddChildIcon,
  CloseIcon,
  TrashIcon,
} from "./icons";


const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/medicine", label: "Medicine", icon: MedicineIcon },
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
  const [addChildOpen, setAddChildOpen] = useState(false);

  // Child management state
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
          className="focus-ring flex h-9 w-9 items-center justify-center rounded-full text-stone-500 shadow-clay-btn hover:bg-sand-100"
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
        <nav className="flex-shrink-0 border-b border-sand-300/70 bg-white/80 px-5 py-3 md:hidden">
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
                    "focus-ring flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm transition-all",
                    active
                      ? "bg-sage-50 font-medium text-sage-700 shadow-clay-inset"
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
              className="focus-ring flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-left text-sm text-stone-500 transition-all hover:bg-clay-50 hover:text-clay-700 hover:shadow-clay-btn"
            >
              <LogoutIcon className="h-4 w-4 flex-shrink-0" />
              Log out
            </button>
          </div>
        </nav>
      )}

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-64 flex-shrink-0 flex-col justify-between overflow-y-auto overscroll-none border-r border-sand-300/70 bg-white/40 px-6 py-8 md:flex">
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
                    "focus-ring relative flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm transition-all",
                    active
                      ? "bg-sage-50 font-medium text-sage-700 shadow-clay-inset"
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

            {/* Manage Children button */}
            <button
              onClick={() => setAddChildOpen((v) => !v)}
              className={cn(
                "focus-ring mt-4 flex w-full items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm transition-all",
                addChildOpen
                  ? "bg-sage-50 font-medium text-sage-700 shadow-clay-inset"
                  : "text-stone-500 hover:bg-sand-100 hover:text-ink"
              )}
            >
              <AddChildIcon className="h-4 w-4 flex-shrink-0" />
              Manage Children
            </button>
          </div>



          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5 rounded-2xl border border-sand-300 bg-white/70 px-3.5 py-3 shadow-clay">
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
            <div className="rounded-2xl bg-sand-100 px-4 py-3.5 shadow-clay-inset">
              <p className="text-xs leading-relaxed text-stone-500">
                Linked to GenExcel as a{" "}
                <span className="font-medium text-ink">mock data</span> preview.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="focus-ring flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm text-stone-500 transition-all hover:bg-clay-50 hover:text-clay-700 hover:shadow-clay-btn"
            >
              <LogoutIcon className="h-4 w-4 flex-shrink-0" />
              Log out
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto overscroll-none px-5 py-7 md:px-10 md:py-10">
          {addChildOpen ? (
            <div className="mx-auto max-w-3xl">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="font-display text-2xl italic text-ink">Manage Children</h1>
                  <p className="mt-1 text-sm text-stone-500">Add or remove children linked to your account.</p>
                </div>
                <button
                  onClick={() => setAddChildOpen(false)}
                  className="focus-ring flex items-center gap-2 rounded-lg border border-sand-300 bg-white/70 px-4 py-2 text-sm text-stone-500 shadow-clay-btn transition-all hover:bg-sand-100 hover:text-ink hover:shadow-clay-lg"
                >
                  <CloseIcon className="h-4 w-4" />
                  Close
                </button>
              </div>

              {/* Existing children */}
              <div className="mb-8">
                <h2 className="mb-4 font-display text-lg italic text-ink">Your Children</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {childrenList.map((c) => (
                    <div key={c.id} className="group rounded-card border border-sand-300 bg-white/70 p-5 shadow-clay transition-all duration-200 hover:-translate-y-0.5 hover:shadow-clay-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-100 font-display text-sm italic text-sage-700">
                            {c.name.charAt(0).toUpperCase()}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-ink">{c.name}</p>
                            <p className="text-xs text-stone-400">@{c.username}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveChild(c.id)}
                          className="rounded-lg p-1.5 text-stone-400 opacity-0 transition-all hover:bg-clay-50 hover:text-clay-600 group-hover:opacity-100"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {c.age && <span className="rounded-full bg-sand-100 px-2.5 py-0.5 text-xs text-stone-500">Age {c.age}</span>}
                        {c.grade && <span className="rounded-full bg-sand-100 px-2.5 py-0.5 text-xs text-stone-500">Grade {c.grade}</span>}
                      </div>
                      {c.notes && <p className="mt-2 text-xs text-stone-400">{c.notes}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Add new child form */}
              <div className="rounded-card border border-sage-200 bg-white/70 p-6 shadow-clay">
                <h2 className="mb-5 font-display text-lg italic text-ink">Add a New Child</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                <div className="mt-4">
                  <label className="mb-1 block text-xs font-medium text-stone-500">Notes (optional)</label>
                  <textarea
                    placeholder="Any additional details about the child..."
                    value={newChild.notes}
                    onChange={(e) => setNewChild((p) => ({ ...p, notes: e.target.value }))}
                    rows={3}
                    className="w-full rounded-lg border border-sand-300 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-stone-400 focus:border-sage-400 focus:outline-none focus:ring-1 focus:ring-sage-200 transition-colors resize-none"
                  />
                </div>
                <button
                  onClick={handleAddChild}
                  disabled={!newChild.name.trim() || !newChild.username.trim()}
                  className="focus-ring mt-5 flex items-center gap-2 rounded-lg bg-sage-500 px-5 py-2.5 text-sm font-medium text-white shadow-clay-btn transition-all hover:bg-sage-600 hover:shadow-clay-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <AddChildIcon className="h-4 w-4" />
                  Add Child
                </button>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}

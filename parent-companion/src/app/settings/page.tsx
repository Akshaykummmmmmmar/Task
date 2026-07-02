"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { RequireRole } from "@/components/RequireRole";
import { useTheme } from "@/lib/theme";
import { fetchChildren, fetchParent } from "@/lib/mockApi";
import { cn } from "@/lib/utils";

function SettingsContent() {
  const { data: parent } = useQuery({ queryKey: ["parent"], queryFn: fetchParent });
  const { data: children } = useQuery({ queryKey: ["children"], queryFn: fetchChildren });
  const child = children?.[0];

  const { theme, toggleTheme } = useTheme();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [appNotifs, setAppNotifs] = useState(true);
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function ToggleSwitch({
    checked,
    onChange,
    id,
  }: {
    checked: boolean;
    onChange: (v: boolean) => void;
    id: string;
  }) {
    return (
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:ring-offset-2",
          checked ? "bg-sage-500" : "bg-sand-300"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="font-display text-2xl italic text-ink">Settings</h1>
          <p className="mt-1 text-sm text-stone-500">Customise your experience.</p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Appearance */}
          <div className="rounded-2xl border border-sand-300 bg-white/70 p-6 shadow-soft">
            <div className="flex items-center gap-3 mb-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sun-100 text-sun-600">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                  <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
              <h2 className="font-display text-lg italic text-ink">Appearance</h2>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-sand-300 bg-white px-4 py-3.5">
              <div>
                <p className="text-sm font-medium text-ink">Dark mode</p>
                <p className="text-xs text-stone-400">Switch between light and dark theme.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-stone-400">{theme === "dark" ? "On" : "Off"}</span>
                <ToggleSwitch checked={theme === "dark"} onChange={() => toggleTheme()} id="dark-mode" />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-2xl border border-sand-300 bg-white/70 p-6 shadow-soft">
            <div className="flex items-center gap-3 mb-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                  <path d="M5.5 9a6.5 6.5 0 0 1 13 0c0 3 1 4.8 1.8 5.8a1 1 0 0 1-.8 1.7H4.5a1 1 0 0 1-.8-1.7C4.5 13.8 5.5 12 5.5 9Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  <path d="M9.5 19.5a2.5 2.5 0 0 0 5 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
              <h2 className="font-display text-lg italic text-ink">Notifications</h2>
            </div>

            <div className="flex flex-col gap-3">
              <label className="flex items-center justify-between rounded-xl border border-sand-300 bg-white px-4 py-3.5 cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-ink">Email reminders</p>
                  <p className="text-xs text-stone-400">Get an email when a reminder is due.</p>
                </div>
                <ToggleSwitch checked={emailNotifs} onChange={setEmailNotifs} id="email-notif" />
              </label>
              <label className="flex items-center justify-between rounded-xl border border-sand-300 bg-white px-4 py-3.5 cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-ink">In-app notifications</p>
                  <p className="text-xs text-stone-400">Show notifications inside Parent Companion.</p>
                </div>
                <ToggleSwitch checked={appNotifs} onChange={setAppNotifs} id="app-notif" />
              </label>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={handleSave}
                className="focus-ring rounded-full bg-sage-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-sage-600"
              >
                Save preferences
              </button>
              {saved && <span className="text-sm text-sage-600">Saved</span>}
            </div>
          </div>

          {/* Account */}
          <div className="rounded-2xl border border-sand-300 bg-white/70 p-6 shadow-soft">
            <div className="flex items-center gap-3 mb-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage-100 text-sage-600">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                  <circle cx="12" cy="8" r="4.5" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M4 21c0-3.3 2.7-6 6-6h4c3.3 0 6 2.7 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
              <h2 className="font-display text-lg italic text-ink">Account</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-stone-400">Name</p>
                <p className="text-sm text-ink">{parent?.name ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-stone-400">Email</p>
                <p className="text-sm text-ink">{parent?.email ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-stone-400">Phone</p>
                <p className="text-sm text-ink">{parent?.phone ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-stone-400">Role</p>
                <p className="text-sm text-ink">Parent</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function SettingsPage() {
  return (
    <RequireRole role="parent">
      <SettingsContent />
    </RequireRole>
  );
}

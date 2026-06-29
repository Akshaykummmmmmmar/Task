"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { RequireRole } from "@/components/RequireRole";
import { fetchChildren, fetchParent } from "@/lib/mockApi";

function SettingsContent() {
  const { data: parent } = useQuery({ queryKey: ["parent"], queryFn: fetchParent });
  const { data: children } = useQuery({ queryKey: ["children"], queryFn: fetchChildren });
  const child = children?.[0];

  const [name, setName] = useState(parent?.name ?? "");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [appNotifs, setAppNotifs] = useState(true);
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    // Frontend-only demo: nothing is persisted to a backend.
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <AppShell>
      <PageHeader parent={parent} child={child} title="Settings" />

      <form
        onSubmit={handleSave}
        className="max-w-lg rounded-card border border-sand-300 bg-white/70 p-6 shadow-soft"
      >
        <h2 className="mb-4 font-display text-lg italic text-ink">Your profile</h2>
        <div className="mb-6">
          <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-stone-500">
            Name
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value || parent?.name || "")}
            placeholder={parent?.name}
            className="focus-ring w-full rounded-lg border border-sand-300 bg-white px-3.5 py-2.5 text-sm text-ink outline-none"
          />
        </div>

        <h2 className="mb-4 font-display text-lg italic text-ink">
          Notification preferences
        </h2>
        <div className="mb-6 flex flex-col gap-3">
          <label className="flex items-center justify-between rounded-lg border border-sand-300 bg-white px-4 py-3">
            <span>
              <span className="block text-sm text-ink">Email reminders</span>
              <span className="block text-xs text-stone-400">
                Get an email when a reminder is due
              </span>
            </span>
            <input
              type="checkbox"
              checked={emailNotifs}
              onChange={(e) => setEmailNotifs(e.target.checked)}
              className="focus-ring h-5 w-5 accent-sage-500"
            />
          </label>
          <label className="flex items-center justify-between rounded-lg border border-sand-300 bg-white px-4 py-3">
            <span>
              <span className="block text-sm text-ink">In-app notifications</span>
              <span className="block text-xs text-stone-400">
                Show reminders inside Parent Companion
              </span>
            </span>
            <input
              type="checkbox"
              checked={appNotifs}
              onChange={(e) => setAppNotifs(e.target.checked)}
              className="focus-ring h-5 w-5 accent-sage-500"
            />
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="focus-ring rounded-full bg-sage-500 px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-sage-600"
          >
            Save changes
          </button>
          {saved && <span className="text-sm text-sage-700">Saved</span>}
        </div>
      </form>
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

"use client";

import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { RequireRole } from "@/components/RequireRole";
import {
  fetchParent,
  fetchChildren,
  fetchReminders,
} from "@/lib/mockApi";
import { cn } from "@/lib/utils";

function ProfileContent() {
  const { data: parent } = useQuery({ queryKey: ["parent"], queryFn: fetchParent });
  const { data: children } = useQuery({ queryKey: ["children"], queryFn: fetchChildren });
  const { data: reminders } = useQuery({ queryKey: ["reminders"], queryFn: fetchReminders });

  const completedCount = (reminders ?? []).filter((r) => r.status === "completed").length;
  const totalCount = (reminders ?? []).length;

  const linkedDate = children?.[0]?.linkedAt
    ? new Date(children[0].linkedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const joinDate = "January 2026";

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="font-display text-2xl italic text-ink">Profile</h1>
          <p className="mt-1 text-sm text-stone-500">Your account information and linked children.</p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Parent Profile Card */}
          <div className="rounded-2xl border border-sand-300 bg-white/70 p-6 shadow-soft">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-6">
              <div className="flex flex-col items-center gap-3 sm:items-start">
                <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-sage-100 font-display text-2xl italic text-sage-700 shadow-sm">
                  {parent?.avatarInitials ?? parent?.name?.split(" ").map((p) => p[0]).join("")?.toUpperCase() ?? "P"}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="font-display text-xl italic text-ink">{parent?.name}</h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium text-stone-400">Email</p>
                    <p className="text-sm text-ink">{parent?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-stone-400">Phone</p>
                    <p className="text-sm text-ink">{parent?.phone ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-stone-400">Age</p>
                    <p className="text-sm text-ink">{parent?.age ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-stone-400">Member since</p>
                    <p className="text-sm text-ink">{joinDate}</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-4">
                  <div className="rounded-xl bg-sage-50 px-4 py-2.5 text-center">
                    <p className="text-lg font-semibold text-sage-700">{totalCount}</p>
                    <p className="text-xs text-sage-500">Total reminders</p>
                  </div>
                  <div className="rounded-xl bg-sage-50 px-4 py-2.5 text-center">
                    <p className="text-lg font-semibold text-sage-700">{completedCount}</p>
                    <p className="text-xs text-sage-500">Completed</p>
                  </div>
                  <div className="rounded-xl bg-sage-50 px-4 py-2.5 text-center">
                    <p className="text-lg font-semibold text-sage-700">{children?.length ?? 0}</p>
                    <p className="text-xs text-sage-500">Children linked</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Linked Children */}
          <div>
            <h2 className="mb-4 font-display text-lg italic text-ink">Linked Children</h2>
            <div className="grid grid-cols-1 gap-4">
              {(children ?? []).length === 0 ? (
                <div className="rounded-2xl border border-dashed border-sand-300 bg-white/40 p-8 text-center">
                  <p className="text-sm text-stone-500">No children linked yet.</p>
                </div>
              ) : (
                (children ?? []).map((child) => (
                  <div
                    key={child.id}
                    className="rounded-2xl border border-sand-300 bg-white/70 p-5 shadow-soft transition-all hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-sage-100 font-display text-lg italic text-sage-700 shadow-sm">
                        {child.avatarInitials}
                      </span>
                      <div className="flex-1">
                        <h3 className="font-display text-lg italic text-ink">{child.name}</h3>
                        <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                          <div>
                            <p className="text-xs font-medium text-stone-400">Age</p>
                            <p className="text-sm text-ink">{child.age ?? "—"}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-stone-400">Grade</p>
                            <p className="text-sm text-ink">{child.grade ?? "—"}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-stone-400">Username</p>
                            <p className="text-sm text-ink">@{child.name.toLowerCase()}_kid</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-stone-400">GenExcel ID</p>
                            <p className="text-sm font-mono text-ink">{child.externalGenexcelId}</p>
                          </div>
                          <div className="sm:col-span-2">
                            <p className="text-xs font-medium text-stone-400">Linked since</p>
                            <p className="text-sm text-ink">{linkedDate}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function ProfilePage() {
  return (
    <RequireRole role="parent">
      <ProfileContent />
    </RequireRole>
  );
}

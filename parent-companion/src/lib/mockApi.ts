import {
  mockParent,
  mockChildren,
  mockActivity,
  mockReminders,
  getMockSummary,
} from "@/data/mockData";
import { ActivityItem, Child, ChildSummary, Parent, Reminder } from "@/types";

// Simulates network latency so loading states are visible in the demo.
function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// Working copy so create/update/delete persist for the session (resets on refresh).
let reminders: Reminder[] = [...mockReminders];

export async function fetchParent(): Promise<Parent> {
  return delay(mockParent);
}

// Mirrors GET /parents/{id}/children
export async function fetchChildren(): Promise<Child[]> {
  return delay(mockChildren);
}

// Mirrors GET /children/{id}/summary
export async function fetchChildSummary(childId: string): Promise<ChildSummary> {
  return delay(getMockSummary(childId));
}

// Mirrors GET /children/{id}/activity?range=
export async function fetchActivity(childId: string): Promise<ActivityItem[]> {
  return delay(mockActivity.filter((a) => a.childId === childId));
}

export async function fetchChildById(childId: string): Promise<Child | undefined> {
  return delay(mockChildren.find((c) => c.id === childId));
}

// Demo-only auth: any email + any non-empty password logs the parent in.
export async function loginParent(
  email: string,
  _password: string
): Promise<{ ok: true; parentId: string } | { ok: false; error: string }> {
  await delay(null, 300);
  if (!email.trim()) return { ok: false, error: "Enter your email." };
  return { ok: true, parentId: mockParent.id };
}

// Demo-only auth: matches the child's name (case-insensitive) and 4-digit PIN.
export async function loginChild(
  name: string,
  pin: string
): Promise<{ ok: true; childId: string } | { ok: false; error: string }> {
  await delay(null, 300);
  const match = mockChildren.find(
    (c) => c.name.toLowerCase() === name.trim().toLowerCase()
  );
  if (!match) return { ok: false, error: "We couldn't find that name." };
  if (match.pin !== pin) return { ok: false, error: "That PIN doesn't match." };
  return { ok: true, childId: match.id };
}

export async function fetchReminders(): Promise<Reminder[]> {
  return delay([...reminders]);
}

export async function createReminder(
  input: Omit<Reminder, "id" | "status">
): Promise<Reminder> {
  const newReminder: Reminder = {
    ...input,
    id: `rem_${Math.random().toString(36).slice(2, 9)}`,
    status: "pending",
  };
  reminders = [newReminder, ...reminders];
  return delay(newReminder, 250);
}

export async function updateReminder(
  id: string,
  patch: Partial<Reminder>
): Promise<Reminder> {
  reminders = reminders.map((r) => (r.id === id ? { ...r, ...patch } : r));
  const updated = reminders.find((r) => r.id === id);
  if (!updated) throw new Error("Reminder not found");
  return delay(updated, 200);
}

export async function deleteReminder(id: string): Promise<{ id: string }> {
  reminders = reminders.filter((r) => r.id !== id);
  return delay({ id }, 200);
}

// Mirrors POST /notifications/send — in the demo this just logs.
export async function sendNotification(reminder: Reminder): Promise<{ sent: boolean }> {
  console.log(`[mock notification] "${reminder.title}" sent to parent`);
  return delay({ sent: true }, 150);
}

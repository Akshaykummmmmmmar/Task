import {
  mockParent,
  mockChildren,
  mockActivity,
  mockReminders,
  mockWeeklyPlan,
  getMockSummary,
  getPassionData,
  mockPassions,
  mockAthleteProfile,
  mockAthleteStats,
  mockDailyMissions,
  mockDailyRoutine,
  mockNutritionPlan,
  mockSleepData,
  mockLegendAthletes,
  mockCompetitions,
  mockAchievements,
  mockCoachMessages,
  mockWeeklyImprovements,
  getCoachResponse,
  mockParentInsights,
} from "@/data/mockData";
import { ActivityItem, Child, ChildSummary, Parent, Reminder, WeeklyPlan, PassionDef, PassionData, AthleteProfile, AthleteStats, DailyMission, DailyRoutineItem, NutritionPlan, SleepData, LegendAthlete, Competition, Achievement, CoachMessage, Sport } from "@/types";

// Simulates network latency so loading states are visible in the demo.
function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// Working copy so create/update/delete persist for the session (resets on refresh).
let reminders: Reminder[] = [...mockReminders];
let weeklyPlan: WeeklyPlan = {
  ...mockWeeklyPlan,
  days: mockWeeklyPlan.days.map((d) => ({ ...d, items: [...d.items] })),
};

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

export async function fetchPassions(): Promise<PassionDef[]> {
  return delay([...mockPassions]);
}

export async function fetchPassionData(passionId: string): Promise<PassionData | undefined> {
  return delay(getPassionData(passionId));
}

export async function fetchWeeklyPlan(): Promise<WeeklyPlan> {
  return delay({ ...weeklyPlan, days: weeklyPlan.days.map((d) => ({ ...d, items: [...d.items] })) });
}

export async function updateWeeklyPlan(plan: WeeklyPlan): Promise<WeeklyPlan> {
  weeklyPlan = { ...plan, days: plan.days.map((d) => ({ ...d, items: [...d.items] })) };
  return delay({ ...weeklyPlan, days: weeklyPlan.days.map((d) => ({ ...d, items: [...d.items] })) }, 200);
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

// ─── Champion Journey API ──────────────────────────────────────────────

let athleteProfile: AthleteProfile | null = null;

export async function saveAthleteProfile(profile: AthleteProfile): Promise<AthleteProfile> {
  athleteProfile = profile;
  localStorage.setItem("champion_athlete_profile", JSON.stringify(profile));
  return delay(profile, 300);
}

export async function fetchAthleteProfile(): Promise<AthleteProfile | null> {
  if (athleteProfile) return delay(athleteProfile);
  const stored = typeof window !== "undefined" ? localStorage.getItem("champion_athlete_profile") : null;
  if (stored) {
    athleteProfile = JSON.parse(stored);
    return delay(athleteProfile);
  }
  return delay(mockAthleteProfile);
}

export async function fetchAthleteStats(): Promise<AthleteStats> {
  return delay(mockAthleteStats());
}

export async function fetchDailyMissions(): Promise<DailyMission[]> {
  return delay([...mockDailyMissions]);
}

export async function updateMission(missionId: string, patch: Partial<DailyMission>): Promise<DailyMission> {
  return delay({ ...mockDailyMissions.find((m) => m.id === missionId)!, ...patch });
}

export async function fetchDailyRoutine(): Promise<DailyRoutineItem[]> {
  return delay([...mockDailyRoutine]);
}

export async function fetchNutritionPlan(): Promise<NutritionPlan> {
  return delay({ ...mockNutritionPlan });
}

export async function fetchSleepData(): Promise<SleepData> {
  return delay({ ...mockSleepData });
}

export async function fetchLegendAthletes(): Promise<LegendAthlete[]> {
  return delay([...mockLegendAthletes]);
}

export async function fetchLegendAthlete(id: string): Promise<LegendAthlete | undefined> {
  return delay(mockLegendAthletes.find((a) => a.id === id));
}

export async function fetchCompetitions(): Promise<Competition[]> {
  return delay([...mockCompetitions]);
}

export async function fetchAchievements(): Promise<Achievement[]> {
  return delay([...mockAchievements]);
}

export async function fetchCoachMessages(): Promise<CoachMessage[]> {
  return delay([...mockCoachMessages]);
}

export async function sendCoachMessage(sport: Sport, text: string): Promise<CoachMessage> {
  const response = getCoachResponse(sport, text);
  const msg: CoachMessage = {
    id: `coach_${Math.random().toString(36).slice(2, 9)}`,
    role: "coach",
    text: response,
    timestamp: new Date().toISOString(),
  };
  return delay(msg, 500);
}

export async function fetchWeeklyImprovements(): Promise<typeof mockWeeklyImprovements> {
  return delay([...mockWeeklyImprovements]);
}

export async function fetchParentInsights(): Promise<typeof mockParentInsights> {
  return delay({ ...mockParentInsights });
}

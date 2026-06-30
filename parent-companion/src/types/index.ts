export type ReminderType =
  | "meal"
  | "supplement"
  | "appointment"
  | "assessment"
  | "study"
  | "water"
  | "exercise"
  | "sleep";
export type ReminderRepeat = "none" | "daily" | "weekly";
export type ReminderStatus = "pending" | "completed";

export const SUBJECTS = [
  "Math",
  "Science",
  "English",
  "Social Studies",
  "Computer Science",
] as const;
export type Subject = (typeof SUBJECTS)[number];

export interface Reminder {
  id: string;
  childId: string;
  title: string;
  type: ReminderType;
  dueAt: string; // ISO datetime
  repeat: ReminderRepeat;
  status: ReminderStatus;
  notes?: string;
  subject?: Subject; // only set when type === "study"
  topic?: string; // only set when type === "study", e.g. "Fractions"
}

export interface Child {
  id: string;
  externalGenexcelId: string;
  name: string;
  avatarInitials: string;
  linkedAt: string;
  pin: string; // 4-digit PIN used for child login (demo only, not secure)
}

export interface Parent {
  id: string;
  name: string;
  email: string;
}

export type Role = "parent" | "child";

export interface Session {
  role: Role;
  parentId?: string;
  childId?: string;
}

// Mirrors GET /children/{id}/summary
export interface ChildSummary {
  childId: string;
  date: string;
  meals: {
    logged: number;
    target: number;
  };
  supplements: {
    taken: number;
    scheduled: number;
  };
  nextAppointment: {
    title: string;
    datetime: string;
  } | null;
  pendingAssessments: number;
  study: {
    completed: number;
    assigned: number;
  };
}

export interface WeeklyPlanItem {
  subject: Subject;
  topic: string;
}

export interface WeeklyPlanDay {
  day: string;
  items: WeeklyPlanItem[];
}

export interface WeeklyPlan {
  weekLabel: string;
  days: WeeklyPlanDay[];
}

export interface RoadmapStage {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  locked: boolean;
}

export interface PracticePlan {
  warmUp: string;
  skillPractice: string;
  physicalExercise: string;
  coolDown: string;
}

export interface LearningResource {
  title: string;
  type: "tutorial" | "article" | "video" | "tip";
  url?: string;
  content: string;
}

export interface PassionDef {
  id: string;
  name: string;
  emoji: string;
  category: string;
}

export interface PassionProgress {
  passionId: string;
  selectedAt: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  progress: number;
  daysPracticed: number;
  completedLessons: number;
  currentStreak: number;
  currentStageIndex: number;
  stages: RoadmapStage[];
  practicePlan: PracticePlan;
}

export interface PassionData {
  passion: PassionDef;
  progress: PassionProgress;
  roadmap: RoadmapStage[];
  resources: LearningResource[];
  quote: string;
}

// Mirrors GET /children/{id}/activity
export interface ActivityItem {
  id: string;
  childId: string;
  kind: ReminderType | "note";
  label: string;
  occurredAt: string;
}

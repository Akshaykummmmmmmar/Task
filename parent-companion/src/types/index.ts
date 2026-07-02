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
  age?: string;
  grade?: string;
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarInitials?: string;
  age?: number;
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

export interface AIMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: string;
}

export type AIInsightType = "alert" | "tip" | "praise" | "suggestion";

export interface AIInsight {
  id: string;
  type: AIInsightType;
  title: string;
  description: string;
}

// ─── Champion Journey Types ────────────────────────────────────────────

export type Sport =
  | "football"
  | "running"
  | "cricket"
  | "basketball"
  | "badminton"
  | "swimming"
  | "athletics"
  | "volleyball"
  | "martial_arts"
  | "cycling"
  | "gymnastics";

export type FitnessLevel = "sedentary" | "lightly_active" | "active" | "very_active";
export type ExperienceLevel = "beginner" | "intermediate" | "advanced";
export type TrainingTime = "morning" | "evening" | "weekends";
export type AthleteLevel = "beginner" | "rookie" | "athlete" | "competitor" | "elite" | "champion" | "legend";

export interface AthleteProfile {
  age: number;
  gender: string;
  height: number;
  weight: number;
  schoolGrade: string;
  fitnessLevel: FitnessLevel;
  sportsInterested: Sport[];
  primarySport: Sport;
  secondarySport?: Sport;
  experienceLevel: ExperienceLevel;
  trainingDaysPerWeek: number;
  availableTrainingTime: TrainingTime[];
  previousInjuries: string;
  medicalRestrictions: string;
  availableEquipment: string;
  goals: string[];
  dreamAthlete: string;
  createdAt: string;
}

export interface AthleteStats {
  strength: number;
  speed: number;
  endurance: number;
  flexibility: number;
  agility: number;
  balance: number;
  reactionTime: number;
  sleep: number;
  hydration: number;
  trainingConsistency: number;
  mood: number;
  overallScore: number;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  xp: number;
  coins: number;
  progress: number;
  target: number;
  completed: boolean;
  emoji: string;
}

export interface DailyRoutineItem {
  time: string;
  label: string;
  emoji: string;
  category: "morning" | "training" | "school" | "recovery" | "evening" | "night";
}

export interface MealRecommendation {
  meal: string;
  items: string[];
  explanation: string;
  emoji: string;
}

export interface NutritionPlan {
  breakfast: MealRecommendation;
  lunch: MealRecommendation;
  dinner: MealRecommendation;
  snacks: MealRecommendation;
  hydration: string[];
  preWorkout: string[];
  postWorkout: string[];
  healthyAlternatives: string[];
}

export interface SleepData {
  duration: number;
  quality: "poor" | "fair" | "good" | "excellent";
  status: "tracked" | "pending";
}

export interface LegendAthlete {
  id: string;
  name: string;
  sport: string;
  emoji: string;
  biography: string;
  dailyRoutine: string;
  diet: string;
  training: string;
  sleepAndRecovery: string;
  challenges: string[];
  failures: string[];
  achievements: string[];
  mindset: string[];
  lessons: string[];
}

export interface Competition {
  id: string;
  name: string;
  date: string;
  countdown: number;
  preparationChecklist: string[];
  trainingSuggestions: string[];
  nutritionSuggestions: string[];
  recoveryPlan: string[];
  mentalPreparation: string[];
  completed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  unlockedAt?: string;
  xp: number;
}

export interface CoachMessage {
  id: string;
  role: "coach" | "athlete";
  text: string;
  timestamp: string;
}

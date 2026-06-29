import {
  Child,
  Parent,
  Reminder,
  ChildSummary,
  ActivityItem,
  WeeklyPlan,
} from "@/types";

// This file stands in for the real GenExcel API.
// Each export below mirrors one of the 4 endpoints in section 7 of the brief:
//   GET /parents/{id}/children      -> mockParent, mockChildren
//   GET /children/{id}/summary      -> getMockSummary()
//   GET /children/{id}/activity     -> mockActivity
//   POST /notifications/send        -> simulated in lib/mockApi.ts

export const mockParent: Parent = {
  id: "parent_1",
  name: "Asha Varma",
  email: "asha.varma@example.com",
};

export const mockChildren: Child[] = [
  {
    id: "child_1",
    externalGenexcelId: "gx_care_seeker_8841",
    name: "Riya",
    avatarInitials: "RV",
    linkedAt: "2026-04-02T09:00:00.000Z",
    pin: "1234",
  },
];

export function getMockSummary(childId: string): ChildSummary {
  return {
    childId,
    date: "2026-06-28",
    meals: { logged: 2, target: 3 },
    supplements: { taken: 1, scheduled: 2 },
    nextAppointment: {
      title: "Counseling session",
      datetime: "2026-07-01T15:00:00.000Z",
    },
    pendingAssessments: 1,
    study: { completed: 1, assigned: 3 },
  };
}

export const mockActivity: ActivityItem[] = [
  {
    id: "act_1",
    childId: "child_1",
    kind: "meal",
    label: "Breakfast logged — oatmeal & berries",
    occurredAt: "2026-06-28T07:40:00.000Z",
  },
  {
    id: "act_2",
    childId: "child_1",
    kind: "supplement",
    label: "Vitamin D taken",
    occurredAt: "2026-06-28T08:05:00.000Z",
  },
  {
    id: "act_3",
    childId: "child_1",
    kind: "meal",
    label: "Lunch logged — dal, rice, salad",
    occurredAt: "2026-06-28T13:10:00.000Z",
  },
  {
    id: "act_4",
    childId: "child_1",
    kind: "note",
    label: "Sleep tracker synced — 7h 40m",
    occurredAt: "2026-06-27T22:30:00.000Z",
  },
  {
    id: "act_5",
    childId: "child_1",
    kind: "study",
    label: "Did not complete Math — Fractions by the due time",
    occurredAt: "2026-06-27T18:00:00.000Z",
  },
  {
    id: "act_6",
    childId: "child_1",
    kind: "study",
    label: "Completed Science — Photosynthesis",
    occurredAt: "2026-06-28T16:50:00.000Z",
  },
];

export const mockReminders: Reminder[] = [
  {
    id: "rem_1",
    childId: "child_1",
    title: "Take Vitamin D",
    type: "supplement",
    dueAt: "2026-06-28T08:00:00.000Z",
    repeat: "daily",
    status: "completed",
  },
  {
    id: "rem_2",
    childId: "child_1",
    title: "Take Omega-3",
    type: "supplement",
    dueAt: "2026-06-28T19:00:00.000Z",
    repeat: "daily",
    status: "pending",
  },
  {
    id: "rem_3",
    childId: "child_1",
    title: "Log afternoon snack",
    type: "meal",
    dueAt: "2026-06-28T16:30:00.000Z",
    repeat: "none",
    status: "pending",
  },
  {
    id: "rem_4",
    childId: "child_1",
    title: "Counseling session",
    type: "appointment",
    dueAt: "2026-07-01T15:00:00.000Z",
    repeat: "none",
    status: "pending",
    notes: "Dr. Iyer — Room 3, video link sent by email",
  },
  {
    id: "rem_5",
    childId: "child_1",
    title: "Quarterly wellbeing assessment",
    type: "assessment",
    dueAt: "2026-07-04T10:00:00.000Z",
    repeat: "none",
    status: "pending",
  },
  {
    id: "rem_6",
    childId: "child_1",
    title: "Take Vitamin D",
    type: "supplement",
    dueAt: "2026-06-27T08:00:00.000Z",
    repeat: "daily",
    status: "completed",
  },
  {
    id: "rem_7",
    childId: "child_1",
    title: "Log dinner",
    type: "meal",
    dueAt: "2026-06-26T20:00:00.000Z",
    repeat: "none",
    status: "completed",
  },
  {
    id: "rem_8",
    childId: "child_1",
    title: "Pediatric check-in call",
    type: "appointment",
    dueAt: "2026-06-25T11:00:00.000Z",
    repeat: "none",
    status: "pending",
  },
  {
    id: "rem_9",
    childId: "child_1",
    title: "Study — Math: Fractions",
    type: "study",
    subject: "Math",
    topic: "Fractions",
    dueAt: "2026-06-27T18:00:00.000Z",
    repeat: "none",
    status: "pending",
    notes: "Assigned chapter 4 practice set",
  },
  {
    id: "rem_10",
    childId: "child_1",
    title: "Study — Science: Photosynthesis",
    type: "study",
    subject: "Science",
    topic: "Photosynthesis",
    dueAt: "2026-06-28T17:00:00.000Z",
    repeat: "none",
    status: "completed",
  },
  {
    id: "rem_11",
    childId: "child_1",
    title: "Study — English: Reading comprehension",
    type: "study",
    subject: "English",
    topic: "Reading comprehension — Ch. 3",
    dueAt: "2026-06-29T18:00:00.000Z",
    repeat: "weekly",
    status: "pending",
  },
  {
    id: "rem_12",
    childId: "child_1",
    title: "Drink 8 glasses of water",
    type: "water",
    dueAt: "2026-06-28T20:00:00.000Z",
    repeat: "daily",
    status: "pending",
  },
  {
    id: "rem_13",
    childId: "child_1",
    title: "Morning walk",
    type: "exercise",
    dueAt: "2026-06-28T07:00:00.000Z",
    repeat: "daily",
    status: "completed",
  },
  {
    id: "rem_14",
    childId: "child_1",
    title: "Evening stretch routine",
    type: "exercise",
    dueAt: "2026-06-28T18:00:00.000Z",
    repeat: "daily",
    status: "pending",
  },
  {
    id: "rem_15",
    childId: "child_1",
    title: "Bedtime by 9:30 PM",
    type: "sleep",
    dueAt: "2026-06-28T21:30:00.000Z",
    repeat: "daily",
    status: "pending",
  },
];

export const mockWeeklyPlan: WeeklyPlan = {
  weekLabel: "Jun 29 – Jul 5",
  days: [
    {
      day: "Monday",
      items: [
        { subject: "Math", topic: "Fractions – Addition & Subtraction" },
        { subject: "English", topic: "Grammar – Tenses" },
      ],
    },
    {
      day: "Tuesday",
      items: [
        { subject: "Science", topic: "Photosynthesis – Deep Dive" },
        { subject: "Computer Science", topic: "Python – Variables & Loops" },
      ],
    },
    {
      day: "Wednesday",
      items: [
        { subject: "Math", topic: "Fractions – Multiplication & Division" },
        { subject: "Social Studies", topic: "Ancient Civilizations – Egypt" },
      ],
    },
    {
      day: "Thursday",
      items: [
        { subject: "English", topic: "Reading Comprehension – Ch. 3" },
        { subject: "Science", topic: "Human Body – Digestive System" },
      ],
    },
    {
      day: "Friday",
      items: [
        { subject: "Math", topic: "Decimals & Fractions Review" },
        { subject: "Computer Science", topic: "Python – Functions" },
      ],
    },
  ],
};

import {
  Child,
  Parent,
  Reminder,
  ChildSummary,
  ActivityItem,
  WeeklyPlan,
  PassionDef,
  PassionData,
  RoadmapStage,
  LearningResource,
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
  phone: "+91 98765 43210",
  avatarInitials: "AV",
  age: 38,
};

export const mockChildren: Child[] = [
  {
    id: "child_1",
    externalGenexcelId: "gx_care_seeker_8841",
    name: "Riya",
    avatarInitials: "RV",
    linkedAt: "2026-04-02T09:00:00.000Z",
    pin: "1234",
    age: "9",
    grade: "4th",
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

export const mockPassions: PassionDef[] = [
  { id: "football", name: "Football", emoji: "⚽", category: "sports" },
  { id: "cricket", name: "Cricket", emoji: "🏏", category: "sports" },
  { id: "basketball", name: "Basketball", emoji: "🏀", category: "sports" },
  { id: "athletics", name: "Athletics", emoji: "🏃", category: "sports" },
  { id: "chess", name: "Chess", emoji: "♟️", category: "mind" },
  { id: "drawing", name: "Drawing", emoji: "🎨", category: "arts" },
  { id: "painting", name: "Painting", emoji: "🖌️", category: "arts" },
  { id: "music", name: "Music", emoji: "🎵", category: "arts" },
  { id: "dance", name: "Dance", emoji: "💃", category: "arts" },
  { id: "coding", name: "Coding", emoji: "💻", category: "stem" },
  { id: "robotics", name: "Robotics", emoji: "🤖", category: "stem" },
  { id: "photography", name: "Photography", emoji: "📷", category: "arts" },
  { id: "writing", name: "Writing", emoji: "✍️", category: "arts" },
];

function footballRoadmap(): RoadmapStage[] {
  return [
    { id: "fb_basics", name: "Basics", description: "Learn the rules, positions, and basic techniques", completed: true, locked: false },
    { id: "fb_ball", name: "Ball Control", description: "Dribbling, trapping, and controlling the ball", completed: false, locked: false },
    { id: "fb_passing", name: "Passing", description: "Short passes, long passes, and crossing", completed: false, locked: true },
    { id: "fb_dribbling", name: "Dribbling", description: "Running with the ball and beating defenders", completed: false, locked: true },
    { id: "fb_shooting", name: "Shooting", description: "Accuracy, power, and different shot techniques", completed: false, locked: true },
    { id: "fb_match", name: "Match Practice", description: "Apply all skills in practice matches", completed: false, locked: true },
  ];
}

function footballPracticePlan(): { warmUp: string; skillPractice: string; physicalExercise: string; coolDown: string } {
  return {
    warmUp: "5 min light jog + dynamic stretches (leg swings, high knees)",
    skillPractice: "15 min dribbling through cones + 10 min passing drills with a partner",
    physicalExercise: "10 min shuttle runs + 15 min endurance jogging",
    coolDown: "5 min static stretches focusing on hamstrings and quads",
  };
}

function footballResources(stageId: string): LearningResource[] {
  return [
    { title: "Football Basics Guide", type: "article", content: "Learn the fundamental rules and positions of football. Understand the offside rule, fouls, and basic formations." },
    { title: "Beginner Drill: Ball Control", type: "video", content: "Watch this step-by-step drill to improve your first touch and ball control." },
    { title: "Practice Tip", type: "tip", content: "Practice with both feet! Even 10 minutes a day with your weaker foot makes a huge difference." },
  ];
}

function codingRoadmap(): RoadmapStage[] {
  return [
    { id: "cd_intro", name: "Introduction", description: "What is coding? Learn basic concepts", completed: true, locked: false },
    { id: "cd_vars", name: "Variables & Data", description: "Understand variables, numbers, and text", completed: false, locked: false },
    { id: "cd_loops", name: "Loops & Conditions", description: "Learn if/else statements and loops", completed: false, locked: true },
    { id: "cd_functions", name: "Functions", description: "Write reusable code with functions", completed: false, locked: true },
    { id: "cd_project", name: "Mini Project", description: "Build a simple project using everything learned", completed: false, locked: true },
  ];
}

function codingPracticePlan(): { warmUp: string; skillPractice: string; physicalExercise: string; coolDown: string } {
  return {
    warmUp: "5 min typing practice on keybr.com",
    skillPractice: "20 min coding challenge on the current topic",
    physicalExercise: "5 min eye exercises + 10 min walking/stretching break",
    coolDown: "5 min review what you learned today and plan tomorrow's goal",
  };
}

function codingResources(_stageId: string): LearningResource[] {
  return [
    { title: "What is Programming?", type: "video", content: "A fun animated introduction to programming concepts for kids." },
    { title: "Coding Practice Tips", type: "tip", content: "Code a little every day. Consistency beats cramming! Try the Pomodoro technique: 25 min coding, 5 min break." },
    { title: "Kids Coding Glossary", type: "article", content: "Simple explanations of common coding terms: variable, loop, function, condition, array, and more." },
  ];
}

const passionQuoteMap: Record<string, string[]> = {
  football: [
    "The harder you work, the luckier you get. — Gary Player",
    "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice. — Pelé",
    "Don't practice until you get it right. Practice until you can't get it wrong.",
  ],
  coding: [
    "Everybody should learn to program a computer because it teaches you how to think. — Steve Jobs",
    "The best way to predict the future is to create it. — Alan Kay",
    "First, solve the problem. Then, write the code.",
  ],
};

function getQuote(passionId: string): string {
  const quotes = passionQuoteMap[passionId] ?? [
    "Believe you can and you're halfway there. — Theodore Roosevelt",
    "The only way to do great work is to love what you do.",
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export function getPassionData(passionId: string): PassionData | undefined {
  const passion = mockPassions.find((p) => p.id === passionId);
  if (!passion) return undefined;

  let stages: RoadmapStage[];
  let practicePlan: { warmUp: string; skillPractice: string; physicalExercise: string; coolDown: string };
  let resources: LearningResource[];

  if (passionId === "football") {
    stages = footballRoadmap();
    practicePlan = footballPracticePlan();
    resources = footballResources("all");
  } else if (passionId === "coding") {
    stages = codingRoadmap();
    practicePlan = codingPracticePlan();
    resources = codingResources("all");
  } else {
    stages = [
      { id: `${passionId}_intro`, name: "Getting Started", description: `Learn the basics of ${passion.name}`, completed: false, locked: false },
      { id: `${passionId}_practice`, name: "Practice", description: `Practice and improve your ${passion.name} skills`, completed: false, locked: true },
      { id: `${passionId}_advance`, name: "Advanced", description: `Take your ${passion.name} skills to the next level`, completed: false, locked: true },
    ];
    practicePlan = {
      warmUp: "5 min light stretching and breathing exercises",
      skillPractice: `20 min focused practice on ${passion.name}`,
      physicalExercise: "10 min active break — walk, jump, or stretch",
      coolDown: "5 min reflect on what you learned today",
    };
    resources = [
      { title: `Getting Started with ${passion.name}`, type: "article", content: `A beginner-friendly introduction to ${passion.name}.` },
      { title: "Daily Practice Tip", type: "tip", content: "Small steps every day lead to big improvements over time. Stay consistent!" },
    ];
  }

  const completedStages = stages.filter((s) => s.completed).length;
  const progress = Math.round((completedStages / stages.length) * 100);

  return {
    passion,
    progress: {
      passionId,
      selectedAt: "2026-06-25T10:00:00.000Z",
      level: progress >= 60 ? "Intermediate" : progress >= 20 ? "Beginner" : "Beginner",
      progress,
      daysPracticed: 12,
      completedLessons: completedStages,
      currentStreak: 5,
      currentStageIndex: stages.findIndex((s) => !s.completed),
      stages,
      practicePlan,
    },
    roadmap: stages,
    resources,
    quote: getQuote(passionId),
  };
}

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

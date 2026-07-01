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

export const mockPassions: PassionDef[] = [
  { id: "football", name: "Football", emoji: "⚽", category: "games" },
  { id: "cricket", name: "Cricket", emoji: "🏏", category: "games" },
  { id: "basketball", name: "Basketball", emoji: "🏀", category: "games" },
  { id: "volleyball", name: "Volleyball", emoji: "🏐", category: "games" },
  { id: "badminton", name: "Badminton", emoji: "🏸", category: "games" },
  { id: "table_tennis", name: "Table Tennis", emoji: "🏓", category: "games" },
  { id: "chess", name: "Chess", emoji: "♟️", category: "games" },

  { id: "running", name: "Running", emoji: "🏃", category: "athletics" },
  { id: "swimming", name: "Swimming", emoji: "🏊", category: "athletics" },
  { id: "jumping", name: "Jumping", emoji: "🤸", category: "athletics" },
  { id: "gymnastics", name: "Gymnastics", emoji: "🤸‍♀️", category: "athletics" },
  { id: "javelin", name: "Javelin Throw", emoji: "🔱", category: "athletics" },
  { id: "discus", name: "Discus Throw", emoji: "⭕", category: "athletics" },
  { id: "shot_put", name: "Shot Put", emoji: "🏋️", category: "athletics" },
  { id: "high_jump", name: "High Jump", emoji: "⬆️", category: "athletics" },
  { id: "long_jump", name: "Long Jump", emoji: "📏", category: "athletics" },
  { id: "pole_vault", name: "Pole Vault", emoji: "🎯", category: "athletics" },
  { id: "hurdles", name: "Hurdles", emoji: "🏃‍♂️", category: "athletics" },
  { id: "marathon", name: "Marathon", emoji: "🎽", category: "athletics" },

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
  cricket: [
    "You have to keep believing in yourself. — Virat Kohli",
    "Cricket is a game of patience and timing.",
    "Champions keep playing until they get it right.",
  ],
  basketball: [
    "Hard work beats talent when talent doesn't work hard.",
    "The strength of the team is each member. — Michael Jordan",
    "It's not about the shoes, it's about what you do in them.",
  ],
  volleyball: [
    "Volleyball is a game of constant motion and teamwork.",
    "The best teams are the ones that trust each other.",
    "Every touch sets up the next — play together.",
  ],
  badminton: [
    "Speed, agility, and precision — badminton sharpens the mind.",
    "Every rally is a conversation between rackets.",
    "Stay light on your feet and focused on the shuttle.",
  ],
  table_tennis: [
    "Table tennis is chess at lightning speed.",
    "Spin, speed, and placement — master all three.",
    "The wrist does the work, the mind directs the play.",
  ],
  chess: [
    "Chess is the gym of the mind.",
    "Every master was once a beginner.",
    "In chess, as in life, the best move is the one you learn from.",
  ],
  running: [
    "The real race is against yourself. Keep going.",
    "Running teaches you that the finish line is just the beginning.",
    "Every mile is a memory in the making.",
  ],
  swimming: [
    "Swimming is the art of making peace with the water.",
    "Every stroke brings you closer to your goal.",
    "In the water, you find your rhythm and your strength.",
  ],
  jumping: [
    "Jumping is about believing you can fly.",
    "Height isn't the goal — technique and courage are.",
    "Push off the ground and reach for the sky.",
  ],
  gymnastics: [
    "Gymnastics is where strength meets grace.",
    "Every flip and twist is a victory over fear.",
    "Flexibility, power, and courage — the gymnast's toolkit.",
  ],
  javelin: [
    "The javelin flies as far as the mind dares to throw.",
    "Precision, power, and perfect timing.",
    "Every throw is a chance to break your own record.",
  ],
  discus: [
    "Discus is the art of controlled rotation and release.",
    "Spin, balance, let go — trust the technique.",
    "The discus teaches patience and explosive power.",
  ],
  shot_put: [
    "Shot put is pure power channeled through precision.",
    "Push from the ground, explode through the arm.",
    "Strength alone isn't enough — technique wins.",
  ],
  high_jump: [
    "The bar rises, and so must you.",
    "High jump is the poetry of overcoming gravity.",
    "Fail, adjust, and soar higher next time.",
  ],
  long_jump: [
    "Speed builds the jump, technique shapes the flight.",
    "Every centimeter is earned in the run-up.",
    "Launch, glide, land — the three keys to long jump.",
  ],
  pole_vault: [
    "Pole vault is the closest humans get to flying.",
    "Trust the pole, trust your plant, trust yourself.",
    "The higher you aim, the further you'll go.",
  ],
  hurdles: [
    "Hurdles are about rhythm, not just speed.",
    "Each hurdle is a challenge — clear it and move on.",
    "The race is won between the hurdles, not over them.",
  ],
  marathon: [
    "The marathon is a test of will, not just legs.",
    "It's not about the first mile, it's about the last.",
    "Pain is temporary, but finishing lasts forever.",
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

// ─── Champion Journey Mock Data ────────────────────────────────────────

export const mockAthleteProfile: import("@/types").AthleteProfile = {
  age: 10,
  gender: "male",
  height: 140,
  weight: 35,
  schoolGrade: "5th Grade",
  fitnessLevel: "active",
  sportsInterested: ["football", "running", "swimming"],
  primarySport: "football",
  secondarySport: "running",
  experienceLevel: "beginner",
  trainingDaysPerWeek: 4,
  availableTrainingTime: ["morning", "evening"],
  previousInjuries: "None",
  medicalRestrictions: "None",
  availableEquipment: "Football, cones, agility ladder",
  goals: ["Become faster", "Improve stamina", "Become a football player"],
  dreamAthlete: "Cristiano Ronaldo",
  createdAt: "2026-06-25T10:00:00.000Z",
};

export const mockAthleteStats = (): import("@/types").AthleteStats => ({
  strength: 65,
  speed: 58,
  endurance: 72,
  flexibility: 48,
  agility: 62,
  balance: 55,
  reactionTime: 70,
  sleep: 80,
  hydration: 45,
  trainingConsistency: 75,
  mood: 85,
  overallScore: 65,
});

export const mockDailyMissions: import("@/types").DailyMission[] = [
  { id: "m1", title: "20 Pushups", description: "Complete 20 pushups with proper form", xp: 50, coins: 10, progress: 15, target: 20, completed: false, emoji: "\u{1F4AA}" },
  { id: "m2", title: "100 Football Passes", description: "Practice passing against a wall", xp: 80, coins: 15, progress: 100, target: 100, completed: true, emoji: "\u26BD" },
  { id: "m3", title: "Drink 2L Water", description: "Stay hydrated throughout the day", xp: 30, coins: 5, progress: 1.5, target: 2, completed: false, emoji: "\u{1F4A7}" },
  { id: "m4", title: "15 Min Stretching", description: "Full body stretch routine", xp: 40, coins: 8, progress: 0, target: 15, completed: false, emoji: "\u{1F9D8}" },
  { id: "m5", title: "8 Hours Sleep", description: "Get proper rest for recovery", xp: 60, coins: 10, progress: 0, target: 8, completed: false, emoji: "\u{1F634}" },
];

export const mockDailyRoutine: import("@/types").DailyRoutineItem[] = [
  { time: "6:00 AM", label: "Wake Up", emoji: "\u2600\uFE0F", category: "morning" },
  { time: "6:15 AM", label: "Drink Water", emoji: "\u{1F4A7}", category: "morning" },
  { time: "6:30 AM", label: "Dynamic Stretching", emoji: "\u{1F9D8}", category: "morning" },
  { time: "7:00 AM", label: "Speed Training", emoji: "\u{1F3C3}", category: "training" },
  { time: "7:45 AM", label: "Healthy Breakfast", emoji: "\u{1F966}", category: "morning" },
  { time: "8:30 AM", label: "School", emoji: "\u{1F4DA}", category: "school" },
  { time: "5:00 PM", label: "Practice", emoji: "\u26BD", category: "training" },
  { time: "6:15 PM", label: "Recovery", emoji: "\u{1F9D8}", category: "recovery" },
  { time: "7:00 PM", label: "Dinner", emoji: "\u{1F958}", category: "evening" },
  { time: "8:30 PM", label: "Homework", emoji: "\u{1F4D6}", category: "evening" },
  { time: "9:30 PM", label: "Sleep", emoji: "\u{1F634}", category: "night" },
];

export const mockNutritionPlan: import("@/types").NutritionPlan = {
  breakfast: {
    meal: "Power Breakfast",
    items: ["Oatmeal with banana", "Glass of milk", "2 boiled eggs", "Handful of almonds"],
    explanation: "Oats provide slow-release energy for morning training. Eggs give protein for muscle repair. Almonds have healthy fats for brain function.",
    emoji: "\u{1F966}",
  },
  lunch: {
    meal: "Champion Lunch",
    items: ["Grilled chicken breast", "Brown rice", "Steamed broccoli", "Mixed salad", "Yogurt"],
    explanation: "Lean protein from chicken helps muscle growth. Brown rice provides complex carbs for sustained energy. Broccoli has vitamins for recovery.",
    emoji: "\u{1F357}",
  },
  dinner: {
    meal: "Recovery Dinner",
    items: ["Fish (salmon or tuna)", "Sweet potato", "Green beans", "Quinoa"],
    explanation: "Fish has omega-3s that reduce inflammation. Sweet potato restores glycogen. Quinoa has complete protein for overnight muscle repair.",
    emoji: "\u{1F9A6}",
  },
  snacks: {
    meal: "Healthy Snacks",
    items: ["Apple with peanut butter", "Trail mix", "Greek yogurt", "Banana", "Whole grain crackers"],
    explanation: "Fruits give quick natural energy. Peanut butter has protein and healthy fats. Yogurt supports gut health and digestion.",
    emoji: "\u{1F34E}",
  },
  hydration: ["Drink 2-3 liters of water daily", "Sip water during training every 15 minutes", "Avoid sugary drinks and sodas", "Coconut water is great post-training"],
  preWorkout: ["Banana (30 min before)", "Small handful of dry fruits", "Glass of water", "Avoid heavy meals 1 hour before"],
  postWorkout: ["Chocolate milk (within 30 min)", "Protein-rich snack", "Electrolyte drink", "Fruit smoothie with protein"],
  healthyAlternatives: ["Instead of chips, try roasted chickpeas", "Instead of soda, try infused water", "Instead of candy, try dates", "Instead of white bread, try whole wheat"],
};

export const mockSleepData: import("@/types").SleepData = {
  duration: 8.5,
  quality: "good",
  status: "tracked",
};

export const mockLegendAthletes: import("@/types").LegendAthlete[] = [
  {
    id: "ronaldo",
    name: "Cristiano Ronaldo",
    sport: "Football",
    emoji: "\u{1F534}",
    biography: "Cristiano Ronaldo is one of the greatest footballers of all time. Born in Madeira, Portugal, he went from a small island to conquering the football world with hard work and dedication.",
    dailyRoutine: "Wakes up at 6 AM, starts with stretching and swimming. Trains twice a day with precise nutrition timing. Goes to bed by 10 PM.",
    diet: "Eats 6 small meals a day — lean proteins, whole grains, vegetables. Avoids sugar and processed foods. Drinks 3+ liters of water daily.",
    training: "Combines technical drills, strength training, sprint work, and recovery. Never skips a workout and trains even on holidays.",
    sleepAndRecovery: "Sleeps 8 hours every night. Uses ice baths, compression gear, and regular physiotherapy for recovery.",
    challenges: ["Grew up in a small island with limited resources", "Had heart condition as a child", "Faced criticism for his playing style early on", "Dealt with injuries throughout his career"],
    failures: ["Lost the Euro 2004 final with Portugal", "Was sent off in a World Cup match", "Faced many Champions League eliminations", "Critics said he relied only on athleticism"],
    achievements: ["5 Ballon d'Or awards", "Champions League winner (5x)", "European Champion with Portugal", "All-time top scorer in football history", "Multiple league titles in England, Spain, Italy"],
    mindset: ["Hard work beats talent when talent doesn't work hard", "Always look to improve, even when you're the best", "Discipline is doing what needs to be done every single day", "Your body is your temple — treat it with respect"],
    lessons: ["Hard work and discipline matter more than natural talent", "Take care of your body through nutrition and sleep", "Never let failure stop you — keep working harder", "Believe in yourself even when others doubt you"],
  },
  {
    id: "messi",
    name: "Lionel Messi",
    sport: "Football",
    emoji: "\u{1F535}",
    biography: "Lionel Messi's journey from a boy with a growth hormone deficiency in Rosario, Argentina, to the World Cup winner and one of the greatest players ever is a story of perseverance and pure love for the game.",
    dailyRoutine: "Wakes up naturally, has mate tea, does light morning training. Afternoon technical sessions with Barcelona. Family time in evenings.",
    diet: "Follows a nutritionist-designed Mediterranean diet. Lots of fish, vegetables, fruits, and whole grains. Avoids fried foods and sodas.",
    training: "Focuses on ball control, dribbling in tight spaces, and precision shooting. Low body fat percentage through consistent training and diet.",
    sleepAndRecovery: "Prioritizes sleep and rest. Uses cryotherapy and massage therapy regularly. Takes naps when needed.",
    challenges: ["Diagnosed with growth hormone deficiency at age 11", "Family struggled to afford treatment", "Moved to a new country at age 13", "Faced early criticism about his size"],
    failures: ["Lost multiple Copa America finals with Argentina", "Retired from national team in 2016 (then returned)", "Faced Champions League disappointments", "Critics said he couldn't win without Barcelona"],
    achievements: ["8 Ballon d'Or awards (most ever)", "FIFA World Cup winner 2022", "Copa America winner", "4 Champions League titles", "Olympic gold medalist", "All-time top scorer for Barcelona"],
    mindset: ["Talent without humility is wasted", "Football is a team sport — make your teammates better", "Never give up, even when things seem impossible", "Let your game speak for itself"],
    lessons: ["Your challenges don't define your future — hard work does", "Stay humble no matter how successful you become", "Teamwork makes individual success possible", "Perseverance through failure leads to the greatest victories"],
  },
  {
    id: "bolt",
    name: "Usain Bolt",
    sport: "Running (Sprint)",
    emoji: "\u{1F3C3}",
    biography: "Usain Bolt, the fastest man in history, transformed sprinting with his charisma and unmatched speed. From a small town in Jamaica, he became a global icon through natural talent and relentless training.",
    dailyRoutine: "Wakes up at 7 AM, has a light breakfast. Morning track sessions focusing on technique. Afternoon strength work. Early nights with 9+ hours sleep.",
    diet: "High carbohydrate diet for explosive energy. Jamaican dishes like yam, plantain, rice and peas. Chicken and fish for protein. Avoids junk food during training.",
    training: "Focuses on explosive starts, top-speed mechanics, and endurance. Does extensive stretching and mobility work. Believes in perfect technique.",
    sleepAndRecovery: "Sleeps 9-10 hours every night. Takes afternoon naps. Uses massage therapy and ice baths regularly.",
    challenges: ["Grew up in a small rural village in Jamaica", "Had scoliosis (curved spine) as a teenager", "Struggled with focus and discipline early in his career", "Faced immense pressure at every Olympics"],
    failures: ["Was disqualified from the 2011 World Championship 100m final (false start)", "Underperformed in his early Olympics (2004)", "Lost races to Asafa Powell and Tyson Gay early in career", "Struggled with injuries in later years"],
    achievements: ["8 Olympic gold medals", "11 World Championship golds", "World Records in 100m (9.58s) and 200m (19.19s)", "First man to win Olympic 100m and 200m double three times", "Only sprinter to win both sprints at three consecutive Olympics"],
    mindset: ["I am not worried about the competition — I'm focused on being my best", "Hard work and consistency creates champions", "Have fun while you work — joy fuels performance", "Records are meant to be broken"],
    lessons: ["Natural talent is just the beginning — hard work makes champions", "Have confidence in your abilities but stay grounded", "Enjoy what you do — passion leads to excellence", "Overcome your physical limitations through determination"],
  },
  {
    id: "phelps",
    name: "Michael Phelps",
    sport: "Swimming",
    emoji: "\u{1F3CA}",
    biography: "Michael Phelps is the most decorated Olympian of all time with 28 medals. Diagnosed with ADHD as a child, he found focus and purpose in the pool, proving that your challenges can become your greatest strengths.",
    dailyRoutine: "Wakes at 6 AM for morning swim practice (2 hours). Breakfast, rest, then afternoon practice (2 hours). Strength training in the evening. Early bedtime.",
    diet: "Ate 8,000-10,000 calories daily during peak training. High protein, complex carbs, and healthy fats. Fueled by pasta, sandwiches, energy drinks, and protein shakes.",
    training: "Swims 80,000+ meters per week (50 miles!). Trains 5 hours a day, 6 days a week. Focuses on perfect technique, turns, and underwater work.",
    sleepAndRecovery: "Sleeps 8-9 hours nightly with afternoon naps. Uses ice baths, massage, and compression. Practices yoga for flexibility and mental focus.",
    challenges: ["Diagnosed with ADHD at age 9", "Was bullied in school for his large ears and long arms", "Struggled with focus and sitting still in class", "Dealt with depression and mental health challenges"],
    failures: ["Didn't medal in his first Olympics (2000 Sydney)", "Lost races to Ian Crocker and Milorad Cavic", "Struggled with motivation after 2008", "Faced DUI arrest and personal struggles"],
    achievements: ["28 Olympic medals (23 gold) — most ever", "8 gold medals at a single Olympics (2008 Beijing)", "39 world records (29 individual)", "Olympian at 5 different Games", "FINA Swimmer of the Year multiple times"],
    mindset: ["There will be obstacles. There will be doubters. There will be mistakes. But with hard work, there are no limits.", "Dream big, work hard, stay focused", "Your biggest competitor is yourself", "It's okay to struggle — it's not okay to give up"],
    lessons: ["Your challenges (ADHD, bullying) don't limit your potential", "Consistent daily effort creates extraordinary results", "Mental health matters — reach out when you struggle", "Dreams require sacrifice and relentless work"],
  },
  {
    id: "sindhu",
    name: "PV Sindhu",
    sport: "Badminton",
    emoji: "\u{1F3F8}",
    biography: "PV Sindhu is India's most successful badminton player. From Hyderabad, she rose to become a world champion and Olympic medalist through her aggressive playing style and never-give-up attitude.",
    dailyRoutine: "6 AM wake-up, morning fitness training. On-court practice sessions (3-4 hours). Afternoon rest and recovery. Evening practice or gym work.",
    diet: "High protein South Indian diet — idli, dosa, eggs, chicken. Hydrates with coconut water and electrolytes. Avoids oily and spicy foods before tournaments.",
    training: "Focuses on net play, smashes, and court coverage. Does extensive footwork drills. Strength training for explosive movements. Yoga for flexibility.",
    sleepAndRecovery: "Ensures 8-9 hours of sleep. Uses physiotherapy and massage. Takes rest days seriously for muscle recovery.",
    challenges: ["Had to travel long distances for training as a child", "Faced financial constraints early in her career", "Dealt with injuries during crucial tournaments", "Handled immense expectations from a billion people"],
    failures: ["Lost Olympic gold by a narrow margin (2016, 2020)", "Lost World Championship finals twice before winning", "Faced early tournament exits during form slumps", "Struggled with consistency after becoming world champion"],
    achievements: ["Olympic silver medalist (2016)", "Olympic bronze medalist (2020)", "World Champion (2019)", "Multiple World Championship medals", "Rajiv Gandhi Khel Ratna award"],
    mindset: ["Success is not final, failure is not fatal", "Every loss teaches you something valuable", "Stay calm under pressure — focus on one point at a time", "Hard work and patience always pay off"],
    lessons: ["Dream big even when resources are limited", "Losses are lessons that make you stronger", "Consistency matters more than occasional brilliance", "Representing your country is the greatest honor"],
  },
  {
    id: "kohli",
    name: "Virat Kohli",
    sport: "Cricket",
    emoji: "\u{1F3CF}",
    biography: "Virat Kohli's journey from a Delhi boy who lost his father at a young age to one of cricket's greatest batters is a story of passion, fitness revolution, and relentless pursuit of excellence.",
    dailyRoutine: "Wakes at 6:30 AM, starts with fitness training and cardio. Batting practice in the morning. Team sessions in afternoon. Recovery work in evening. Sleeps by 10 PM.",
    diet: "Strict vegetarian diet — high protein plant-based meals. Avoids gluten and dairy. Eats clean with precise meal timing. Hydrates constantly.",
    training: "Revolutionized Indian cricket fitness standards. Focuses on strength, agility, and endurance training. Hours of batting practice against all types of bowling.",
    sleepAndRecovery: "8 hours sleep without fail. Uses cryotherapy and compression. Practices meditation for mental clarity. Takes recovery days seriously.",
    challenges: ["Lost his father at age 18 during a crucial match", "Faced intense pressure as a young player in Mumbai", "Dealt with form slumps and criticism", "Managed the weight of captaincy expectations"],
    failures: ["Was dropped from the team early in his career", "Failed in crucial knockout matches", "Faced multiple dismissals in similar ways (the 'fourth stump' problem)", "Struggled in England tours initially"],
    achievements: ["Highest run-scorer in international cricket for a decade", "Multiple ICC Player of the Year awards", "Led India to historic Test series win in Australia", "World Cup winner (2011)", "Fastest to 8,000, 9,000, 10,000, 11,000 ODI runs"],
    mindset: ["Fitness is not just about how you look — it's about how you perform", "Self-belief and hard work will always defeat talent alone", "Pressure is a privilege", "Never be satisfied — always raise the bar"],
    lessons: ["Grief and loss can fuel greatness if channeled right", "Fitness and discipline are foundations of success", "Self-belief can overcome any obstacle", "Never settle — keep raising your standards"],
  },
  {
    id: "chopra",
    name: "Neeraj Chopra",
    sport: "Athletics (Javelin)",
    emoji: "\u{1F3C6}",
    biography: "Neeraj Chopra put India on the Olympic athletics map with his historic gold medal in Tokyo 2020. From a village in Haryana with limited facilities, he used determination to become a world champion.",
    dailyRoutine: "Wakes at 6 AM, light stretching and mobility. Technical javelin sessions in morning. Strength and conditioning in afternoon. Recovery and physio in evening.",
    diet: "High protein North Indian diet — paneer, eggs, chicken, lentils. Focuses on muscle recovery nutrition. Plenty of fruits and vegetables. Avoids junk food.",
    training: "Focuses on technique refinement — run-up, crossovers, release angle. Strength training for explosive power. Core work for rotational strength. Flexibility exercises.",
    sleepAndRecovery: "8-9 hours of sleep daily. Regular physiotherapy sessions. Ice baths after heavy training. Believes in active recovery.",
    challenges: ["Grew up in a village with no proper training facilities", "Had to travel long distances for coaching", "Dealt with elbow injury that required surgery", "Managed pressure of being India's Olympic medal hope"],
    failures: ["Missed the 2018 Commonwealth Games due to injury", "Faced technical inconsistencies early in career", "Struggled with elbow injury that sidelined him for months", "Had disappointing performances in some Diamond League meets"],
    achievements: ["Olympic gold medalist (Tokyo 2020)", "World Champion (2023)", "Asian Games gold medalist", "Diamond League champion", "India's first Olympic gold in athletics"],
    mindset: ["I never think about the pressure. I focus on my technique and my performance.", "When you love what you do, hard work doesn't feel like work", "Injuries are setbacks, not the end of your journey", "Representing your country is the biggest motivation"],
    lessons: ["World-class success can come from humble beginnings", "Injuries are temporary — perseverance is permanent", "Focus on your own journey, not the competition", "Technique and dedication matter more than facilities"],
  },
];

export const mockCompetitions: import("@/types").Competition[] = [
  {
    id: "comp1",
    name: "School Sports Day",
    date: "2026-08-15T09:00:00.000Z",
    countdown: 45,
    preparationChecklist: ["Register for events", "Get sports equipment ready", "Plan training schedule", "Check uniform and shoes", "Inform coach about events"],
    trainingSuggestions: ["Practice sprint starts", "Work on explosive power", "Do mock race runs", "Focus on breathing technique"],
    nutritionSuggestions: ["Increase protein intake", "Stay well hydrated", "Eat complex carbs for energy", "Avoid new foods before event"],
    recoveryPlan: ["Light stretching after each session", "Ice bath after intense training", "8+ hours sleep daily", "Rest day before the event"],
    mentalPreparation: ["Visualize your race", "Practice deep breathing", "Positive self-talk", "Remember your training"],
    completed: false,
  },
  {
    id: "comp2",
    name: "Football Tournament",
    date: "2026-09-20T09:00:00.000Z",
    countdown: 81,
    preparationChecklist: ["Team registration", "Practice matches", "Tactical training", "Fitness assessment", "Equipment check"],
    trainingSuggestions: ["Focus on ball control", "Practice set pieces", "Work on teamwork drills", "Improve match fitness"],
    nutritionSuggestions: ["Team meal planning", "Pre-match meal routine", "Hydration strategy", "Post-match recovery nutrition"],
    recoveryPlan: ["Team stretching sessions", "Massage therapy", "Ice baths", "Sleep optimization"],
    mentalPreparation: ["Team bonding activities", "Visualization exercises", "Pre-match routine practice", "Pressure handling drills"],
    completed: false,
  },
];

export const mockAchievements: import("@/types").Achievement[] = [
  { id: "ach1", title: "First Steps", description: "Complete your first training session", emoji: "\u{1F3C3}", unlocked: true, unlockedAt: "2026-06-26T10:00:00.000Z", xp: 100 },
  { id: "ach2", title: "Consistency King", description: "Train 7 days in a row", emoji: "\u{1F525}", unlocked: true, unlockedAt: "2026-06-28T10:00:00.000Z", xp: 250 },
  { id: "ach3", title: "Hydration Hero", description: "Meet water goals for 7 days", emoji: "\u{1F4A7}", unlocked: false, xp: 200 },
  { id: "ach4", title: "Early Bird", description: "Complete 5 morning workouts", emoji: "\u2600\uFE0F", unlocked: false, xp: 150 },
  { id: "ach5", title: "Strength Builder", description: "Complete 50 pushups total", emoji: "\u{1F4AA}", unlocked: false, xp: 300 },
  { id: "ach6", title: "Legend in Training", description: "Reach athlete level", emoji: "\u{1F3C6}", unlocked: false, xp: 500 },
  { id: "ach7", title: "Perfect Week", description: "Complete all missions for a week", emoji: "\u{1F31F}", unlocked: false, xp: 400 },
  { id: "ach8", title: "Sleep Champion", description: "Get 8+ hours sleep for 10 days", emoji: "\u{1F634}", unlocked: false, xp: 250 },
];

export const mockCoachMessages: import("@/types").CoachMessage[] = [
  { id: "c1", role: "coach", text: "Good morning, champion! Ready for today's training? Let's focus on ball control and acceleration.", timestamp: "2026-06-28T06:00:00.000Z" },
  { id: "c2", role: "athlete", text: "Good morning Coach! Yes, I'm ready!", timestamp: "2026-06-28T06:05:00.000Z" },
  { id: "c3", role: "coach", text: "Great energy! Let's start with dynamic stretching for 10 minutes, then we'll move to cone drills. Remember to keep your knees up and stay on your toes!", timestamp: "2026-06-28T06:10:00.000Z" },
  { id: "c4", role: "coach", text: "Excellent session today! Your footwork is improving. Don't forget to hydrate and have a protein-rich breakfast. See you this evening for practice!", timestamp: "2026-06-28T07:00:00.000Z" },
];

export const mockWeeklyImprovements = [
  { week: "Week 1", strength: 55, speed: 48, endurance: 60, agility: 50 },
  { week: "Week 2", strength: 58, speed: 51, endurance: 64, agility: 54 },
  { week: "Week 3", strength: 62, speed: 54, endurance: 68, agility: 58 },
  { week: "Week 4", strength: 65, speed: 58, endurance: 72, agility: 62 },
];

export function getCoachResponse(sport: import("@/types").Sport, message: string): string {
  const lower = message.toLowerCase();
  const sportFocus: Record<string, string[]> = {
    football: ["Ball control", "Acceleration", "Passing accuracy", "Dribbling", "Shooting technique"],
    running: ["Explosive starts", "Running form", "Breathing rhythm", "Stride length", "Cadence"],
    cricket: ["Batting stance", "Bowling action", "Footwork", "Concentration", "Shot selection"],
    basketball: ["Dribbling", "Shooting form", "Defensive stance", "Passing", "Court awareness"],
    badminton: ["Footwork", "Net play", "Smash technique", "Court coverage", "Wrist work"],
    swimming: ["Breathing technique", "Stroke efficiency", "Flip turns", "Dive starts", "Body position"],
    athletics: ["Running technique", "Explosive power", "Flexibility", "Pacing strategy", "Form"],
    volleyball: ["Serving", "Setting", "Spiking technique", "Blocking", "Court positioning"],
    martial_arts: ["Stance", "Striking", "Footwork", "Balance", "Breathing"],
    cycling: ["Pedaling technique", "Cornering", "Gear management", "Aerodynamics", "Endurance"],
    gymnastics: ["Body tension", "Flexibility", "Balance", "Landing technique", "Core strength"],
  };
  const focuses = sportFocus[sport] ?? ["Technique", "Form", "Consistency", "Strength", "Flexibility"];
  const focus = focuses[Math.floor(Math.random() * focuses.length)];

  if (lower.includes("today") || lower.includes("focus")) {
    return `Today's focus is ${focus}. Let's work on improving this area with targeted drills. Remember, small improvements every day lead to big results!`;
  }
  if (lower.includes("technique") || lower.includes("form")) {
    return `Great question about technique! The key is to start slow and focus on proper form before adding speed. Let me break it down for you... For ${sport}, the most important thing is to keep your body relaxed and focused. Practice the movement slowly 10 times, then gradually increase speed.`;
  }
  if (lower.includes("motivate") || lower.includes("tired") || lower.includes("hard")) {
    return `I know it's tough, champion! Remember why you started. Every champion has days when they don't feel like training — but champions are the ones who show up anyway. You've got this! Take a deep breath, drink some water, and let's do this together! 💪`;
  }
  if (lower.includes("eat") || lower.includes("diet") || lower.includes("nutrition") || lower.includes("food")) {
    return `Nutrition is just as important as training! For ${sport}, focus on: lean proteins for muscle repair, complex carbs for energy, and lots of fruits and vegetables for recovery. And don't forget to stay hydrated!`;
  }
  if (lower.includes("sleep") || lower.includes("rest") || lower.includes("recovery")) {
    return `Recovery is when your body gets stronger! Aim for 8-10 hours of quality sleep. During sleep, your body repairs muscles and consolidates learning. Never skip rest days — they're part of the training!`;
  }
  if (lower.includes("injury") || lower.includes("pain") || lower.includes("hurt")) {
    return `Safety first! If you're feeling pain, please stop immediately and tell your parents or guardian. Never train through sharp pain. Rest, ice, and gentle stretching are important. Always warm up properly before training to prevent injuries.`;
  }
  if (lower.includes("confidence") || lower.includes("nervous") || lower.includes("pressure")) {
    return `Feeling nervous means you care, and that's a good thing! Take 5 deep breaths. Visualize yourself succeeding. Remember all the hard work you've put in. You've prepared for this moment — trust your training!`;
  }
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
    return `Hey there, champion! 🔥 Ready to work on your ${sport} skills today? I'm here to help you become the best athlete you can be! What shall we focus on?`;
  }
  return `Great thinking! For ${sport}, consistency is key. Let's focus on ${focus} today. Remember: "Hard work beats talent when talent doesn't work hard." Keep pushing, champion! 🏆`;
}

export const mockParentInsights = {
  trainingConsistency: 78,
  achievements: 2,
  overallProgress: 65,
  sleepAvg: 8.2,
  nutritionScore: 72,
  moodAvg: 4.2,
  coachRecommendations: [
    "Increase flexibility training — current score is 48%",
    "Focus on hydration — water intake is below target",
    "Great consistency in training — keep it up!",
    "Consider adding a rest day for better recovery",
  ],
  areasNeedingImprovement: ["Flexibility", "Hydration", "Reaction Time"],
  weeklyReport: "Riya had a great week! She completed 85% of her training sessions and showed improvement in speed and endurance. Her nutrition could be better — focus on protein intake. She's been sleeping well, averaging 8.2 hours per night.",
  monthlyReport: "This month showed excellent progress in overall athletic development. Strength improved by 10%, speed by 8%, and endurance by 12%. Riya has completed 2 achievements and is showing great commitment to her football training. Continue encouraging her flexibility work and hydration habits.",
};

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

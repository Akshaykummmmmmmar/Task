export interface AppFeature {
  id: string;
  title: string;
  keywords: string[];
  description: string;
  steps: string[];
  page: string | null;
}

const FEATURES: AppFeature[] = [
  {
    id: "dashboard",
    title: "Dashboard overview",
    keywords: ["dashboard", "home", "main screen", "overview", "landing", "main page"],
    description:
      "The Dashboard is your home screen. It shows your child's daily progress, quick action links, today's schedule, recent activity, and any items needing your attention.",
    steps: [
      "View the summary cards at the top — they show meals, supplements, study, sleep, and water progress at a glance.",
      "Check the 'Needs your attention' panel for any overdue tasks that need action.",
      "See the Day Rhythm timeline for your child's schedule throughout the day.",
      "Browse the Activity Feed for recent completed tasks and events.",
      "Use the quick action links to jump to Reminders, Medicine, or Assign Study.",
    ],
    page: "/dashboard",
  },
  {
    id: "reminders",
    title: "Reminders",
    keywords: [
      "reminder",
      "reminders",
      "task",
      "tasks",
      "to-do",
      "todo",
      "list",
      "schedule",
      "due",
      "overdue",
      "pending",
    ],
    description:
      "The Reminders page shows all tasks for your child — study, meals, supplements, appointments, and more. You can view, complete, edit, or delete reminders from here.",
    steps: [
      "Go to the Reminders page from the sidebar under 'Schedule'.",
      "Use the tabs to view Pending, Completed, or All reminders.",
      "Click the checkbox on any reminder to mark it as complete.",
      "Use the 'New Reminder' button to create a custom task.",
      "Edit or delete an existing reminder using the action buttons on each card.",
    ],
    page: "/reminders",
  },
  {
    id: "medicine",
    title: "Medicine & Supplements",
    keywords: [
      "medicine",
      "medication",
      "supplement",
      "supplements",
      "vitamin",
      "vitamins",
      "pill",
      "dose",
      "meds",
      "drug",
      "prescription",
    ],
    description:
      "The Medicine page helps you track your child's daily supplements and medications. You can log when they're taken and view the schedule.",
    steps: [
      "Navigate to the Medicine page from the sidebar under 'Schedule'.",
      "View today's supplement schedule with timing for each item.",
      "Mark each supplement as taken when your child has it.",
      "Use 'Add Medicine' to set up a new supplement or medication.",
      "The page shows today's progress — how many supplements have been taken vs scheduled.",
    ],
    page: "/medicine",
  },
  {
    id: "assign_study",
    title: "Assign Study tasks",
    keywords: [
      "assign",
      "study",
      "homework",
      "assignment",
      "lesson",
      "subject",
      "math",
      "science",
      "english",
      "topic",
      "school work",
      "academic",
    ],
    description:
      "The Assign Study page lets you create study tasks for your child with specific subjects and topics. You can track what they need to learn and when.",
    steps: [
      "Open the Assign Study page from the sidebar under 'Schedule'.",
      "Choose a subject (Math, Science, English, Social Studies, or Computer Science).",
      "Enter the topic your child needs to study (e.g., 'Fractions', 'Photosynthesis').",
      "Set a due date and time for the task.",
      "Submit — the study task will appear in your child's reminders and on the dashboard.",
    ],
    page: "/assign",
  },
  {
    id: "ai_copilot",
    title: "AI Co-pilot",
    keywords: [
      "co-pilot",
      "copilot",
      "ai",
      "assistant",
      "chat",
      "help",
      "how to",
      "guide",
      "question",
      "ask",
    ],
    description:
      "The AI Co-pilot is your intelligent assistant. You can ask it questions about your child's progress, get recommendations, or learn how to use the app's features.",
    steps: [
      "Click the 'AI Co-pilot' button in the sidebar or mobile navigation.",
      "The panel slides open from the right side of the screen.",
      "You'll see proactive insight cards about your child's status.",
      "Type your question in the chat input or click one of the suggested questions.",
      "The assistant can tell you about your child's status, studies, health, overdue items, and can also explain how to use any part of this app.",
    ],
    page: null,
  },
  {
    id: "settings",
    title: "Settings",
    keywords: [
      "settings",
      "dark mode",
      "theme",
      "notification",
      "notifications",
      "preferences",
      "preference",
      "setting",
      "switch",
    ],
    description:
      "The Settings page lets you customize your experience. You can toggle dark mode and manage your notification preferences.",
    steps: [
      "Go to Settings from the sidebar (bottom section).",
      "Use the Dark Mode toggle to switch between light and dark themes.",
      "Toggle email reminders on or off to control email notifications.",
      "Toggle in-app notifications to control on-screen alerts.",
    ],
    page: "/settings",
  },
  {
    id: "profile",
    title: "Profile",
    keywords: ["profile", "account", "my account", "my profile", "parent profile", "personal"],
    description:
      "Your Profile page shows your account information. You can view and manage your name, email, and other personal details.",
    steps: [
      "Click on 'Profile' in the sidebar navigation.",
      "View your account details including name and email.",
      "Update your profile information as needed.",
    ],
    page: "/profile",
  },
  {
    id: "manage_children",
    title: "Manage Children",
    keywords: [
      "manage children",
      "add child",
      "remove child",
      "children",
      "kid",
      "kids",
      "add kid",
      "new child",
      "switch child",
    ],
    description:
      "The Manage Children section lets you add new children to your account or remove existing ones. Each child gets their own dashboard and schedule.",
    steps: [
      "Click 'Manage Children' in the sidebar navigation.",
      "A modal will open showing your current children's profiles.",
      "To add a child, fill in the name, username, password, age, and grade fields.",
      "Click 'Add Child' to link them to your account.",
      "To remove a child, click the trash icon on their profile card.",
    ],
    page: null,
  },
  {
    id: "progress",
    title: "Child Progress tracking",
    keywords: [
      "progress",
      "tracking",
      "summary",
      "cards",
      "stats",
      "statistics",
      "performance",
      "how is",
      "doing",
      "score",
    ],
    description:
      "The dashboard shows summary cards that give you a quick overview of your child's daily progress across meals, supplements, study, sleep, and water intake.",
    steps: [
      "Look at the top of the Dashboard to see the five summary cards.",
      "Each card shows a circular progress indicator with the current count vs target.",
      "Cards are color-coded for quick scanning — green tones for completed, clay tones for items needing attention.",
      "The Day Rhythm timeline shows when each activity is scheduled throughout the day.",
      "The Activity Feed gives a chronological log of all completed items.",
    ],
    page: "/dashboard",
  },
];

function findMatch(input: string): AppFeature | null {
  const lower = input.toLowerCase().trim();

  for (const feature of FEATURES) {
    for (const keyword of feature.keywords) {
      if (lower.includes(keyword)) {
        return feature;
      }
    }
  }

  return null;
}

function getWelcomeGuideIntro(): string {
  return (
    "I can also help you learn how to use this app! Here are some things you can ask me:\n\n" +
    FEATURES.map((f) => `• **${f.title}** — "${f.keywords[0]}"`).join("\n") +
    "\n\nTry asking \"How do I assign study?\" or \"What can the co-pilot do?\""
  );
}

function renderFeatureGuide(feature: AppFeature): string {
  const link = feature.page
    ? `\n\n📍 **Where to find it:** Go to \`${feature.page}\` in the sidebar.\n`
    : "";

  const steps = feature.steps.map((s, i) => `${i + 1}. ${s}`).join("\n");

  return (
    `📖 **${feature.title}**\n\n${feature.description}\n\n**Steps:**\n${steps}${link}`
  );
}

function handleAppGuide(input: string): string {
  const matched = findMatch(input);
  if (matched) {
    return renderFeatureGuide(matched);
  }

  return (
    "I can help you learn how to use Parent Companion! " +
    "Here are the topics I can explain:\n\n" +
    FEATURES.map((f) => `• **${f.title}**`).join("\n") +
    "\n\nWhat would you like to learn about?"
  );
}

export { FEATURES, findMatch, getWelcomeGuideIntro, renderFeatureGuide, handleAppGuide };

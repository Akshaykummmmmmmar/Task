import { Reminder, WeeklyPlan, PassionDef, PassionData } from "@/types";
import { fetchReminders, fetchWeeklyPlan, fetchPassions, fetchPassionData } from "@/lib/mockApi";
import { isOverdue, DEMO_NOW } from "@/lib/utils";

interface CocoResponse {
  text: string;
  audioText?: string;
  action?: "navigate" | "none";
  href?: string;
}

const GREETING_KEYWORDS = ["hello", "hi coco", "hey coco", "good morning", "good afternoon", "good evening", "yo coco", "hey"];
const INTRODUCTION_KEYWORDS = ["who are you", "what can you do", "help", "tell me about yourself", "introduce yourself"];
const TASK_KEYWORDS = ["task", "pending", "due", "reminder", "to do", "what to do", "what's next", "my list", "show tasks"];
const OVERDUE_KEYWORDS = ["overdue", "late", "missed", "past due", "behind"];
const WEEKLY_PLAN_KEYWORDS = ["weekly plan", "week schedule", "study plan", "week plan", "what subjects", "this week", "schedule"];
const DAY_KEYWORDS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const HEALTH_KEYWORDS = ["health", "medicine", "meal", "water", "exercise", "sleep", "supplement", "vitamin", "doctor", "medical"];
const PASSION_KEYWORDS = ["passion", "progress", "learning", "activity", "hobby", "talent", "skill", "practice"];
const PASSION_NAMES = ["football", "cricket", "basketball", "volleyball", "badminton", "table tennis", "chess", "running", "swimming", "gymnastics", "javelin", "discus", "shot put", "high jump", "long jump", "pole vault", "hurdles", "marathon", "drawing", "painting", "music", "dance", "coding", "robotics", "photography", "writing"];
const COMPLETED_KEYWORDS = ["complete", "done", "finished", "accomplished", "achieved"];

function matchKeyword(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((k) => lower.includes(k));
}

function getTimeGreeting(): string {
  const h = DEMO_NOW.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function formatRemindersList(reminders: Reminder[], filter: "pending" | "overdue" | "all" = "all"): CocoResponse {
  let filtered = reminders;
  if (filter === "pending") filtered = reminders.filter((r) => r.status === "pending");
  if (filter === "overdue") filtered = reminders.filter((r) => r.status === "pending" && isOverdue(r));

  if (filtered.length === 0) {
    if (filter === "pending") return { text: "You have no pending tasks. Great job staying on top of everything! 🎉" };
    if (filter === "overdue") return { text: "No overdue tasks. You're all caught up! 🌟" };
    return { text: "There are no tasks right now. Enjoy your free time! 😊" };
  }

  const completed = reminders.filter((r) => r.status === "completed").length;
  const total = reminders.length;
  const lines = filtered.map((r) => {
    const status = r.status === "pending" ? "📋" : "✅";
    const time = new Date(r.dueAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" });
    let label = r.title;
    if (r.subject) label = `${r.subject}: ${r.topic || r.title}`;
    return `${status} ${label} at ${time}`;
  });

  const intro = filter === "overdue" ? "Here are your overdue tasks that need attention:" : `You have ${filtered.length} task${filtered.length > 1 ? "s" : ""}${filter === "pending" ? " pending" : ""}:`;
  const summary = `Overall: ${completed} of ${total} tasks completed.`;

  return {
    text: `${intro}\n${lines.join("\n")}\n\n${summary}`,
    audioText: `You have ${filtered.length} ${filter === "overdue" ? "overdue" : "pending"} tasks. ${filtered.map((r) => r.title).join(". ")}. ${summary}`,
  };
}

function formatWeeklyPlan(plan: WeeklyPlan, day?: string): CocoResponse {
  if (!plan || !plan.days || plan.days.length === 0) {
    return { text: "No weekly plan has been set up yet. Ask your parent to create one!" };
  }

  if (day) {
    const dayData = plan.days.find((d) => d.day.toLowerCase() === day.toLowerCase());
    if (!dayData) return { text: `I couldn't find a plan for ${day}.` };

    if (dayData.items.length === 0) return { text: `Nothing is planned for ${day}. It's a free day! 🎉` };

    const items = dayData.items.map((i) => `${i.subject}${i.topic ? ` — ${i.topic}` : ""}`).join(", ");
    return {
      text: `On ${dayData.day}, you have: ${items}`,
      audioText: `On ${dayData.day}, you need to study ${items}`,
    };
  }

  const lines = plan.days.map((d) => {
    const subjects = d.items.map((i) => `${i.subject}${i.topic ? ` (${i.topic})` : ""}`).join(", ");
    return `${d.day}: ${subjects || "Nothing planned 🎉"}`;
  });

  return {
    text: `Your weekly plan (${plan.weekLabel}):\n${lines.join("\n")}`,
    audioText: `Your weekly plan from ${plan.weekLabel}. ${lines.map((l) => l.replace(/ *\([^)]*\) */g, "")).join(". ")}`,
  };
}

async function formatHealthSummary(reminders: Reminder[]): Promise<CocoResponse> {
  const healthTypes = ["meal", "supplement", "water", "exercise", "sleep"] as const;
  const healthReminders = reminders.filter((r) => healthTypes.includes(r.type as any));

  if (healthReminders.length === 0) return { text: "No health tasks for today. Stay healthy! 💪" };

  const pending = healthReminders.filter((r) => r.status === "pending");
  const completed = healthReminders.filter((r) => r.status === "completed");

  const pendingLines = pending.map((r) => `📋 ${r.title}`);
  const completedLines = completed.map((r) => `✅ ${r.title}`);

  let text = `Here's your health summary:\n`;
  if (pendingLines.length > 0) text += `\nStill to do:\n${pendingLines.join("\n")}`;
  if (completedLines.length > 0) text += `\n\nCompleted:\n${completedLines.join("\n")}`;

  const audioText = `You have ${pending.length} health tasks pending. ${pending.map((r) => r.title).join(". ")}. ${completed.length} tasks completed.`;

  return { text, audioText };
}

async function formatPassionSummary(passions: PassionDef[]): Promise<CocoResponse> {
  if (!passions || passions.length === 0) return { text: "You haven't explored any passions yet. Go to the passions section to pick one!" };

  const categories = [...new Set(passions.map((p) => p.category))].map((cat) => {
    const items = passions.filter((p) => p.category === cat).map((p) => p.name).join(", ");
    return `${cat}: ${items}`;
  });

  return {
    text: `You have ${passions.length} passions to explore!\n${categories.join("\n")}\n\nPick one and start learning!`,
    audioText: `You can explore ${passions.length} passions including ${passions.slice(0, 4).map((p) => p.name).join(", ")} and more!`,
  };
}

export async function cocoRespond(query: string): Promise<CocoResponse> {
  const lower = query.toLowerCase().trim();

  if (!lower || lower.length === 0) {
    return { text: "Say something! I'm listening 👂" };
  }

  // Greetings
  if (matchKeyword(lower, GREETING_KEYWORDS)) {
    const hour = DEMO_NOW.getHours();
    const timeGreeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    return {
      text: `${timeGreeting}! I'm Coco, your personal voice assistant! 🌟\n\nYou can ask me about:\n• Your tasks and reminders\n• Your weekly study plan\n• Your health activities\n• Your passions and progress\n• Anything about your day!`,
      audioText: `${timeGreeting}! I'm Coco, your personal voice assistant! Ask me about your tasks, study plan, health, or passions. How can I help you today?`,
    };
  }

  // Introduction
  if (matchKeyword(lower, INTRODUCTION_KEYWORDS)) {
    return {
      text: "Hi! I'm Coco 🥥 — your friendly voice assistant! I can help you with:\n\n📚 Your study tasks and weekly plan\n❤️ Your health reminders (meals, medicine, water, exercise, sleep)\n🏃 Your athletics and fitness goals\n🎨 Your passions and learning progress\n\nJust ask me anything! Try: 'What are my tasks today?' or 'Show my weekly plan'",
      audioText: "Hi! I'm Coco, your friendly voice assistant! I can help you with study tasks, health reminders, athletics, and passions. Just ask me anything!",
    };
  }

  // Overdue tasks
  if (matchKeyword(lower, OVERDUE_KEYWORDS)) {
    const reminders = await fetchReminders();
    return formatRemindersList(reminders, "overdue");
  }

  // Pending tasks / tasks in general
  if (matchKeyword(lower, TASK_KEYWORDS)) {
    const reminders = await fetchReminders();
    if (lower.includes("complete") || lower.includes("done") || lower.includes("finished")) {
      return formatRemindersList(reminders, "all");
    }
    return formatRemindersList(reminders, "pending");
  }

  // Weekly plan
  if (matchKeyword(lower, WEEKLY_PLAN_KEYWORDS)) {
    const plan = await fetchWeeklyPlan();
    // Check if a specific day is mentioned
    const day = DAY_KEYWORDS.find((d) => lower.includes(d));
    return formatWeeklyPlan(plan, day);
  }

  // Specific day query (e.g. "what do I have on monday")
  if (DAY_KEYWORDS.some((d) => lower.includes(d))) {
    const plan = await fetchWeeklyPlan();
    const day = DAY_KEYWORDS.find((d) => lower.includes(d));
    return formatWeeklyPlan(plan, day);
  }

  // Health queries
  if (matchKeyword(lower, HEALTH_KEYWORDS)) {
    const reminders = await fetchReminders();
    return formatHealthSummary(reminders);
  }

  // Passions queries
  if (matchKeyword(lower, PASSION_KEYWORDS)) {
    const passions = await fetchPassions();
    // Check if a specific passion is mentioned
    const specificPassion = PASSION_NAMES.find((p) => lower.includes(p));
    if (specificPassion) {
      const data = await fetchPassionData(specificPassion.replace(" ", "_"));
      if (data) {
        return {
          text: `You're learning ${data.passion.name} ${data.passion.emoji}!\nLevel: ${data.progress.level}\nProgress: ${data.progress.progress}%\nDays practiced: ${data.progress.daysPracticed}\nCurrent streak: ${data.progress.currentStreak} days\n\nDaily quote: "${data.quote}"`,
          audioText: `You're learning ${data.passion.name}. You're at ${data.progress.level} level with ${data.progress.progress} percent progress. You've practiced ${data.progress.daysPracticed} days with a ${data.progress.currentStreak} day streak. Keep going!`,
        };
      }
    }
    return formatPassionSummary(passions);
  }

  // Catch-all / unknown
  return {
    text: `I'm not sure I understand "${query}". 🤔\n\nTry asking me:\n• "What are my tasks today?"\n• "What's my weekly plan?"\n• "How's my health looking?"\n• "Tell me about my passions"\n• "Who are you?"`,
    audioText: `I'm not sure I understand. Try asking about your tasks, weekly plan, health, or passions!`,
  };
}

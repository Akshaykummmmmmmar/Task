import { AIInsight, AIInsightType, ChildSummary, Reminder, ActivityItem, WeeklyPlan, Child, Parent } from "@/types";
import { DEMO_NOW, isOverdue } from "./utils";
import { handleAppGuide, getWelcomeGuideIntro, FEATURES } from "./appGuide";

export interface AIContext {
  parent: Parent | undefined;
  child: Child | undefined;
  summary: ChildSummary | undefined;
  reminders: Reminder[];
  activity: ActivityItem[];
  weeklyPlan: WeeklyPlan | undefined;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

function childName(ctx: AIContext) {
  return ctx.child?.name ?? "your child";
}

// ── Intent detection ──────────────────────────────────────────

type Intent =
  | "greeting"
  | "status"
  | "study"
  | "health"
  | "overdue"
  | "recommend"
  | "schedule"
  | "praise"
  | "insight"
  | "medication"
  | "app_guide"
  | "unknown";

function detectIntent(input: string): Intent {
  const lower = input.toLowerCase().trim();

  if (/^(hi|hello|hey|good morning|good afternoon|good evening|howdy|yo)\b/.test(lower))
    return "greeting";

  if (/(how\s+(are|is|does|do|did)|what(\'s| is) (up|new|going|happening)|how is everything|how are things)/.test(lower))
    return "status";

  if (/\b(overdue|pending|attention|missed|not done|incomplete|late|behind|urgent)\b/.test(lower))
    return "overdue";

  if (/\b(study|math|science|english|subject|homework|assignment|lesson|learn)\b/.test(lower))
    return "study";

  if (/\b(health|meal|eat|food|breakfast|lunch|dinner|water|hydrat|sleep|bed|exercise|walk|stretch)\b/.test(lower))
    return "health";

  if (/\b(medicine|medication|supplement|vitamin|omega|pill|dose)\b/.test(lower))
    return "medication";

  if (/\b(schedule|remind|set|create|add|new reminder|plan|arrange)\b/.test(lower))
    return "schedule";

  if (/\b(recommend|suggest|advise|what should|what can|idea|tip|help me)\b/.test(lower))
    return "recommend";

  if (/\b(praise|good|well done|complete|achievement|accomplish|proud|great|awesome|done well)\b/.test(lower))
    return "praise";

  if (/\b(insight|trend|pattern|analytics|analys|progress|improve|decline|how (has|have) been)\b/.test(lower))
    return "insight";

  if (/\b(how|what|tell|show|give|status|overview|summary)\b/.test(lower))
    return "status";

  // App guide detection — ask about how to use the app
  const allFeatureKeywords = FEATURES.flatMap((f) => f.keywords);
  if (allFeatureKeywords.some((kw) => lower.includes(kw)))
    return "app_guide";
  if (/\b(how (do|to|can|would)|app|feature|page|where (is|do|can)|guide|walkthrough|tutorial|explain|what does this)\b/.test(lower))
    return "app_guide";

  return "unknown";
}

// ── Response handlers ─────────────────────────────────────────

function handleGreeting(ctx: AIContext): string {
  const name = ctx.parent?.name.split(" ")[0] ?? "there";
  const cName = childName(ctx);

  const total = ctx.reminders.length;
  const completed = ctx.reminders.filter((r) => r.status === "completed").length;
  const overdue = ctx.reminders.filter((r) => isOverdue(r)).length;

  return `Hello ${name}! 👋 I'm your AI co-pilot for ${cName}'s care. Here's a quick snapshot:\n\n• ${completed} of ${total} tasks done today\n• ${overdue} item${overdue === 1 ? "" : "s"} need${overdue === 1 ? "s" : ""} your attention\n\nWhat would you like to know? I can help with study progress, health tracking, recommendations, or scheduling.`;
}

function handleStatus(ctx: AIContext): string {
  const cName = childName(ctx);
  const s = ctx.summary;
  const parts: string[] = [`Here's how ${cName} is doing right now:\n`];

  if (s) {
    const mealStatus = s.meals.logged >= s.meals.target ? "all meals logged" : `${s.meals.logged} of ${s.meals.target} meals logged`;
    parts.push(`🍽️ **Meals** — ${mealStatus}`);

    const suppStatus = s.supplements.taken >= s.supplements.scheduled ? "all supplements taken" : `${s.supplements.taken} of ${s.supplements.scheduled} supplements taken`;
    parts.push(`💊 **Supplements** — ${suppStatus}`);

    const studyStatus = s.study.completed >= s.study.assigned ? "all study tasks completed" : `${s.study.completed} of ${s.study.assigned} study tasks done`;
    parts.push(`📚 **Study** — ${studyStatus}`);

    if (s.nextAppointment) {
      parts.push(`📅 **Next appointment** — ${s.nextAppointment.title} at ${formatTime(s.nextAppointment.datetime)}`);
    }

    if (s.pendingAssessments > 0) {
      parts.push(`📋 **Assessments** — ${s.pendingAssessments} pending`);
    }
  }

  const overdue = ctx.reminders.filter((r) => isOverdue(r));
  if (overdue.length > 0) {
    parts.push(`\n⚠️ **${overdue.length} item${overdue.length === 1 ? "" : "s"} overdue** — check the attention panel for details.`);
  }

  return parts.join("\n");
}

function handleStudy(ctx: AIContext): string {
  const cName = childName(ctx);
  const studyReminders = ctx.reminders.filter((r) => r.type === "study");
  const completed = studyReminders.filter((r) => r.status === "completed");
  const pending = studyReminders.filter((r) => r.status === "pending");
  const overdue = studyReminders.filter((r) => isOverdue(r));
  const plan = ctx.weeklyPlan;

  const parts: string[] = [`📚 **${cName}'s Study Progress**\n`];

  if (studyReminders.length === 0) {
    parts.push("No study tasks assigned yet.");
    return parts.join("\n");
  }

  parts.push(`• ${completed.length} completed, ${pending.length} pending${overdue.length > 0 ? `, ${overdue.length} overdue` : ""}`);

  if (overdue.length > 0) {
    parts.push("\n⚠️ **Overdue:**");
    for (const r of overdue) {
      parts.push(`  • ${r.title}${r.subject ? ` (${r.subject})` : ""}`);
    }
  }

  if (pending.length > 0) {
    parts.push("\n📌 **Still to do:**");
    for (const r of pending) {
      if (!isOverdue(r)) {
        parts.push(`  • ${r.title}${r.subject ? ` (${r.subject})` : ""} — due ${formatTime(r.dueAt)}`);
      }
    }
  }

  if (completed.length > 0) {
    parts.push("\n✅ **Completed:**");
    for (const r of completed) {
      parts.push(`  • ${r.title}`);
    }
  }

  if (plan) {
    parts.push(`\n📅 **Weekly plan (${plan.weekLabel}):**`);
    for (const day of plan.days) {
      const subjects = day.items.map((i) => `${i.subject} — ${i.topic}`).join(", ");
      parts.push(`  • **${day.day}:** ${subjects}`);
    }
  }

  return parts.join("\n");
}

function handleHealth(ctx: AIContext): string {
  const cName = childName(ctx);
  const s = ctx.summary;
  const healthReminders = ctx.reminders.filter((r) => ["meal", "supplement", "water", "exercise", "sleep"].includes(r.type));

  const parts: string[] = [`🏥 **${cName}'s Health Overview**\n`];

  if (s) {
    parts.push(`🍽️ **Meals:** ${s.meals.logged}/${s.meals.target} logged`);
    parts.push(`💊 **Supplements:** ${s.supplements.taken}/${s.supplements.scheduled} taken`);
  }

  const water = healthReminders.find((r) => r.type === "water");
  if (water) {
    parts.push(`💧 **Water:** ${water.status === "completed" ? "Goal met! 💪" : "Still working toward 8 glasses"}`);
  }

  const exercise = healthReminders.filter((r) => r.type === "exercise");
  if (exercise.length > 0) {
    const done = exercise.filter((r) => r.status === "completed").length;
    parts.push(`🏃 **Exercise:** ${done}/${exercise.length} session${exercise.length === 1 ? "" : "s"} done`);
  }

  const sleep = healthReminders.find((r) => r.type === "sleep");
  if (sleep) {
    parts.push(`🌙 **Sleep:** Bedtime at ${formatTime(sleep.dueAt)}${sleep.status === "completed" ? " — done! 🎉" : ""}`);
  }

  return parts.join("\n");
}

function handleOverdue(ctx: AIContext): string {
  const cName = childName(ctx);
  const overdue = ctx.reminders.filter((r) => isOverdue(r));

  if (overdue.length === 0) {
    return `🎉 Great news! There are no overdue items for ${cName}. Everything is on track!`;
  }

  const parts: string[] = [`⚠️ **${overdue.length} item${overdue.length === 1 ? "" : "s"} need${overdue.length === 1 ? "s" : ""} your attention for ${cName}:**\n`];

  for (const r of overdue) {
    const time = formatTime(r.dueAt);
    const note = r.notes ? ` — ${r.notes}` : "";
    parts.push(`  • **${r.title}** (was due at ${time})${note}`);
  }

  parts.push("\n💡 **Tip:** You can mark these as complete from the Reminders page, or adjust the schedule if needed.");

  return parts.join("\n");
}

function handleRecommend(ctx: AIContext): string {
  const cName = childName(ctx);
  const suggestions: string[] = [`🤔 **Here are my recommendations for ${cName}:**\n`];

  const s = ctx.summary;
  const overdue = ctx.reminders.filter((r) => isOverdue(r));

  if (overdue.length > 0) {
    const studyOverdue = overdue.filter((r) => r.type === "study");
    if (studyOverdue.length > 0) {
      suggestions.push(`📚 **Catch up on studies** — ${studyOverdue.length} study task${studyOverdue.length === 1 ? "" : "s"} overdue. Maybe set aside 30 minutes after school.`);
    }

    const suppOverdue = overdue.filter((r) => r.type === "supplement");
    if (suppOverdue.length > 0) {
      suggestions.push(`💊 **Don't forget supplements** — ${suppOverdue[0].title} is still pending for today.`);
    }
  }

  if (s) {
    if (s.meals.logged < s.meals.target) {
      suggestions.push(`🍽️ **Log remaining meals** — ${cName} has had ${s.meals.logged} of ${s.meals.target} meals today.`);
    }

    if (s.study.completed < s.study.assigned) {
      suggestions.push(`📖 **Study focus** — ${cName} has completed ${s.study.completed} of ${s.study.assigned} assigned tasks. A little push could help!`);
    }
  }

  const water = ctx.reminders.find((r) => r.type === "water" && r.status === "pending");
  if (water) {
    suggestions.push(`💧 **Hydration reminder** — Encourage ${cName} to drink water throughout the day.`);
  }

  if (suggestions.length === 1) {
    suggestions.push(`✨ Everything looks good! Keep up the great routine with ${cName}.`);
  }

  return suggestions.join("\n");
}

function handleSchedule(_ctx: AIContext): string {
  return `📅 **Need to schedule something?**\n\nYou can create reminders for ${childName(_ctx)} from the **Reminders** page in the sidebar. I can help you figure out what to schedule though!\n\nWould you like to know:\n• What tasks need to be scheduled?\n• Best times for study sessions?\n• Medication timing suggestions?`;
}

function handlePraise(ctx: AIContext): string {
  const cName = childName(ctx);
  const completed = ctx.reminders.filter((r) => r.status === "completed");

  if (completed.length === 0) {
    return `${cName} hasn't completed any tasks yet today. There's still time to get things done! 💪`;
  }

  const parts: string[] = [`🌟 **${cName}'s achievements today!**\n`];

  for (const r of completed) {
    parts.push(`✅ ${r.title}`);
  }

  parts.push(`\n${completed.length} task${completed.length === 1 ? "" : "s"} completed — well done ${cName}! 🎉`);

  return parts.join("\n");
}

function handleInsight(ctx: AIContext): string {
  const cName = childName(ctx);
  const parts: string[] = [`🔍 **Insights for ${cName}**\n`];

  const s = ctx.summary;
  const reminders = ctx.reminders;
  const activity = ctx.activity;

  const todayCompleted = reminders.filter((r) => r.status === "completed").length;
  const totalToday = reminders.length;
  const completionRate = totalToday > 0 ? Math.round((todayCompleted / totalToday) * 100) : 0;

  parts.push(`📊 **Daily completion rate:** ${completionRate}% (${todayCompleted}/${totalToday})`);

  if (s) {
    if (s.meals.logged < s.meals.target) {
      parts.push(`🥗 **Nutrition gap:** ${cName} is behind on meals (${s.meals.logged}/${s.meals.target}). Consider setting a dinner reminder.`);
    }

    if (s.supplements.taken < s.supplements.scheduled) {
      parts.push(`💊 **Supplements reminder:** ${s.supplements.scheduled - s.supplements.taken} supplement${s.supplements.scheduled - s.supplements.taken === 1 ? "" : "s"} still to take.`);
    }
  }

  const recentStudy = activity.filter((a) => a.kind === "study").slice(-3);
  if (recentStudy.length > 0) {
    const completedStudies = recentStudy.filter((a) => a.label.includes("Completed"));
    if (completedStudies.length > 0) {
      parts.push(`📚 **Study trend:** ${cName} has been engaging with study materials. Keep the momentum!`);
    }
  }

  const morningRoutine = reminders.filter(
    (r) => ["exercise", "supplement"].includes(r.type) && r.status === "completed"
  );
  if (morningRoutine.length >= 2) {
    parts.push(`🌅 **Morning routine:** Strong start today! ${cName} completed their morning walk and took supplements.`);
  }

  const upcomingAppts = reminders.filter(
    (r) => r.type === "appointment" && r.status === "pending"
  );
  if (upcomingAppts.length > 0) {
    for (const a of upcomingAppts) {
      parts.push(`📅 **Upcoming:** ${a.title} at ${formatTime(a.dueAt)}${a.notes ? ` — ${a.notes}` : ""}`);
    }
  }

  return parts.join("\n");
}

function handleMedication(ctx: AIContext): string {
  const cName = childName(ctx);
  const supplements = ctx.reminders.filter((r) => r.type === "supplement");
  const s = ctx.summary;

  const parts: string[] = [`💊 **${cName}'s Supplements & Medication**\n`];

  if (s) {
    parts.push(`Today's progress: ${s.supplements.taken}/${s.supplements.scheduled} taken`);
  }

  for (const r of supplements) {
    const status = r.status === "completed" ? "✅ Done" : "⏳ Pending";
    parts.push(`  • ${r.title} at ${formatTime(r.dueAt)} — ${status}`);
  }

  parts.push("\n💡 **Tip:** Consistency with supplements helps build a healthy routine!");

  return parts.join("\n");
}

function handleUnknown(ctx: AIContext): string {
  const cName = childName(ctx);
  return `I'm not sure I understand. Here are some things I can help you with:\n\n` +
    `• "How is ${cName} doing?" — overall status\n` +
    `• "What's overdue?" — items needing attention\n` +
    `• "How are the studies going?" — study progress\n` +
    `• "Health check" — meals, supplements, exercise, sleep\n` +
    `• "Any recommendations?" — suggestions and tips\n` +
    `• "What did ${cName} complete?" — today's achievements\n` +
    `• "Schedule something" — help with reminders\n` +
    `• "Medication status" — supplements overview\n` +
    `• **"How do I assign study?"** — learn how to use app features\n` +
    `• **"What does this app do?"** — explore the app guide`;
}

function handleAppGuideResponse(input: string, ctx: AIContext): string {
  const cName = childName(ctx);
  const result = handleAppGuide(input);

  if (result.startsWith("I can help you learn")) {
    return `👋 **Need help using the app?**\n\n${result}`;
  }

  return `${result}\n\n💡 **Tip:** You can ask me about any other feature too — just tell me what you'd like to learn!`;
}

// ── Public API ────────────────────────────────────────────────

export function generateResponse(userMessage: string, context: AIContext): string {
  const intent = detectIntent(userMessage);

  switch (intent) {
    case "greeting": return handleGreeting(context);
    case "status": return handleStatus(context);
    case "study": return handleStudy(context);
    case "health": return handleHealth(context);
    case "overdue": return handleOverdue(context);
    case "recommend": return handleRecommend(context);
    case "schedule": return handleSchedule(context);
    case "praise": return handlePraise(context);
    case "insight": return handleInsight(context);
    case "medication": return handleMedication(context);
    case "app_guide": return handleAppGuideResponse(userMessage, context);
    case "unknown": return handleUnknown(context);
  }
}

export function generateInitialInsights(context: AIContext): AIInsight[] {
  const insights: AIInsight[] = [];
  const cName = childName(context);
  const overdue = context.reminders.filter((r) => isOverdue(r));
  const s = context.summary;
  const completed = context.reminders.filter((r) => r.status === "completed");

  // Praise insight
  if (completed.length >= 2) {
    const top = completed.slice(0, 2).map((r) => r.title).join(" and ");
    insights.push({
      id: "insight_praise",
      type: "praise",
      title: `Great start! 🎉`,
      description: `${cName} completed ${top} today.`,
    });
  }

  // Overdue alert
  if (overdue.length > 0) {
    const overdueStudy = overdue.filter((r) => r.type === "study");
    if (overdueStudy.length > 0) {
      insights.push({
        id: "insight_study_overdue",
        type: "alert",
        title: `Study needs attention 📚`,
        description: `${overdueStudy.length} study task${overdueStudy.length === 1 ? "" : "s"} overdue for ${cName}.`,
      });
    }

    const overdueSupp = overdue.filter((r) => r.type === "supplement");
    if (overdueSupp.length > 0) {
      insights.push({
        id: "insight_supp_overdue",
        type: "alert",
        title: `Supplements pending 💊`,
        description: `${overdueSupp[0].title} is overdue for today.`,
      });
    }
  }

  // Meal tip
  if (s && s.meals.logged < s.meals.target) {
    insights.push({
      id: "insight_meals",
      type: "suggestion",
      title: `Complete meal logging 🍽️`,
      description: `${cName} has had ${s.meals.logged} of ${s.meals.target} meals. Dinner might need a reminder.`,
    });
  }

  // Hydration reminder
  const water = context.reminders.find((r) => r.type === "water" && r.status === "pending");
  if (water) {
    insights.push({
      id: "insight_water",
      type: "tip",
      title: `Stay hydrated 💧`,
      description: `Encourage ${cName} to drink water throughout the day.`,
    });
  }

  // Study progress
  if (s && s.study.completed < s.study.assigned) {
    insights.push({
      id: "insight_study_progress",
      type: "suggestion",
      title: `Keep studying 📖`,
      description: `${cName} completed ${s.study.completed} of ${s.study.assigned} study tasks. A short session could help close the gap.`,
    });
  }

  // Bedtime routine
  const sleep = context.reminders.find((r) => r.type === "sleep" && r.status === "pending");
  if (sleep) {
    insights.push({
      id: "insight_sleep",
      type: "tip",
      title: `Bedtime approaching 🌙`,
      description: `${cName}'s bedtime is at ${formatTime(sleep.dueAt)}. Start winding down!`,
    });
  }

  // App guide tip
  insights.push({
    id: "insight_app_guide",
    type: "tip",
    title: `Learn the app 💡`,
    description: `Ask me how to use any feature — assign study, log medicine, manage children, and more!`,
  });

  // Appointment reminder
  const appointments = context.reminders.filter(
    (r) => r.type === "appointment" && r.status === "pending"
  );
  for (const appt of appointments) {
    insights.push({
      id: `insight_appt_${appt.id}`,
      type: "alert",
      title: `Upcoming: ${appt.title} 📅`,
      description: `${appt.title} at ${formatTime(appt.dueAt)}${appt.notes ? ` — ${appt.notes}` : ""}.`,
    });
  }

  return insights;
}

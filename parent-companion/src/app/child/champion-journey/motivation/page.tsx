"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RequireRole } from "@/components/RequireRole";
import { GreetingHeader } from "@/components/child/GreetingHeader";
import { ClayCard } from "@/components/child/ClayCard";
import { cn } from "@/lib/utils";
import { SparkleIcon } from "@/components/icons";

const DAILY_QUOTES = [
  { text: "The harder you work, the luckier you get.", author: "Gary Player" },
  { text: "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice.", author: "Pelé" },
  { text: "Don't practice until you get it right. Practice until you can't get it wrong.", author: "Unknown" },
  { text: "Your only limit is the one you set for yourself.", author: "Unknown" },
  { text: "Champions keep playing until they get it right.", author: "Billie Jean King" },
  { text: "It's not about being the best. It's about being better than you were yesterday.", author: "Unknown" },
  { text: "Dream big, work hard, stay focused.", author: "Unknown" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
];

const SUCCESS_STORIES = [
  {
    name: "Ronaldo's Journey",
    emoji: "\u{1F534}",
    story: "Cristiano Ronaldo grew up on a small island in Portugal with very little money. He had a heart condition as a child but never gave up. Through extreme discipline - waking up at 6 AM, training harder than anyone else, and taking care of his body like a temple - he became one of the greatest footballers of all time.",
    lesson: "Your circumstances don't determine your future - your hard work does.",
  },
  {
    name: "Bolt's Speed",
    emoji: "\u{26A1}",
    story: "Usain Bolt from Jamaica wanted to be the fastest in the world. Despite having scoliosis (a curved spine), he trained relentlessly. He would practice his starts hundreds of times, perfect every step, and believe in himself even when others doubted. He became the fastest man in history with 8 Olympic gold medals.",
    lesson: "Even physical challenges can be overcome with belief and hard work.",
  },
  {
    name: "Sindhu's Spirit",
    emoji: "\u{1F3F8}",
    story: "PV Sindhu from India faced many challenges on her path to becoming a world champion. She traveled long distances for training, faced financial difficulties, and lost Olympic finals by narrow margins. But she never gave up. She kept working on her game, and in 2019 she became the World Champion.",
    lesson: "Losses are just lessons that make you stronger for the next battle.",
  },
  {
    name: "Phelps' Comeback",
    emoji: "\u{1F3CA}",
    story: "Michael Phelps was diagnosed with ADHD as a child and was bullied in school. He found his home in the pool. After winning 8 gold medals in 2008, he faced personal struggles and depression. But he got help, came back stronger, and added more medals to become the most decorated Olympian ever with 28 medals.",
    lesson: "It's okay to struggle. What matters is getting back up and asking for help when you need it.",
  },
];

const CHALLENGES = [
  { day: 1, title: "10 Minute Morning Stretch", desc: "Start your day with a full body stretch", xp: 30 },
  { day: 2, title: "50 Jumping Jacks", desc: "Get your heart pumping", xp: 40 },
  { day: 3, title: "Drink 2L Water Today", desc: "Track your water intake", xp: 30 },
  { day: 4, title: "15 Min Practice Session", desc: "Focus on your primary sport skill", xp: 50 },
  { day: 5, title: "No Sugar Day", desc: "Avoid sugary foods and drinks", xp: 60 },
  { day: 6, title: "20 Pushups Challenge", desc: "Complete 20 pushups with good form", xp: 50 },
  { day: 7, title: "Share What You Learned", desc: "Teach someone a skill you learned", xp: 80 },
];

const MINDSET_LESSONS = [
  { title: "Growth Mindset", desc: "Your abilities can grow with effort. Every mistake is a chance to learn and improve.", emoji: "\u{1F331}" },
  { title: "Positive Self-Talk", desc: "What you tell yourself matters. Say 'I can do this' instead of 'This is too hard.'", emoji: "\u{1F4AC}" },
  { title: "Embrace Challenges", desc: "Difficult tasks make you stronger. Don't avoid them - face them with courage.", emoji: "\u{1F525}" },
  { title: "Learn From Failure", desc: "Every champion has failed many times. Failure is not the opposite of success - it's part of success.", emoji: "\u{1F4AA}" },
  { title: "Stay Disciplined", desc: "Motivation comes and goes. Discipline is doing what needs to be done even when you don't feel like it.", emoji: "\u{1F4CB}" },
  { title: "Visualize Success", desc: "Close your eyes and picture yourself succeeding. Your brain learns from visualization just like real practice.", emoji: "\u{1F4AD}" },
];

function MotivationContent() {
  const [selectedStory, setSelectedStory] = useState<number | null>(null);
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([]);
  const today = new Date().getDate();
  const quoteIndex = today % DAILY_QUOTES.length;
  const challengeIndex = (today - 1) % CHALLENGES.length;

  function toggleChallenge(day: number) {
    setCompletedChallenges((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-4xl bg-[#faf7f2] px-4 py-6 sm:px-8 sm:py-10">
      <GreetingHeader childName="Champion" subtitle="Stay motivated and inspired!" className="mb-6" />

      {/* Daily Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "mb-8 rounded-3xl border border-sun-200/40 px-6 py-8 text-center",
          "bg-gradient-to-br from-sun-50 via-white to-sun-100/30",
          "shadow-[0_12px_40px_rgba(45,42,38,0.08),0_-6px_20px_rgba(255,255,255,0.7)]"
        )}
      >
        <SparkleIcon className="mx-auto mb-3 h-6 w-6 text-sun-500" />
        <p className="font-display text-xl italic text-ink sm:text-2xl">
          &ldquo;{DAILY_QUOTES[quoteIndex].text}&rdquo;
        </p>
        <p className="mt-3 text-sm text-stone-500">— {DAILY_QUOTES[quoteIndex].author}</p>
      </motion.div>

      {/* Challenge of the Day */}
      <ClayCard className="mb-8 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-lg italic text-ink">Challenge of the Day</p>
            <p className="mt-1 text-sm text-ink">{CHALLENGES[challengeIndex].title}</p>
            <p className="text-xs text-stone-500">{CHALLENGES[challengeIndex].desc}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-sun-600">+{CHALLENGES[challengeIndex].xp} XP</p>
            <button
              onClick={() => toggleChallenge(CHALLENGES[challengeIndex].day)}
              className={cn(
                "mt-2 rounded-full px-4 py-1.5 text-xs font-medium transition-all",
                completedChallenges.includes(CHALLENGES[challengeIndex].day)
                  ? "bg-sage-100 text-sage-700"
                  : "bg-sun-100 text-sun-700 hover:bg-sun-200"
              )}
            >
              {completedChallenges.includes(CHALLENGES[challengeIndex].day) ? "✓ Done!" : "Mark Complete"}
            </button>
          </div>
        </div>
      </ClayCard>

      {/* Success Stories */}
      <h2 className="mb-4 font-display text-lg italic text-sun-700">🌟 Success Stories</h2>
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {SUCCESS_STORIES.map((story, i) => (
          <motion.button
            key={story.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            onClick={() => setSelectedStory(selectedStory === i ? null : i)}
            className="rounded-2xl bg-white/70 border border-white/20 p-5 text-left shadow-[0_6px_20px_rgba(45,42,38,0.06),0_-3px_10px_rgba(255,255,255,0.6)] transition-all"
          >
            <span className="text-3xl">{story.emoji}</span>
            <p className="mt-2 text-sm font-medium text-ink">{story.name}</p>
            <AnimatePresence>
              {selectedStory === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="mt-2 text-xs leading-relaxed text-stone-600">{story.story}</p>
                  <p className="mt-2 text-xs font-medium text-sun-700">💡 {story.lesson}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      {/* Mindset Lessons */}
      <h2 className="mb-4 font-display text-lg italic text-sun-700">🧠 Mindset Lessons</h2>
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {MINDSET_LESSONS.map((lesson, i) => (
          <motion.div
            key={lesson.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.03 }}
            className="rounded-2xl bg-white/70 border border-white/20 p-4 shadow-[0_6px_20px_rgba(45,42,38,0.06),0_-3px_10px_rgba(255,255,255,0.6)]"
          >
            <span className="text-2xl">{lesson.emoji}</span>
            <p className="mt-2 text-sm font-medium text-ink">{lesson.title}</p>
            <p className="mt-1 text-xs text-stone-500">{lesson.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Weekly Challenge List */}
      <h2 className="mb-4 font-display text-lg italic text-sun-700">📋 This Week&apos;s Challenges</h2>
      <ClayCard className="p-5">
        <div className="flex flex-col gap-2">
          {CHALLENGES.map((challenge) => (
            <div
              key={challenge.day}
              className={cn(
                "flex items-center justify-between rounded-xl px-4 py-3 transition-all",
                completedChallenges.includes(challenge.day)
                  ? "bg-sage-50/50"
                  : "bg-white/50"
              )}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleChallenge(challenge.day)}
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all",
                    completedChallenges.includes(challenge.day)
                      ? "bg-sage-300 text-white"
                      : "border-2 border-sand-300 text-stone-400"
                  )}
                >
                  {completedChallenges.includes(challenge.day) ? "✓" : challenge.day}
                </button>
                <div>
                  <p className={cn("text-sm", completedChallenges.includes(challenge.day) ? "text-sage-600 line-through" : "text-ink")}>
                    {challenge.title}
                  </p>
                  <p className="text-xs text-stone-500">{challenge.desc}</p>
                </div>
              </div>
              <span className="text-xs font-medium text-sun-600">+{challenge.xp} XP</span>
            </div>
          ))}
        </div>
      </ClayCard>
    </div>
  );
}

export default function MotivationPage() {
  return (
    <RequireRole role="child">
      <MotivationContent />
    </RequireRole>
  );
}

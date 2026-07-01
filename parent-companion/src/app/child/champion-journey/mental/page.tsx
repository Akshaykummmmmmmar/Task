"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RequireRole } from "@/components/RequireRole";
import { GreetingHeader } from "@/components/child/GreetingHeader";
import { ClayCard } from "@/components/child/ClayCard";
import { cn } from "@/lib/utils";

const MENTAL_TOPICS = [
  {
    title: "Confidence",
    desc: "Believe in yourself and your abilities. Confidence comes from preparation and practice.",
    emoji: "\u{1F464}",
    tips: [
      "Remember your past successes — you've done hard things before!",
      "Practice your skills until you feel confident",
      "Use positive self-talk: 'I am prepared, I can do this'",
      "Stand tall and proud — your body language affects your mindset",
    ],
  },
  {
    title: "Focus",
    desc: "Train your mind to stay present and focused on what matters.",
    emoji: "\u{1F3AF}",
    tips: [
      "Set one clear goal for each training session",
      "Remove distractions — put your phone away",
      "Use the '5 more' rule: do 5 more reps, 5 more minutes",
      "Practice mindfulness by paying attention to your breathing",
    ],
  },
  {
    title: "Handling Pressure",
    desc: "Learn to perform your best when it matters most.",
    emoji: "\u{1F4A5}",
    tips: [
      "Pressure is a privilege — it means you care",
      "Take deep breaths: 4 seconds in, 4 seconds hold, 4 seconds out",
      "Focus on the process, not the outcome",
      "Remember: nervous and excited feel the same — choose excitement!",
    ],
  },
  {
    title: "Winning Mindset",
    desc: "Develop the mentality of a champion in everything you do.",
    emoji: "\u{1F3C6}",
    tips: [
      "Define success on your own terms — it's not just about winning",
      "Learn from every outcome, whether you win or lose",
      "Compete against yourself, not others",
      "Celebrate small victories along the way",
    ],
  },
  {
    title: "Visualization",
    desc: "Close your eyes and see yourself succeeding. Your brain learns from visualization.",
    emoji: "\u{1F4AD}",
    tips: [
      "Find a quiet space and close your eyes",
      "Imagine every detail — the sounds, the feel, the movements",
      "Visualize yourself performing perfectly",
      "Practice visualization 5 minutes daily",
    ],
  },
  {
    title: "Breathing Exercises",
    desc: "Control your breath to control your mind and body.",
    emoji: "\u{1F9D8}",
    tips: [
      "Box breathing: 4-4-4-4 (in, hold, out, hold)",
      "Deep belly breathing before competitions",
      "Use breathing to calm nerves and refocus",
      "Practice breathing exercises daily for best results",
    ],
  },
  {
    title: "Meditation",
    desc: "Train your mind like you train your body — with regular practice.",
    emoji: "\u{1F9D8}\u200D\u2642\uFE0F",
    tips: [
      "Start with just 2-3 minutes of meditation daily",
      "Focus on your breath — when your mind wanders, gently bring it back",
      "Use guided meditation apps designed for kids",
      "Meditate after training to help your body and mind recover",
    ],
  },
  {
    title: "Stress Management",
    desc: "Learn healthy ways to deal with stress and pressure.",
    emoji: "\u{1F30A}",
    tips: [
      "Talk to someone you trust about how you're feeling",
      "Exercise is one of the best ways to reduce stress",
      "Get enough sleep — stress is harder to handle when you're tired",
      "Write down your worries to get them out of your head",
    ],
  },
  {
    title: "Positive Thinking",
    desc: "Train your brain to see opportunities instead of obstacles.",
    emoji: "\u2601\uFE0F",
    tips: [
      "Replace 'I can't' with 'I can't YET'",
      "Find one good thing in every situation",
      "Surround yourself with positive people",
      "Practice gratitude — write 3 things you're grateful for daily",
    ],
  },
  {
    title: "Pre-Match Routine",
    desc: "Create a consistent routine that prepares you mentally and physically.",
    emoji: "\u{1F3B2}",
    tips: [
      "Develop a routine and stick to it before every competition",
      "Include light warm-up, visualization, and deep breathing",
      "Listen to music that energizes or calms you",
      "Arrive early to avoid rushing and to get comfortable",
    ],
  },
];

function MentalContent() {
  const [activeTopic, setActiveTopic] = useState<number | null>(null);

  return (
    <div className="mx-auto min-h-screen max-w-4xl bg-[#faf7f2] px-4 py-6 sm:px-8 sm:py-10">
      <GreetingHeader childName="Champion" subtitle="Train your mind to be a champion!" className="mb-6" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "mb-8 rounded-3xl border border-sun-200/40 px-6 py-6 sm:px-8 sm:py-8",
          "bg-gradient-to-br from-sun-50 via-white to-sun-100/30",
          "shadow-[0_12px_40px_rgba(45,42,38,0.08),0_-6px_20px_rgba(255,255,255,0.7)]"
        )}
      >
        <p className="font-display text-xl italic text-sun-700">Mental Performance Coach</p>
        <p className="mt-1 text-sm text-stone-500">
          A strong mind creates a strong athlete. Let's build your mental muscles!
        </p>
      </motion.div>

      {/* Mental Topics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {MENTAL_TOPICS.map((topic, i) => (
          <motion.div
            key={topic.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.03 }}
          >
            <button
              onClick={() => setActiveTopic(activeTopic === i ? null : i)}
              className={cn(
                "w-full rounded-2xl border p-5 text-left transition-all",
                "shadow-[0_6px_20px_rgba(45,42,38,0.06),0_-3px_10px_rgba(255,255,255,0.6)]",
                activeTopic === i
                  ? "border-sun-400 bg-sun-50"
                  : "border-white/20 bg-white/70 hover:border-sun-200"
              )}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{topic.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink">{topic.title}</p>
                  <p className="mt-1 text-xs text-stone-500">{topic.desc}</p>
                </div>
              </div>

              {activeTopic === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 overflow-hidden"
                >
                  <div className="flex flex-col gap-2 border-t border-sun-200 pt-4">
                    {topic.tips.map((tip, j) => (
                      <div key={j} className="flex items-start gap-2 rounded-lg bg-white/60 px-3 py-2">
                        <span className="mt-0.5 text-xs text-sun-500">{j + 1}.</span>
                        <span className="text-xs text-ink">{tip}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Quick Breathing Exercise */}
      <ClayCard className="mt-8 p-6 text-center">
        <span className="text-4xl">🫁</span>
        <p className="mt-3 font-display text-lg italic text-ink">Quick Breathing Exercise</p>
        <p className="mt-1 text-sm text-stone-500">Try this box breathing technique right now:</p>
        <div className="mt-4 flex items-center justify-center gap-4">
          {[
            { label: "Inhale", seconds: 4, color: "bg-sun-300" },
            { label: "Hold", seconds: 4, color: "bg-sun-400" },
            { label: "Exhale", seconds: 4, color: "bg-sun-500" },
            { label: "Hold", seconds: 4, color: "bg-sun-400" },
          ].map((step) => (
            <div key={step.label} className="flex flex-col items-center gap-1">
              <div className={cn("h-10 w-10 rounded-full transition-all", step.color)} />
              <span className="text-xs font-medium text-stone-600">{step.label}</span>
              <span className="text-xs text-stone-400">{step.seconds}s</span>
            </div>
          ))}
        </div>
      </ClayCard>
    </div>
  );
}

export default function MentalPage() {
  return (
    <RequireRole role="child">
      <MentalContent />
    </RequireRole>
  );
}

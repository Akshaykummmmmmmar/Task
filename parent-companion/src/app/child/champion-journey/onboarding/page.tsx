"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { saveAthleteProfile } from "@/lib/mockApi";
import { RequireRole } from "@/components/RequireRole";
import { cn } from "@/lib/utils";
import { SparkleIcon } from "@/components/icons";
import { Sport, FitnessLevel, ExperienceLevel, TrainingTime } from "@/types";

const SPORTS: { id: Sport; label: string; emoji: string }[] = [
  { id: "football", label: "Football", emoji: "⚽" },
  { id: "running", label: "Running", emoji: "🏃" },
  { id: "cricket", label: "Cricket", emoji: "🏏" },
  { id: "basketball", label: "Basketball", emoji: "🏀" },
  { id: "badminton", label: "Badminton", emoji: "🏸" },
  { id: "swimming", label: "Swimming", emoji: "🏊" },
  { id: "athletics", label: "Athletics", emoji: "🎽" },
  { id: "volleyball", label: "Volleyball", emoji: "🏐" },
  { id: "martial_arts", label: "Martial Arts", emoji: "🥋" },
  { id: "cycling", label: "Cycling", emoji: "🚴" },
  { id: "gymnastics", label: "Gymnastics", emoji: "🤸" },
];

const FITNESS_LEVELS: { id: FitnessLevel; label: string }[] = [
  { id: "sedentary", label: "Not very active" },
  { id: "lightly_active", label: "Slightly active" },
  { id: "active", label: "Active" },
  { id: "very_active", label: "Very active" },
];

const EXPERIENCE_LEVELS: { id: ExperienceLevel; label: string }[] = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

const GOAL_OPTIONS = [
  "Become faster",
  "Lose weight",
  "Improve stamina",
  "Become a football player",
  "Become a runner",
  "Become stronger",
  "Improve flexibility",
];

const DREAM_ATHLETES = [
  "Cristiano Ronaldo",
  "Lionel Messi",
  "Usain Bolt",
  "Neeraj Chopra",
  "PV Sindhu",
  "Virat Kohli",
  "Michael Phelps",
];

const STEPS = [
  { title: "Welcome to Champion Journey!", subtitle: "Let's set up your athlete profile" },
  { title: "About You", subtitle: "Tell us about yourself" },
  { title: "Your Sports", subtitle: "What sports do you love?" },
  { title: "Experience & Goals", subtitle: "Your training level and goals" },
  { title: "Your Dream", subtitle: "Who inspires you?" },
  { title: "All Set!", subtitle: "Your personal coach is ready!" },
];

function OnboardingContent() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<{
    age: number;
    gender: string;
    height: number;
    weight: number;
    schoolGrade: string;
    fitnessLevel: FitnessLevel;
    sportsInterested: Sport[];
    primarySport: Sport | "";
    secondarySport: Sport | "";
    experienceLevel: ExperienceLevel;
    trainingDaysPerWeek: number;
    availableTrainingTime: TrainingTime[];
    previousInjuries: string;
    medicalRestrictions: string;
    availableEquipment: string;
    goals: string[];
    dreamAthlete: string;
  }>({
    age: 10,
    gender: "",
    height: 140,
    weight: 35,
    schoolGrade: "",
    fitnessLevel: "active",
    sportsInterested: [],
    primarySport: "",
    secondarySport: "",
    experienceLevel: "beginner",
    trainingDaysPerWeek: 3,
    availableTrainingTime: [],
    previousInjuries: "",
    medicalRestrictions: "",
    availableEquipment: "",
    goals: [],
    dreamAthlete: "",
  });

  const saveMutation = useMutation({
    mutationFn: saveAthleteProfile,
    onSuccess: () => {
      localStorage.setItem("champion_onboarding_done", "true");
      router.replace("/child/champion-journey");
    },
  });

  function updateField<K extends keyof typeof profile>(field: K, value: (typeof profile)[K]) {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  function toggleArrayField(field: "sportsInterested" | "goals", value: string) {
    setProfile((prev) => {
      const arr = [...prev[field]] as string[];
      if (arr.includes(value)) return { ...prev, [field]: arr.filter((v) => v !== value) as typeof prev[typeof field] };
      return { ...prev, [field]: [...arr, value] as typeof prev[typeof field] };
    });
  }

  function canProceed(): boolean {
    switch (step) {
      case 0: return true;
      case 1: return profile.age > 0 && profile.gender !== "" && profile.height > 0 && profile.weight > 0 && profile.schoolGrade !== "";
      case 2: return !!profile.primarySport;
      case 3: return !!profile.experienceLevel && profile.trainingDaysPerWeek > 0 && profile.availableTrainingTime.length > 0;
      case 4: return true;
      case 5: return true;
      default: return false;
    }
  }

  function handleNext() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      saveMutation.mutate(profile as import("@/types").AthleteProfile);
    }
  }

  return (
    <div className="mx-auto min-h-screen bg-[#faf7f2]">
      {/* Progress bar */}
      <div className="px-4 pt-6 sm:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Step {step + 1} of {STEPS.length}</span>
            <span className="text-xs font-medium text-sun-600">{Math.round(((step + 1) / STEPS.length) * 100)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-sand-100">
            <motion.div
              className="h-full rounded-full bg-sun-500"
              initial={{ width: 0 }}
              animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step indicator */}
            <div className="mb-8 text-center">
              <p className="font-display text-2xl italic text-sun-700">{STEPS[step].title}</p>
              <p className="mt-1 text-sm text-stone-500">{STEPS[step].subtitle}</p>
            </div>

            {/* Step 0 — Welcome */}
            {step === 0 && (
              <div className="flex flex-col items-center gap-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-sun-200 to-sun-400 shadow-[0_12px_40px_rgba(201,130,28,0.25)]"
                >
                  <span className="text-5xl">🏆</span>
                </motion.div>
                <div>
                  <p className="text-lg text-ink">
                    Welcome to your personal athletic journey! Your AI coach will guide you every step of the way.
                  </p>
                  <p className="mt-3 text-sm text-stone-500">
                    We&apos;ll ask a few questions to create your personalized training plan.
                  </p>
                </div>
              </div>
            )}

            {/* Step 1 — About You */}
            {step === 1 && (
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-stone-600">Age</label>
                    <input
                      type="number"
                      value={profile.age}
                      onChange={(e) => updateField("age", parseInt(e.target.value) || 0)}
                      className="w-full rounded-xl border border-sand-200 bg-white/80 px-4 py-2.5 text-sm text-ink shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] outline-none transition-all focus:border-sun-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-stone-600">Gender</label>
                    <select
                      value={profile.gender}
                      onChange={(e) => updateField("gender", e.target.value)}
                      className="w-full rounded-xl border border-sand-200 bg-white/80 px-4 py-2.5 text-sm text-ink shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] outline-none transition-all focus:border-sun-400"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-stone-600">Height (cm)</label>
                    <input
                      type="number"
                      value={profile.height}
                      onChange={(e) => updateField("height", parseInt(e.target.value) || 0)}
                      className="w-full rounded-xl border border-sand-200 bg-white/80 px-4 py-2.5 text-sm text-ink shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] outline-none transition-all focus:border-sun-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-stone-600">Weight (kg)</label>
                    <input
                      type="number"
                      value={profile.weight}
                      onChange={(e) => updateField("weight", parseInt(e.target.value) || 0)}
                      className="w-full rounded-xl border border-sand-200 bg-white/80 px-4 py-2.5 text-sm text-ink shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] outline-none transition-all focus:border-sun-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-600">School Grade</label>
                  <input
                    type="text"
                    value={profile.schoolGrade}
                    onChange={(e) => updateField("schoolGrade", e.target.value)}
                    placeholder="e.g. 5th Grade"
                    className="w-full rounded-xl border border-sand-200 bg-white/80 px-4 py-2.5 text-sm text-ink shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] outline-none transition-all focus:border-sun-400"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-600">Current Fitness Level</label>
                  <div className="grid grid-cols-2 gap-2">
                    {FITNESS_LEVELS.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => updateField("fitnessLevel", level.id)}
                        className={cn(
                          "rounded-xl border px-4 py-3 text-sm transition-all",
                          profile.fitnessLevel === level.id
                            ? "border-sun-400 bg-sun-50 text-sun-700"
                            : "border-sand-200 bg-white text-stone-600 hover:border-sun-200"
                        )}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 — Your Sports */}
            {step === 2 && (
              <div className="flex flex-col gap-5">
                <div>
                  <label className="mb-2 block text-xs font-medium text-stone-600">Sports You&apos;re Interested In</label>
                  <div className="flex flex-wrap gap-2">
                    {SPORTS.map((sport) => (
                      <button
                        key={sport.id}
                        onClick={() => toggleArrayField("sportsInterested", sport.id)}
                        className={cn(
                          "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-all",
                          profile.sportsInterested.includes(sport.id)
                            ? "bg-sun-100 text-sun-700 shadow-[0_2px_8px_rgba(201,130,28,0.15)]"
                            : "bg-white text-stone-600 hover:bg-sun-50"
                        )}
                      >
                        <span>{sport.emoji}</span>
                        <span>{sport.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-stone-600">Primary Sport (main focus)</label>
                  <div className="flex flex-wrap gap-2">
                    {profile.sportsInterested.map((sportId) => {
                      const sport = SPORTS.find((s) => s.id === sportId);
                      if (!sport) return null;
                      return (
                        <button
                          key={sportId}
                          onClick={() => updateField("primarySport", sportId)}
                          className={cn(
                            "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-all",
                            profile.primarySport === sportId
                              ? "bg-sun-500 text-white shadow-[0_4px_12px_rgba(201,130,28,0.3)]"
                              : "bg-white text-stone-600 hover:bg-sun-50"
                          )}
                        >
                          <span>{sport.emoji}</span>
                          <span>{sport.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-stone-600">Secondary Sport (optional)</label>
                  <div className="flex flex-wrap gap-2">
                    {profile.sportsInterested.filter((s) => s !== profile.primarySport).map((sportId) => {
                      const sport = SPORTS.find((s) => s.id === sportId);
                      if (!sport) return null;
                      return (
                        <button
                          key={sportId}
                          onClick={() => updateField("secondarySport", profile.secondarySport === sportId ? "" : sportId)}
                          className={cn(
                            "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-all",
                            profile.secondarySport === sportId
                              ? "bg-sun-100 text-sun-700"
                              : "bg-white text-stone-600 hover:bg-sun-50"
                          )}
                        >
                          <span>{sport.emoji}</span>
                          <span>{sport.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 — Experience & Goals */}
            {step === 3 && (
              <div className="flex flex-col gap-5">
                <div>
                  <label className="mb-2 block text-xs font-medium text-stone-600">Experience Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {EXPERIENCE_LEVELS.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => updateField("experienceLevel", level.id)}
                        className={cn(
                          "rounded-xl border px-4 py-3 text-sm transition-all",
                          profile.experienceLevel === level.id
                            ? "border-sun-400 bg-sun-50 text-sun-700"
                            : "border-sand-200 bg-white text-stone-600 hover:border-sun-200"
                        )}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-stone-600">Training Days/Week</label>
                    <input
                      type="number"
                      min={1}
                      max={7}
                      value={profile.trainingDaysPerWeek}
                      onChange={(e) => updateField("trainingDaysPerWeek", parseInt(e.target.value) || 3)}
                      className="w-full rounded-xl border border-sand-200 bg-white/80 px-4 py-2.5 text-sm text-ink shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] outline-none transition-all focus:border-sun-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-stone-600">Available Time</label>
                    <div className="flex flex-wrap gap-1.5">
                      {(["morning", "evening", "weekends"] as TrainingTime[]).map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            const arr = profile.availableTrainingTime;
                            if (arr.includes(t)) updateField("availableTrainingTime", arr.filter((v) => v !== t));
                            else updateField("availableTrainingTime", [...arr, t]);
                          }}
                          className={cn(
                            "rounded-full px-3 py-1.5 text-xs transition-all",
                            profile.availableTrainingTime.includes(t)
                              ? "bg-sun-100 text-sun-700"
                              : "bg-white text-stone-500"
                          )}
                        >
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-stone-600">Your Goals</label>
                  <div className="flex flex-wrap gap-2">
                    {GOAL_OPTIONS.map((goal) => (
                      <button
                        key={goal}
                        onClick={() => toggleArrayField("goals", goal)}
                        className={cn(
                          "rounded-full px-4 py-2 text-sm transition-all",
                          profile.goals.includes(goal)
                            ? "bg-sun-100 text-sun-700 shadow-[0_2px_8px_rgba(201,130,28,0.15)]"
                            : "bg-white text-stone-600 hover:bg-sun-50"
                        )}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-600">Any previous injuries or medical restrictions?</label>
                  <input
                    type="text"
                    value={profile.previousInjuries}
                    onChange={(e) => updateField("previousInjuries", e.target.value)}
                    placeholder="None"
                    className="w-full rounded-xl border border-sand-200 bg-white/80 px-4 py-2.5 text-sm text-ink shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] outline-none transition-all focus:border-sun-400"
                  />
                </div>
              </div>
            )}

            {/* Step 4 — Your Dream */}
            {step === 4 && (
              <div className="flex flex-col gap-5">
                <div>
                  <label className="mb-2 block text-xs font-medium text-stone-600">Who is your dream athlete?</label>
                  <div className="flex flex-wrap gap-2">
                    {DREAM_ATHLETES.map((athlete) => (
                      <button
                        key={athlete}
                        onClick={() => updateField("dreamAthlete", athlete)}
                        className={cn(
                          "rounded-full px-4 py-2 text-sm transition-all",
                          profile.dreamAthlete === athlete
                            ? "bg-sun-500 text-white shadow-[0_4px_12px_rgba(201,130,28,0.3)]"
                            : "bg-white text-stone-600 hover:bg-sun-50"
                        )}
                      >
                        {athlete}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={profile.dreamAthlete}
                    onChange={(e) => updateField("dreamAthlete", e.target.value)}
                    placeholder="Or type another name..."
                    className="mt-3 w-full rounded-xl border border-sand-200 bg-white/80 px-4 py-2.5 text-sm text-ink shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] outline-none transition-all focus:border-sun-400"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-600">Available Equipment</label>
                  <input
                    type="text"
                    value={profile.availableEquipment}
                    onChange={(e) => updateField("availableEquipment", e.target.value)}
                    placeholder="e.g. Football, cones, agility ladder"
                    className="w-full rounded-xl border border-sand-200 bg-white/80 px-4 py-2.5 text-sm text-ink shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] outline-none transition-all focus:border-sun-400"
                  />
                </div>
              </div>
            )}

            {/* Step 5 — All Set! */}
            {step === 5 && (
              <div className="flex flex-col items-center gap-6 text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 150, delay: 0.2 }}
                  className="flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-sun-300 to-sun-500 shadow-[0_16px_48px_rgba(201,130,28,0.3)]"
                >
                  <span className="text-5xl">🏆</span>
                </motion.div>
                <div>
                  <p className="text-lg text-ink">Your athlete profile is ready! 🎉</p>
                  <p className="mt-2 text-sm text-stone-500">
                    Your personal AI coach is setting up your training plan based on your profile.
                  </p>
                  <p className="mt-1 text-sm text-stone-500">
                    Get ready to train like a champion!
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="rounded-full bg-sun-100 px-3 py-1 text-xs text-sun-700">
                    ⚽ {SPORTS.find((s) => s.id === profile.primarySport)?.label ?? profile.primarySport}
                  </span>
                  <span className="rounded-full bg-sun-100 px-3 py-1 text-xs text-sun-700">
                    🎯 {profile.experienceLevel}
                  </span>
                  <span className="rounded-full bg-sun-100 px-3 py-1 text-xs text-sun-700">
                    📅 {profile.trainingDaysPerWeek}x/week
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => step > 0 && setStep((s) => s - 1)}
            className={cn(
              "rounded-xl px-6 py-2.5 text-sm font-medium transition-all",
              step === 0 ? "text-stone-300" : "text-stone-600 hover:bg-sand-100"
            )}
            disabled={step === 0}
          >
            ← Back
          </button>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            disabled={!canProceed()}
            className={cn(
              "rounded-xl px-8 py-2.5 text-sm font-medium text-white transition-all",
              canProceed()
                ? "bg-sun-500 shadow-[0_4px_12px_rgba(201,130,28,0.3)] hover:bg-sun-600"
                : "bg-sand-200 text-stone-400"
            )}
          >
            {step === STEPS.length - 1 ? (saveMutation.isPending ? "Setting up..." : "Start Journey! 🏆") : "Next →"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <RequireRole role="child">
      <OnboardingContent />
    </RequireRole>
  );
}

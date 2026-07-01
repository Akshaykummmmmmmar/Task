"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fetchAthleteProfile, fetchCoachMessages, sendCoachMessage } from "@/lib/mockApi";
import { RequireRole } from "@/components/RequireRole";
import { GreetingHeader } from "@/components/child/GreetingHeader";
import { ClayCard } from "@/components/child/ClayCard";
import { cn } from "@/lib/utils";
import { Sport, CoachMessage } from "@/types";

const SPORT_EMOJIS: Record<string, string> = {
  football: "⚽", running: "🏃", cricket: "🏏", basketball: "🏀",
  badminton: "🏸", swimming: "🏊", athletics: "🎽", volleyball: "🏐",
  martial_arts: "🥋", cycling: "🚴", gymnastics: "🤸",
};

const QUICK_ACTIONS = [
  "What should I focus on today?",
  "I'm feeling tired, motivate me!",
  "Help me with my technique",
  "What should I eat?",
  "How can I improve my speed?",
];

function CoachContent() {
  const { data: profile } = useQuery({
    queryKey: ["athleteProfile"],
    queryFn: fetchAthleteProfile,
  });

  const { data: initialMessages } = useQuery({
    queryKey: ["coachMessages"],
    queryFn: fetchCoachMessages,
  });

  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [input, setInput] = useState("");
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialMessages) setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const coachMutation = useMutation({
    mutationFn: (text: string) => sendCoachMessage((profile?.primarySport ?? "football") as Sport, text),
    onSuccess: (coachMsg) => {
      setMessages((prev) => [...prev, coachMsg]);
    },
  });

  function handleSend(text: string) {
    if (!text.trim()) return;
    const athleteMsg: CoachMessage = {
      id: `a_${Date.now()}`,
      role: "athlete",
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, athleteMsg]);
    setInput("");
    setShowQuickActions(false);
    coachMutation.mutate(text.trim());
  }

  const primarySport = profile?.primarySport ?? "football";
  const sportEmoji = SPORT_EMOJIS[primarySport] ?? "🏆";

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col bg-[#faf7f2] px-4 py-6 sm:px-8 sm:py-10">
      <GreetingHeader childName="Champion" subtitle="Your personal AI coach is here!" className="mb-6" />

      <ClayCard className="flex flex-1 flex-col overflow-hidden p-0">
        {/* Coach header */}
        <div className="flex items-center gap-3 border-b border-sand-200 bg-gradient-to-r from-sun-50 to-sun-100/30 px-5 py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sun-500 text-xl text-white shadow-[0_4px_12px_rgba(201,130,28,0.3)]">
            {sportEmoji}
          </div>
          <div>
            <p className="font-display text-lg italic text-sun-700">AI Coach</p>
            <p className="text-xs text-stone-500">{primarySport.charAt(0).toUpperCase() + primarySport.slice(1)} Coach</p>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4" style={{ maxHeight: "calc(100vh - 380px)" }}>
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "flex",
                msg.role === "athlete" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  msg.role === "athlete"
                    ? "bg-sun-500 text-white shadow-[0_4px_12px_rgba(201,130,28,0.2)]"
                    : "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-sand-100 text-ink"
                )}
              >
                {msg.role === "coach" && (
                  <span className="mb-1 block text-xs font-medium text-sun-600">🏆 Coach</span>
                )}
                {msg.text}
              </div>
            </motion.div>
          ))}
          {coachMutation.isPending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <span className="h-2 w-2 animate-bounce rounded-full bg-sun-500" style={{ animationDelay: "0s" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-sun-500" style={{ animationDelay: "0.2s" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-sun-500" style={{ animationDelay: "0.4s" }} />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick actions */}
        {showQuickActions && messages.length <= 4 && (
          <div className="flex flex-wrap gap-2 border-t border-sand-200 px-5 py-3">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action}
                onClick={() => handleSend(action)}
                className="rounded-full border border-sun-200 bg-sun-50/50 px-3 py-1.5 text-xs text-sun-700 transition-all hover:bg-sun-100 hover:shadow-[0_2px_8px_rgba(201,130,28,0.1)]"
              >
                {action}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        <div className="border-t border-sand-200 px-5 py-3">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            className="flex gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your coach anything..."
              className="flex-1 rounded-xl border border-sand-200 bg-white/80 px-4 py-2.5 text-sm text-ink shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] outline-none transition-all focus:border-sun-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || coachMutation.isPending}
              className={cn(
                "rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-all",
                input.trim() && !coachMutation.isPending
                  ? "bg-sun-500 shadow-[0_4px_12px_rgba(201,130,28,0.3)] hover:bg-sun-600"
                  : "bg-sand-200 text-stone-400"
              )}
            >
              Send
            </button>
          </form>
        </div>
      </ClayCard>
    </div>
  );
}

export default function CoachPage() {
  return (
    <RequireRole role="child">
      <CoachContent />
    </RequireRole>
  );
}

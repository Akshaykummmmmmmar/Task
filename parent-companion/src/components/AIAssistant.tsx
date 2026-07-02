"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { AIMessage, AIInsight, AIInsightType } from "@/types";
import { generateResponse, generateInitialInsights, AIContext } from "@/lib/aiAgent";
import {
  fetchParent,
  fetchChildren,
  fetchChildSummary,
  fetchReminders,
  fetchActivity,
  fetchWeeklyPlan,
} from "@/lib/mockApi";
import { SparkleIcon, CloseIcon } from "./icons";
import { cn } from "@/lib/utils";
import { getWelcomeGuideIntro } from "@/lib/appGuide";

interface AIAssistantProps {
  open: boolean;
  onClose: () => void;
}

const CHILD_SUGGESTIONS = [
  "How is Riya doing today?",
  "What needs attention?",
  "Any recommendations?",
  "How are the studies going?",
  "Health check",
];

const GUIDE_SUGGESTIONS = [
  "How do I assign study?",
  "How to log medicine?",
  "How do reminders work?",
  "What does this app do?",
  "How to manage children?",
];

type ChatMode = "child" | "guide";

function generateId() {
  return `msg_${Math.random().toString(36).slice(2, 9)}`;
}

export function AIAssistant({ open, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>("child");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: parent } = useQuery({ queryKey: ["parent"], queryFn: fetchParent });
  const { data: children } = useQuery({ queryKey: ["children"], queryFn: fetchChildren });
  const child = children?.[0];

  const { data: summary } = useQuery({
    queryKey: ["summary", child?.id],
    queryFn: () => fetchChildSummary(child!.id),
    enabled: !!child,
  });

  const { data: reminders } = useQuery({ queryKey: ["reminders"], queryFn: fetchReminders });

  const { data: activity } = useQuery({
    queryKey: ["activity", child?.id],
    queryFn: () => fetchActivity(child!.id),
    enabled: !!child,
  });

  const { data: weeklyPlan } = useQuery({ queryKey: ["weeklyPlan"], queryFn: fetchWeeklyPlan });

  const context: AIContext = {
    parent,
    child,
    summary,
    reminders: reminders ?? [],
    activity: activity ?? [],
    weeklyPlan,
  };

  useEffect(() => {
    if (open && !hasInitialized) {
      setHasInitialized(true);
      const generatedInsights = generateInitialInsights(context);
      setInsights(generatedInsights);

      const welcomeMsg: AIMessage = {
        id: generateId(),
        role: "assistant",
        content: generateResponse("hello", context),
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMsg]);
    }
  }, [open, hasInitialized, context]);

  function switchMode(mode: ChatMode) {
    if (mode === chatMode) return;
    setChatMode(mode);

    const welcome =
      mode === "guide"
        ? getWelcomeGuideIntro()
        : generateResponse("hello", context);

    const msg: AIMessage = {
      id: generateId(),
      role: "assistant",
      content: welcome,
      timestamp: new Date().toISOString(),
    };
    setMessages([msg]);
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim() || thinking) return;

    const userMsg: AIMessage = {
      id: generateId(),
      role: "user",
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setThinking(true);

    setTimeout(() => {
      const response = generateResponse(text.trim(), context);
      const aiMsg: AIMessage = {
        id: generateId(),
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setThinking(false);
    }, 600 + Math.random() * 400);
  }, [thinking, context]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  const insightStyles: Record<AIInsightType, { container: string; icon: string; label: string }> = {
    praise: {
      container: "border-sage-300 bg-sage-50/60",
      icon: "text-sage-600",
      label: "Praise",
    },
    alert: {
      container: "border-coral-200 bg-coral-50/60",
      icon: "text-coral-600",
      label: "Alert",
    },
    suggestion: {
      container: "border-sky-300 bg-sky-50/60",
      icon: "text-sky-600",
      label: "Suggestion",
    },
    tip: {
      container: "border-sun-300 bg-sun-50/60",
      icon: "text-sun-600",
      label: "Tip",
    },
  };

  const panelTranslate = open ? "translate-x-0" : "translate-x-full";

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-ink/20 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed bottom-0 right-0 z-50 flex h-full w-full flex-col bg-paper shadow-2xl transition-transform duration-300 ease-out sm:w-[420px]",
          panelTranslate
        )}
      >
        {/* Header */}
        <div className="flex flex-shrink-0 flex-col border-b border-sand-300/70">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-500">
                <SparkleIcon className="h-4 w-4 text-white" />
              </span>
              <span className="font-display text-lg italic text-ink">AI Co-pilot</span>
            </div>
            <button
              onClick={onClose}
              className="focus-ring flex h-9 w-9 items-center justify-center rounded-full text-stone-500 hover:bg-sand-100"
              aria-label="Close AI assistant"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Mode toggle */}
          <div className="flex gap-1 px-5 pb-3">
            <button
              onClick={() => switchMode("child")}
              className={`focus-ring rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                chatMode === "child"
                  ? "bg-sage-100 text-sage-700"
                  : "text-stone-500 hover:bg-sand-100 hover:text-ink"
              }`}
            >
              Child Status
            </button>
            <button
              onClick={() => switchMode("guide")}
              className={`focus-ring rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                chatMode === "guide"
                  ? "bg-sky-100 text-sky-700"
                  : "text-stone-500 hover:bg-sand-100 hover:text-ink"
              }`}
            >
              App Guide
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {chatMode === "child" && insights.length > 0 && (
            <div className="flex-shrink-0 overflow-x-auto border-b border-sand-300/50 px-4 py-3">
              <div className="flex gap-3">
                {insights.map((insight) => {
                  const style = insightStyles[insight.type];
                  return (
                    <div
                      key={insight.id}
                      className={cn(
                        "flex w-52 flex-shrink-0 flex-col gap-1.5 rounded-xl border p-3.5",
                        style.container
                      )}
                    >
                      <span className={cn("text-xs font-semibold uppercase tracking-wider", style.icon)}>
                        {style.label}
                      </span>
                      <p className="text-sm font-medium text-ink">{insight.title}</p>
                      <p className="text-xs leading-relaxed text-stone-600">{insight.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto overscroll-none px-4 py-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn("mb-3 flex", msg.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-sage-500 text-white"
                      : "border border-sand-300 bg-white text-ink"
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {thinking && (
              <div className="mb-3 flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl border border-sand-300 bg-white px-4 py-3">
                  <span className="flex h-2 w-2 animate-bounce rounded-full bg-sage-500" style={{ animationDelay: "0ms" }} />
                  <span className="flex h-2 w-2 animate-bounce rounded-full bg-sage-500" style={{ animationDelay: "150ms" }} />
                  <span className="flex h-2 w-2 animate-bounce rounded-full bg-sage-500" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {messages.length <= 2 && (
            <div className="flex-shrink-0 border-t border-sand-300/50 px-4 py-3">
              <div className="flex flex-wrap gap-2">
                {(chatMode === "guide" ? GUIDE_SUGGESTIONS : CHILD_SUGGESTIONS).map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    className="focus-ring rounded-full border border-sage-200 bg-white/70 px-3.5 py-1.5 text-xs text-sage-700 transition-colors hover:bg-sage-100 hover:text-sage-800"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex-shrink-0 border-t border-sand-300/70 px-4 py-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                disabled={thinking}
                className="flex-1 rounded-xl border border-sand-300 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-stone-400 focus:border-sage-400 focus:outline-none focus:ring-1 focus:ring-sage-200 disabled:opacity-50"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || thinking}
                className="focus-ring flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-sage-500 text-white transition-colors hover:bg-sage-600 disabled:opacity-50"
                aria-label="Send message"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

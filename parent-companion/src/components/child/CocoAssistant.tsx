"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CocoAvatar } from "./CocoAvatar";

interface Message {
  role: "user" | "coco";
  text: string;
}

function SpeechIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="9" y="2" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 11a7 7 0 0014 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 18v4M9 22h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function CocoAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "coco", text: "Hi! I'm Coco 🥥 Ask me about your tasks, weekly plan, health, or passions!" },
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.1;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const handleQuery = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: query.trim() }]);
    setInput("");
    setLoading(true);

    try {
      const { cocoRespond } = await import("./cocoEngine");
      const response = await cocoRespond(query.trim());
      setMessages((prev) => [...prev, { role: "coco", text: response.text }]);
      if (response.audioText) speak(response.audioText);
      else speak(response.text);
    } catch {
      setMessages((prev) => [...prev, { role: "coco", text: "Sorry, I had trouble processing that. Try again!" }]);
    } finally {
      setLoading(false);
    }
  }, [speak]);

  const startListening = useCallback(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setMessages((prev) => [...prev, { role: "coco", text: "Voice recognition isn't supported in your browser. Try typing instead!" }]);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
      handleQuery(transcript);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [handleQuery]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, []);

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-violet-500 text-white shadow-[0_8px_24px_rgba(45,42,38,0.15),0_-4px_12px_rgba(255,255,255,0.5)] transition-all hover:shadow-[0_12px_32px_rgba(45,42,38,0.2),0_-6px_16px_rgba(255,255,255,0.6)]"
        aria-label={open ? "Close Coco" : "Open Coco"}
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
            <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        ) : (
          <CocoAvatar size="sm" mood="idle" className="text-white" />
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 flex w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/90 shadow-[0_16px_48px_rgba(45,42,38,0.12),0_-8px_24px_rgba(255,255,255,0.7)] backdrop-blur-xl sm:w-[400px]"
            style={{ maxHeight: "min(600px, calc(100vh - 180px))" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-pink-400 to-violet-500 px-5 py-4 text-white">
              <CocoAvatar size="md" mood={listening ? "listening" : speaking ? "speaking" : loading ? "thinking" : "idle"} className="text-white" />
              <div className="flex-1">
                <p className="font-display text-base italic font-medium">Coco</p>
                <p className="text-xs text-white/70">
                  {listening ? "Listening..." : speaking ? "Speaking..." : loading ? "Thinking..." : "Your voice assistant"}
                </p>
              </div>
              {(listening || speaking) && (
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white" style={{ animationDelay: "0s" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white" style={{ animationDelay: "0.15s" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white" style={{ animationDelay: "0.3s" }} />
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4" style={{ maxHeight: "360px" }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-pink-400 to-violet-500 text-white shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
                        : "bg-white shadow-[0_2px_8px_rgba(45,42,38,0.06),0_-1px_4px_rgba(255,255,255,0.5)] border border-sand-200/50 text-ink"
                    }`}
                  >
                    {msg.text.split("\n").map((line, j) => (
                      <p key={j} className={j > 0 ? "mt-1" : ""}>
                        {line}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-3 flex justify-start"
                >
                  <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-[0_2px_8px_rgba(45,42,38,0.06)] border border-sand-200/50">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-pink-400" style={{ animationDelay: "0s" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400" style={{ animationDelay: "0.15s" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-pink-400" style={{ animationDelay: "0.3s" }} />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 border-t border-sand-200/50 bg-white/50 px-4 py-3">
              <button
                onClick={listening ? stopListening : startListening}
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-all ${
                  listening ? "bg-clay-500 text-white shadow-[0_0_0_4px_rgba(201,116,92,0.3)]" : "bg-sand-100 text-stone-500 hover:bg-sand-200"
                }`}
                aria-label={listening ? "Stop listening" : "Start voice input"}
              >
                <SpeechIcon className="h-4 w-4" />
              </button>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) handleQuery(input);
                }}
                placeholder={listening ? "Listening..." : "Ask Coco something..."}
                className="flex-1 rounded-full border border-sand-200 bg-white/70 px-4 py-2 text-sm text-ink outline-none placeholder:text-stone-400 focus:border-pink-300 focus:ring-2 focus:ring-pink-200"
                disabled={listening || loading}
              />
              <button
                onClick={() => handleQuery(input)}
                disabled={!input.trim() || loading || listening}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-violet-500 text-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] disabled:opacity-40"
                aria-label="Send message"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CocoAvatarProps {
  size?: "sm" | "md" | "lg";
  mood?: "idle" | "listening" | "speaking" | "thinking";
  className?: string;
}

function Eyes() {
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 2500 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <g>
      <g opacity={blink ? 0 : 1}>
        {/* Left eye */}
        <ellipse cx="22" cy="22" rx="5.5" ry="6" fill="#2D2A26" />
        <ellipse cx="22" cy="22" rx="4.5" ry="5" fill="#6B21A8" />
        <ellipse cx="21" cy="21" rx="2.5" ry="2.5" fill="#A855F7" />
        <circle cx="19" cy="19" r="1.5" fill="white" />
        {/* Right eye */}
        <ellipse cx="38" cy="22" rx="5.5" ry="6" fill="#2D2A26" />
        <ellipse cx="38" cy="22" rx="4.5" ry="5" fill="#6B21A8" />
        <ellipse cx="37" cy="21" rx="2.5" ry="2.5" fill="#A855F7" />
        <circle cx="35" cy="19" r="1.5" fill="white" />
        {/* Eyebrows */}
        <path d="M15 16q7-3 12 0" stroke="#2D2A26" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M33 16q7-3 12 0" stroke="#2D2A26" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      </g>
      {/* Blink closed */}
      <g opacity={blink ? 1 : 0}>
        <path d="M16 22h12" stroke="#2D2A26" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M32 22h12" stroke="#2D2A26" strokeWidth="1.8" strokeLinecap="round" />
      </g>
    </g>
  );
}

function Mouth({ isSpeaking }: { isSpeaking: boolean }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!isSpeaking) { setOpen(false); return; }
    const interval = setInterval(() => setOpen((v) => !v), 180);
    return () => clearInterval(interval);
  }, [isSpeaking]);
  if (!isSpeaking) {
    return <path d="M26 32c2 2 6 2 8 0" stroke="#2D2A26" strokeWidth="1.3" strokeLinecap="round" fill="none" />;
  }
  return <ellipse cx="30" cy="32" rx={open ? 3 : 1.5} ry={open ? 2.5 : 1} fill="#2D2A26" />;
}

function Sparkles() {
  return (
    <g>
      <path d="M8 12l1 2h2l-1.5 1L11 17l-2-1-2 1 .5-2L6 14h2l1-2z" className="fill-violet-300" />
      <path d="M52 6l0.7 1.5h1.5l-1.2 1 0.5 2-1.5-0.8-1.5 0.8 0.5-2-1.2-1h1.5L52 6z" className="fill-pink-300" />
      <circle cx="56" cy="24" r="1.5" className="fill-violet-200" />
      <circle cx="4" cy="28" r="1" className="fill-pink-200" />
    </g>
  );
}

function WavingArm() {
  return (
    <motion.g
      animate={{ rotate: [0, -15, 0, -15, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "48px 42px" }}
    >
      {/* Upper arm */}
      <path d="M48 40l10-8" stroke="#FDE68A" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Lower arm */}
      <path d="M58 32l6-10" stroke="#FDE68A" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Hand */}
      <circle cx="64" cy="22" r="3" className="fill-amber-100" />
      {/* Fingers */}
      <path d="M62 19l-1-3" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M64 18l0-4" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M66 19l1-3" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
    </motion.g>
  );
}

export function CocoAvatar({ size = "md", mood = "idle", className = "" }: CocoAvatarProps) {
  const sizes = { sm: 40, md: 56, lg: 80 };
  const dim = sizes[size];

  const y = mood === "idle" ? [0, -2, 0] : mood === "listening" || mood === "thinking" ? [0, -1, 0, -1, 0] : 0;
  const rotate = mood === "listening" ? [0, -2, 2, -1, 1, 0] : undefined;
  const scale = mood === "speaking" ? [1, 1.02, 1] : undefined;

  return (
    <motion.svg
      viewBox="0 0 60 80"
      width={dim}
      height={dim * (80 / 60)}
      animate={{ y, rotate, scale }}
      transition={{ duration: mood === "idle" ? 2.5 : 0.8, repeat: Infinity, ease: "easeInOut" }}
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <Sparkles />

      {/* Shadow under feet */}
      <ellipse cx="30" cy="78" rx="12" ry="2" className="fill-stone-300/50" />

      {/* Legs */}
      <rect x="24" y="64" width="10" height="12" rx="3" className="fill-violet-100" />
      <rect x="14" y="64" width="10" height="12" rx="3" className="fill-violet-100" />
      {/* Shoes */}
      <ellipse cx="19" cy="76" rx="6" ry="3" className="fill-pink-400" />
      <ellipse cx="29" cy="76" rx="6" ry="3" className="fill-pink-400" />

      {/* Skirt */}
      <path d="M12 50q-2 12 0 16h36q2-4 0-16z" className="fill-pink-300/80" />
      <path d="M12 50q18 4 36 0" className="fill-pink-400/30" />

      {/* Body / Torso */}
      <rect x="17" y="36" width="26" height="18" rx="6" className="fill-white stroke-pink-200" strokeWidth="1" />
      {/* Collar / bow */}
      <path d="M22 36l8 8 8-8" className="fill-pink-300" />
      <circle cx="30" cy="40" r="2" className="fill-pink-400" />

      {/* Left arm */}
      <path d="M17 40l-8 6" stroke="#FDE68A" strokeWidth="4" strokeLinecap="round" fill="none" />
      <circle cx="9" cy="48" r="3" className="fill-amber-100" />

      {/* Right arm (waving) */}
      <WavingArm />

      {/* Neck */}
      <rect x="27" y="34" width="6" height="4" rx="2" className="fill-amber-100" />

      {/* Head */}
      <ellipse cx="30" cy="20" rx="16" ry="15" className="fill-amber-100" />

      {/* Hair base */}
      <path d="M14 18q0-12 16-14 16 2 16 14" className="fill-violet-400" />
      {/* Hair bangs */}
      <path d="M14 18q4-8 10-6q2-4 6-2q4-2 6 2q6-2 10 6" className="fill-pink-400" />
      {/* Side hair */}
      <path d="M14 18q-2 8 0 18" stroke="#A855F7" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M46 18q2 8 0 18" stroke="#A855F7" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Twin tails */}
      <path d="M15 22q-8 6-10 18" className="fill-violet-300" />
      <path d="M45 22q8 6 10 18" className="fill-violet-300" />
      <circle cx="6" cy="40" r="2.5" className="fill-pink-300" />
      <circle cx="54" cy="40" r="2.5" className="fill-pink-300" />

      {/* Cheeks */}
      <circle cx="17" cy="26" r="3" className="fill-pink-200/60" />
      <circle cx="43" cy="26" r="3" className="fill-pink-200/60" />

      {/* Eyes */}
      <Eyes />

      {/* Mouth */}
      <Mouth isSpeaking={mood === "speaking"} />

      {/* Thinking bubble */}
      {mood === "thinking" && (
        <g>
          <path d="M50 10l1 1.5h1.5l-1.2 1 0.5 2-1.3-0.8-1.3 0.8 0.5-2-1.2-1H49l1-1.5z" className="fill-amber-300" />
          <circle cx="46" cy="14" r="1.5" className="fill-amber-200" />
          <circle cx="42" cy="17" r="1" className="fill-amber-100" />
        </g>
      )}

      {/* Listening waves */}
      {mood === "listening" && (
        <g opacity={0.4}>
          <motion.path
            d="M8 20q-4 6 0 12"
            stroke="#EC4899"
            strokeWidth="1.5"
            strokeLinecap="round"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.path
            d="M52 20q4 6 0 12"
            stroke="#A855F7"
            strokeWidth="1.5"
            strokeLinecap="round"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
          />
        </g>
      )}
    </motion.svg>
  );
}

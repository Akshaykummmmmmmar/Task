"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LogoutIcon } from "@/components/icons";
import { useSession } from "@/lib/session";
import { useRouter } from "next/navigation";

interface GreetingHeaderProps {
  childName?: string;
  subtitle: string;
  className?: string;
}

export function GreetingHeader({ childName, subtitle, className }: GreetingHeaderProps) {
  const { setSession } = useSession();
  const router = useRouter();

  function handleLogout() {
    setSession(null);
    router.push("/");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("flex items-center justify-between", className)}
    >
      <div>
        <h1 className="font-display text-2xl italic text-ink sm:text-3xl">
          Hi, {childName ?? "there"}! 👋
        </h1>
        <p className="mt-1 text-sm text-stone-500">{subtitle}</p>
      </div>
      <button
        onClick={handleLogout}
        aria-label="Log out"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 shadow-[0_4px_12px_rgba(45,42,38,0.06),0_-2px_6px_rgba(255,255,255,0.5)] transition-all hover:shadow-[0_6px_16px_rgba(45,42,38,0.1),0_-2px_8px_rgba(255,255,255,0.7)]"
      >
        <LogoutIcon className="h-4.5 w-4.5 text-stone-500" />
      </button>
    </motion.div>
  );
}

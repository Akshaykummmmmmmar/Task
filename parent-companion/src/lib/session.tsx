"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@/types";

const STORAGE_KEY = "parent-companion:session";

interface SessionContextValue {
  session: Session | null;
  setSession: (session: Session | null) => void;
  ready: boolean;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setSessionState(JSON.parse(raw));
    } catch {
      // sessionStorage unavailable — proceed without a restored session
    }
    setReady(true);
  }, []);

  function setSession(next: Session | null) {
    setSessionState(next);
    try {
      if (next) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage errors in restrictive environments
    }
  }

  return (
    <SessionContext.Provider value={{ session, setSession, ready }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}

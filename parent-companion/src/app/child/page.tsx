"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ChildShell } from "@/components/ChildShell";
import { RequireRole } from "@/components/RequireRole";
import { GamesIcon, PassionIcon, StudyIcon } from "@/components/icons";
import { fetchChildById } from "@/lib/mockApi";
import { useSession } from "@/lib/session";

function HealthIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 21.5C12 21.5 4 16 4 10.5 4 7 7 4.5 12 4.5c5 0 8 2.5 8 6 0 5.5-8 11-8 11z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M9 10.5h6M12 7.5v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function DashboardCard({
  title,
  description,
  icon,
  href,
  borderColor,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  borderColor: string;
}) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(href)}
      className={`focus-ring flex items-center gap-5 rounded-[24px] border-2 border-transparent bg-white p-6 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] ${borderColor}`}
    >
      <span className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-soft">
        {icon}
      </span>
      <div className="flex-1">
        <h2 className="font-display text-2xl italic text-ink">{title}</h2>
        <p className="mt-1 text-sm text-stone-500">{description}</p>
      </div>
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 flex-shrink-0 text-stone-400">
        <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function ChildContent() {
  const { session } = useSession();
  const childId = session?.childId;

  const { data: child } = useQuery({
    queryKey: ["child", childId],
    queryFn: () => fetchChildById(childId!),
    enabled: !!childId,
  });

  return (
    <ChildShell child={child}>
      <div className="flex flex-col gap-5">
        <DashboardCard
          title="Study"
          description="View and complete your study tasks"
          icon={<StudyIcon className="h-8 w-8 text-sun-600" />}
          href="/child/study"
          borderColor="hover:border-sun-300"
        />
        <DashboardCard
          title="Health"
          description="View and complete your health tasks"
          icon={<HealthIcon className="h-8 w-8 text-sage-600" />}
          href="/child/health"
          borderColor="hover:border-sage-300"
        />
        <DashboardCard
          title="Activities"
          description="Games, puzzles and fun activities"
          icon={<GamesIcon className="h-8 w-8 text-coral-600" />}
          href="/child/activities"
          borderColor="hover:border-coral-300"
        />
        <DashboardCard
          title="Passion & Talent"
          description="Explore your interests and build skills"
          icon={<PassionIcon className="h-8 w-8 text-violet-600" />}
          href="/child/passion"
          borderColor="hover:border-violet-300"
        />
      </div>
    </ChildShell>
  );
}

export default function ChildPage() {
  return (
    <RequireRole role="child">
      <ChildContent />
    </RequireRole>
  );
}

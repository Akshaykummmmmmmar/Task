import { ChildSummary } from "@/types";
import { MealIcon, SupplementIcon, AppointmentIcon, AssessmentIcon, StudyIcon } from "./icons";
import { cn, formatFull } from "@/lib/utils";

function Card({
  icon,
  label,
  value,
  detail,
  accent,
  progress,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
  accent: "sage" | "clay" | "stone";
  progress?: number; // 0-1, renders a thin progress bar when provided
}) {
  const tint =
    accent === "sage"
      ? "bg-sage-50 text-sage-700"
      : accent === "clay"
      ? "bg-clay-50 text-clay-700"
      : "bg-sand-100 text-stone-600";

  const barColor =
    accent === "sage" ? "bg-sage-500" : accent === "clay" ? "bg-clay-500" : "bg-stone-500";

  return (
    <div className="group rounded-card border border-sand-300 bg-white/70 p-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-sand-300 hover:shadow-[0_8px_24px_rgba(45,42,38,0.09)]">
      <div
        className={cn(
          "mb-4 flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-105",
          tint
        )}
      >
        {icon}
      </div>
      <p className="text-sm text-stone-500">{label}</p>
      <p className="mt-1 font-display text-2xl italic text-ink">{value}</p>
      <p className="mt-1 text-xs text-stone-400">{detail}</p>
      {typeof progress === "number" && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-sand-200">
          <div
            className={cn("h-full rounded-full transition-all duration-500", barColor)}
            style={{ width: `${Math.min(Math.max(progress, 0), 1) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}

export function SummaryCards({ summary }: { summary: ChildSummary }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <Card
        icon={<MealIcon className="h-4.5 w-4.5" />}
        label="Meals logged"
        value={`${summary.meals.logged} of ${summary.meals.target}`}
        detail="So far today"
        accent="sage"
        progress={summary.meals.target > 0 ? summary.meals.logged / summary.meals.target : undefined}
      />
      <Card
        icon={<SupplementIcon className="h-4.5 w-4.5" />}
        label="Supplements"
        value={`${summary.supplements.taken} of ${summary.supplements.scheduled}`}
        detail="Taken today"
        accent="clay"
        progress={
          summary.supplements.scheduled > 0
            ? summary.supplements.taken / summary.supplements.scheduled
            : undefined
        }
      />
      <Card
        icon={<StudyIcon className="h-4.5 w-4.5" />}
        label="Study tasks"
        value={`${summary.study.completed} of ${summary.study.assigned}`}
        detail="Completed this week"
        accent="sage"
        progress={summary.study.assigned > 0 ? summary.study.completed / summary.study.assigned : undefined}
      />
      <Card
        icon={<AppointmentIcon className="h-4.5 w-4.5" />}
        label="Next appointment"
        value={summary.nextAppointment ? summary.nextAppointment.title : "None scheduled"}
        detail={
          summary.nextAppointment ? formatFull(summary.nextAppointment.datetime) : "—"
        }
        accent="stone"
      />
      <Card
        icon={<AssessmentIcon className="h-4.5 w-4.5" />}
        label="Pending assessments"
        value={String(summary.pendingAssessments)}
        detail={summary.pendingAssessments > 0 ? "Needs attention" : "All caught up"}
        accent="sage"
      />
    </div>
  );
}

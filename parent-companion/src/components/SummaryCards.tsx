import { ChildSummary } from "@/types";
import { MealIcon, SupplementIcon, AppointmentIcon, AssessmentIcon, StudyIcon } from "./icons";
import { cn, formatFull } from "@/lib/utils";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function DoughnutCard({
  icon,
  label,
  completed,
  target,
  detail,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  completed: number;
  target: number;
  detail: string;
  accent: "sage" | "clay" | "stone";
}) {
  const tint =
    accent === "sage"
      ? "bg-sage-50 text-sage-700"
      : accent === "clay"
      ? "bg-clay-50 text-clay-700"
      : "bg-sand-100 text-stone-600";

  const chartColors =
    accent === "sage"
      ? ["#34D399", "#D1FAE5"]
      : accent === "clay"
      ? ["#F59E0B", "#FEF3C7"]
      : ["#6B7280", "#E5E7EB"];

  const data = {
    datasets: [
      {
        data: [completed, Math.max(target - completed, 0)],
        backgroundColor: chartColors,
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "80%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="group rounded-card border border-sand-300 bg-white/70 p-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-sand-300 hover:shadow-[0_8px_24px_rgba(45,42,38,0.09)] relative">
      <div className={cn("mb-4 flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-105", tint)}>
        {icon}
      </div>
      <p className="text-sm text-stone-500">{label}</p>
      <div className="relative h-32">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex items-center justify-center text-lg font-medium text-ink">{completed}/{target}</div>
      </div>
      <p className="mt-1 text-xs text-stone-400">{detail}</p>
    </div>
  );
}

export function SummaryCards({ summary }: { summary: ChildSummary }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <DoughnutCard
        icon={<MealIcon className="h-4.5 w-4.5" />}
        label="Meals logged"
        completed={summary.meals.logged}
        target={summary.meals.target}
        detail="So far today"
        accent="sage"
      />
      <DoughnutCard
        icon={<SupplementIcon className="h-4.5 w-4.5" />}
        label="Meds & Supplements"
        completed={summary.supplements.taken}
        target={summary.supplements.scheduled}
        detail="Taken today"
        accent="clay"
      />
      <DoughnutCard
        icon={<StudyIcon className="h-4.5 w-4.5" />}
        label="Study tasks"
        completed={summary.study.completed}
        target={summary.study.assigned}
        detail="Completed this week"
        accent="sage"
      />
        <DoughnutCard
          icon={<AppointmentIcon className="h-4.5 w-4.5" />}
          label="Next appointment"
          completed={summary.nextAppointment ? 1 : 0}
          target={1}
          detail={summary.nextAppointment ? formatFull(summary.nextAppointment.datetime) : "—"}
          accent="stone"
        />
        <DoughnutCard
          icon={<AssessmentIcon className="h-4.5 w-4.5" />}
          label="Pending assessments"
          completed={summary.pendingAssessments}
          target={summary.pendingAssessments}
          detail={summary.pendingAssessments > 0 ? "Needs attention" : "All caught up"}
          accent="sage"
        />
    </div>
  );
}

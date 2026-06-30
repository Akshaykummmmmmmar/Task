import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { ActivityItem } from "@/types";
import { cn } from "@/lib/utils";

ChartJS.register(ArcElement, Tooltip, Legend);

interface ActivityDoughnutProps {
  items: ActivityItem[];
  accent?: "sage" | "clay" | "stone";
}

export function ActivityDoughnut({ items, accent = "sage" }: ActivityDoughnutProps) {
  // Count activity kinds
  const counts: Record<string, number> = {};
  items.forEach((it) => {
    counts[it.kind] = (counts[it.kind] ?? 0) + 1;
  });
  const labels = Object.keys(counts);
  const dataValues = labels.map((k) => counts[k]);

  const chartColors =
    accent === "sage"
      ? ["#34D399", "#F59E0B", "#6B7280"]
      : accent === "clay"
      ? ["#F59E0B", "#34D399", "#6B7280"]
      : ["#6B7280", "#34D399", "#F59E0B"];

  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: chartColors.slice(0, dataValues.length),
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "80%",
    plugins: {
      legend: { display: true, position: "bottom" as const },
      tooltip: { enabled: true },
    },
    maintainAspectRatio: false,
  };

  const total = items.length;

  return (
    <div className="group rounded-card border border-sand-300 bg-white/70 p-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-sand-300 hover:shadow-[0_8px_24px_rgba(45,42,38,0.09)] relative">
      <div className="text-sm text-stone-500 mb-2">Activity distribution</div>
      <div className="relative h-32">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex items-center justify-center text-lg font-medium text-ink">
          {total}
        </div>
      </div>
    </div>
  );
}

import { ActivityItem } from "@/types";
import { MealIcon, SupplementIcon } from "./icons";
import { formatFull } from "@/lib/utils";

function ActivityIcon({ kind }: { kind: ActivityItem["kind"] }) {
  if (kind === "meal") return <MealIcon className="h-4 w-4" />;
  if (kind === "supplement") return <SupplementIcon className="h-4 w-4" />;
  return <span className="block h-1.5 w-1.5 rounded-full bg-stone-400" />;
}

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  const sorted = [...items].sort(
    (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
  );

  return (
    <div className="rounded-card border border-sand-300 bg-white/70 p-6 shadow-soft">
      <h2 className="mb-5 font-display text-lg italic text-ink">Recent activity</h2>
      {sorted.length === 0 ? (
        <p className="text-sm text-stone-400">Nothing logged yet today.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {sorted.map((item) => (
            <li key={item.id} className="flex gap-3">
              <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-sand-100 text-stone-500">
                <ActivityIcon kind={item.kind} />
              </span>
              <div>
                <p className="text-sm text-ink">{item.label}</p>
                <p className="mt-0.5 text-xs text-stone-400">
                  {formatFull(item.occurredAt)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

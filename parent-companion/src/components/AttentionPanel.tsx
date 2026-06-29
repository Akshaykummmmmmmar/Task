import { Reminder } from "@/types";
import { TYPE_ICON, AlertIcon } from "./icons";
import { formatFull, TYPE_LABEL } from "@/lib/utils";

function describeMiss(r: Reminder, childName: string) {
  if (r.type === "study") {
    return `${childName} hasn't completed ${r.subject ?? "study"}${
      r.topic ? ` — ${r.topic}` : ""
    }`;
  }
  return `${childName} hasn't completed "${r.title}"`;
}

export function AttentionPanel({
  overdue,
  childName,
}: {
  overdue: Reminder[];
  childName: string;
}) {
  if (overdue.length === 0) {
    return (
      <div className="rounded-card border border-sage-100 bg-sage-50/60 p-5">
        <p className="text-sm text-sage-700">
          Nothing needs your attention right now — {childName} is on track.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-clay-300 bg-clay-50/70 p-5 shadow-soft">
      <div className="mb-4 flex items-center gap-2">
        <AlertIcon className="h-4.5 w-4.5 text-clay-600" />
        <h2 className="font-display text-lg italic text-clay-700">
          Needs your attention
        </h2>
        <span className="ml-auto rounded-full bg-clay-500 px-2.5 py-0.5 text-xs font-medium text-paper">
          {overdue.length}
        </span>
      </div>
      <ul className="flex flex-col gap-3">
        {overdue.map((r) => {
          const Icon = TYPE_ICON[r.type];
          return (
            <li
              key={r.id}
              className="flex items-start gap-3 rounded-lg bg-white/70 px-3.5 py-3"
            >
              <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-clay-100 text-clay-700">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-medium text-ink">
                  {describeMiss(r, childName)}
                </p>
                <p className="mt-0.5 text-xs text-stone-400">
                  {TYPE_LABEL[r.type]} · was due {formatFull(r.dueAt)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

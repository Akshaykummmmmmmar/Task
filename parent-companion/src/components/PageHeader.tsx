import { Child, Parent } from "@/types";

export function PageHeader({
  parent,
  child,
  title,
  subtitle,
}: {
  parent?: Parent;
  child?: Child;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-display text-[28px] italic leading-tight text-ink md:text-[32px]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 text-[15px] text-stone-500">{subtitle}</p>
        )}
      </div>

      {child && (
        <div className="flex items-center gap-3 rounded-full border border-sand-300 bg-white/60 py-1.5 pl-1.5 pr-4 shadow-soft">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-clay-100 text-sm font-medium text-clay-700">
            {child.avatarInitials}
          </span>
          <div className="leading-tight">
            <p className="text-sm font-medium text-ink">{child.name}</p>
            <p className="text-xs text-stone-400">
              {parent ? `Linked to ${parent.name}` : "Linked child"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

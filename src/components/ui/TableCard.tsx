import type { LucideIcon } from "lucide-react";
import { cardClass } from "@/components/ui/styles";

/** Filament-style table section: header strip (title, description, action) + scrollable table. */
export function TableCard({
  title,
  description,
  action,
  toolbar,
  children,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className={`${cardClass} overflow-hidden`}>
      {(title || action) && (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-ink-800">
          <div className="min-w-0">
            {title && <h2 className="text-[15px] font-semibold text-slate-900 dark:text-ink-100">{title}</h2>}
            {description && <p className="mt-0.5 text-[13px] text-slate-500 dark:text-ink-400">{description}</p>}
          </div>
          {action}
        </header>
      )}
      {toolbar && <div className="border-b border-slate-100 px-5 py-3 dark:border-ink-800">{toolbar}</div>}
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}

export const th = "whitespace-nowrap px-5 py-3 text-left text-[13px] font-semibold text-slate-600 dark:text-ink-400";
export const td = "px-5 py-3.5 text-sm text-slate-700 dark:text-ink-300";
export const tableClass = "w-full min-w-[560px] border-collapse";
export const theadClass = "bg-slate-50/70 border-b border-slate-100 dark:bg-ink-800/40 dark:border-ink-800";
export const trClass = "border-b border-slate-100 last:border-0 transition-colors hover:bg-slate-50/70 dark:border-ink-800 dark:hover:bg-ink-800/40";

export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: LucideIcon;
  title: string;
  body?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-ink-800 dark:text-ink-500">
        <Icon size={22} />
      </span>
      <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-ink-200">{title}</p>
      {body && <p className="mt-1 max-w-sm text-[13px] text-slate-500 dark:text-ink-400">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

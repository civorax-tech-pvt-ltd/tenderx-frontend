import type { LucideIcon } from "lucide-react";
import { cardClass } from "@/components/ui/styles";

/** A Filament-style form section: header strip with title/description, then a 2-column field grid. */
export function FormCard({
  title,
  subtitle,
  icon: Icon,
  aside,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className={cardClass}>
      <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-ink-800">
        <div className="flex min-w-0 items-start gap-3">
          {Icon && (
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-blue-50 text-blue-600 dark:bg-brand-900 dark:text-brand-400">
              <Icon size={16} />
            </span>
          )}
          <div className="min-w-0">
            <h3 className="text-[15px] font-semibold text-slate-900 dark:text-ink-100">{title}</h3>
            {subtitle && <p className="mt-0.5 text-[13px] text-slate-500 dark:text-ink-400">{subtitle}</p>}
          </div>
        </div>
        {aside}
      </header>
      <div className="grid grid-cols-1 gap-x-5 gap-y-4 p-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

/** Page title block used at the top of every workspace view. */
export function PageHeader({
  title,
  description,
  meta,
  actions,
}: {
  title: string;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-ink-100 sm:text-[28px]">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500 dark:text-ink-400">{description}</p>}
        {meta && <div className="mt-2.5 flex flex-wrap items-center gap-2">{meta}</div>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Badge({
  tone = "gray",
  children,
}: {
  tone?: "gray" | "blue" | "green" | "amber" | "red";
  children: React.ReactNode;
}) {
  const tones = {
    gray: "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-ink-800 dark:text-ink-300 dark:ring-ink-700",
    blue: "bg-blue-50 text-blue-700 ring-blue-200",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    red: "bg-red-50 text-red-700 ring-red-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-xs px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

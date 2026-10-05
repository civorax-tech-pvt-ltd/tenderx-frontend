// Shared class strings for the authenticated workspace (Filament-style admin look).
// Note: tailwind.config.ts overrides radii — rounded-xs=6px, rounded-sm=10px, rounded-md=14px.

export const inputClass =
  "h-10 w-full rounded-sm border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100 dark:placeholder:text-ink-500 dark:hover:border-ink-600 dark:focus:border-brand-500 dark:focus:ring-brand-500/10 dark:disabled:bg-ink-800 dark:disabled:text-ink-500";

export const labelClass = "mb-1.5 block text-[13px] font-semibold text-slate-700 dark:text-ink-300";

const btnBase =
  "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-sm px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50";

export const btn = {
  primary: `${btnBase} bg-blue-500 text-white shadow-sm hover:bg-blue-600`,
  secondary: `${btnBase} border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-200 dark:hover:bg-ink-800`,
  ghost: `${btnBase} text-slate-600 hover:bg-slate-100 dark:text-ink-300 dark:hover:bg-ink-800`,
  danger: `${btnBase} border border-red-200 bg-white text-red-600 hover:bg-red-50 dark:border-red-800 dark:bg-ink-900 dark:text-red-400 dark:hover:bg-red-900/20`,
  sm: "h-8 px-3 text-[13px]",
};

export const cardClass = "rounded-md border border-slate-200 bg-white shadow-card-blue dark:border-ink-800 dark:bg-ink-900";

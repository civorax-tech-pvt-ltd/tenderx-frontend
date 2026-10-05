import type { LucideIcon } from "lucide-react";
import { cardClass } from "@/components/ui/styles";

const TONES = {
  blue: "text-blue-600",
  green: "text-emerald-600",
  amber: "text-amber-600",
  red: "text-red-600",
  gray: "text-slate-500",
};

/** Filament-style stats-overview card: label, big value, coloured description line. */
export function StatCard({
  label,
  value,
  description,
  icon: Icon,
  tone = "gray",
  onClick,
}: {
  label: string;
  value: React.ReactNode;
  description?: string;
  icon?: LucideIcon;
  tone?: keyof typeof TONES;
  onClick?: () => void;
}) {
  const Wrapper = onClick ? "button" : "div";
  return (
    <Wrapper
      onClick={onClick}
      className={`${cardClass} block w-full p-5 text-left ${
        onClick ? "transition hover:-translate-y-px hover:border-blue-200 hover:shadow-md-blue" : ""
      }`}
    >
      <p className="text-sm font-medium text-slate-500 dark:text-ink-400">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 tabular-nums dark:text-ink-100">{value}</p>
      {description && (
        <p className={`mt-2 flex items-center gap-1.5 text-[13px] font-medium ${TONES[tone]}`}>
          <span className="truncate">{description}</span>
          {Icon && <Icon size={15} className="shrink-0" />}
        </p>
      )}
    </Wrapper>
  );
}

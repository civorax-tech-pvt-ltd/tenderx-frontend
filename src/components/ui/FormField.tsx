"use client";

import { useTranslations } from "next-intl";
import { inputClass, labelClass } from "@/components/ui/styles";
import { useBid } from "@/lib/bid-context";

export function TextField({
  fieldKey,
  label,
  span = 1,
  type = "text",
  mono = false,
  placeholder,
  hint,
  suffix,
  inputMode,
}: {
  fieldKey: string;
  label: string;
  span?: 1 | 2;
  type?: string;
  mono?: boolean;
  placeholder?: string;
  hint?: string;
  suffix?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  const { fieldData, setField } = useBid();

  return (
    <label className={span === 2 ? "sm:col-span-2" : undefined}>
      <span className={labelClass}>{label}</span>
      <div className="relative">
        <input
          type={type}
          inputMode={inputMode}
          value={fieldData[fieldKey] ?? ""}
          placeholder={placeholder}
          onChange={(e) => setField(fieldKey, e.target.value)}
          className={`${inputClass} ${mono ? "font-mono tabular-nums" : ""} ${suffix ? "pr-10" : ""}`}
        />
        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm font-semibold text-slate-400">
            {suffix}
          </span>
        )}
      </div>
      {hint && <span className="mt-1.5 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

export function SelectField({
  fieldKey,
  label,
  options,
  span = 1,
  hint,
}: {
  fieldKey: string;
  label: string;
  options: { value: string; label: string }[];
  span?: 1 | 2;
  hint?: string;
}) {
  const t = useTranslations("dash.form");
  const { fieldData, setField } = useBid();

  return (
    <label className={span === 2 ? "sm:col-span-2" : undefined}>
      <span className={labelClass}>{label}</span>
      <select
        value={fieldData[fieldKey] ?? ""}
        onChange={(e) => setField(fieldKey, e.target.value)}
        disabled={options.length === 0}
        className={inputClass}
      >
        <option value="" disabled>
          {t("select")}
        </option>
        {options.map((opt, i) => (
          <option key={i} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint && <span className="mt-1.5 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

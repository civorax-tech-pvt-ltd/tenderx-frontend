"use client";

import { Check, Headset, MessageCircle, Minus, Phone, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { cardClass } from "@/components/ui/styles";
import { useBid } from "@/lib/bid-context";
import { PERCENTAGE_KEYS } from "@/lib/constants";
import { percentageTotal, readiness } from "@/lib/validation";

/** Readiness checklist for the current bid, shared by the builder side column and the dashboard. */
export function useReadiness() {
  const t = useTranslations("summary");
  const tB = useTranslations("dash.builder");
  const { fieldData, images } = useBid();
  // The signatory's own CEO signature (mirrors resolve_authorized_signature_key on the backend).
  const signatoryPrefix = (["LEAD", "FIRST", "SECOND"] as const).find(
    (p) => fieldData.AUTHORIZED_PERSON_NAME && fieldData[`${p}_PARTNER_CEO`] === fieldData.AUTHORIZED_PERSON_NAME
  );
  const hasAuthorizedSig = Boolean(signatoryPrefix && images[`${signatoryPrefix}_CEO_SIG`]);
  const checklist = readiness(fieldData, hasAuthorizedSig);
  // Required items mirror the backend's validate_bid; the signature is optional (left blank if missing).
  const items: ReadinessItem[] = [
    { label: t("partnerNamesFilled"), ok: checklist.partnerNamesFilled },
    { label: tB("projectFilled"), ok: Boolean(fieldData.PROJECT_NAME && fieldData.EMPLOYER_NAME) },
    ...(fieldData.BID_TYPE === "Single Bidder" ? [] : [{ label: t("splitComplete"), ok: checklist.splitComplete }]),
    { label: t("signatureUploaded"), ok: checklist.signaturePresent, optional: tB("optional") },
  ];
  const required = items.filter((i) => !i.optional);
  return { items, done: required.filter((i) => i.ok).length, total: required.length };
}

type ReadinessItem = { label: string; ok: boolean; optional?: string };

function SideCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={cardClass}>
      <h3 className="border-b border-slate-100 px-5 py-3.5 text-sm font-semibold text-slate-900 dark:border-ink-800 dark:text-ink-100">{title}</h3>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function ReadinessList({ items }: { items: ReadinessItem[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2.5 text-sm">
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
              item.ok ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400 dark:bg-ink-800 dark:text-ink-500"
            }`}
          >
            {item.ok ? <Check size={12} strokeWidth={3} /> : item.optional ? <Minus size={12} /> : <X size={12} />}
          </span>
          <span className={item.ok ? "text-slate-700 dark:text-ink-300" : "text-slate-500 dark:text-ink-400"}>
            {item.label}
            {item.optional && !item.ok && (
              <span className="ml-1.5 rounded-xs bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-ink-800 dark:text-ink-400">
                {item.optional}
              </span>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function ProgressBar({ value, tone = "blue" }: { value: number; tone?: "blue" | "green" | "amber" }) {
  const color = tone === "green" ? "bg-emerald-500" : tone === "amber" ? "bg-amber-500" : "bg-blue-500";
  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-ink-800">
      <div className={`h-full rounded-full ${color} transition-[width] duration-300`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

export function ReadinessCard() {
  const t = useTranslations("summary");
  const tDash = useTranslations("dash.builder");
  const { items, done, total } = useReadiness();
  const allDone = done === total;

  return (
    <SideCard title={t("readiness")}>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-sm font-semibold text-slate-900">{tDash("readyCount", { done, total })}</span>
        <span className={`text-xs font-semibold ${allDone ? "text-emerald-600" : "text-slate-400"}`}>
          {allDone ? tDash("readyToGenerate") : tDash("notReady")}
        </span>
      </div>
      <ProgressBar value={(done / total) * 100} tone={allDone ? "green" : "blue"} />
      <div className="mt-4">
        <ReadinessList items={items} />
      </div>
    </SideCard>
  );
}

export function SplitCard() {
  const t = useTranslations("summary");
  const tNav = useTranslations("nav");
  const tDash = useTranslations("dash.builder");
  const { fieldData } = useBid();
  const split = percentageTotal(fieldData);
  const isValid = Math.abs(split - 100) < 0.01;
  const isSingle = fieldData.BID_TYPE === "Single Bidder";

  const rows = [
    { key: "lead", label: fieldData.LEAD_PARTNER_SHORT || tNav("leadPartner"), color: "bg-blue-500", show: true },
    { key: "first", label: fieldData.FIRST_PARTNER_SHORT || tNav("firstPartner"), color: "bg-sky-400", show: !isSingle && Boolean(fieldData.FIRST_PARTNER_NAME) },
    { key: "second", label: fieldData.SECOND_PARTNER_SHORT || tNav("secondPartner"), color: "bg-indigo-400", show: !isSingle && Boolean(fieldData.SECOND_PARTNER_NAME) },
  ]
    .filter((r) => r.show)
    .map((r) => {
      const n = parseFloat((fieldData[PERCENTAGE_KEYS[r.key as keyof typeof PERCENTAGE_KEYS]] ?? "").replace("%", ""));
      return { ...r, value: Number.isFinite(n) ? n : 0 };
    });

  return (
    <SideCard title={t("split")}>
      <div className="flex items-baseline justify-between">
        <span className={`text-3xl font-bold tabular-nums ${isValid ? "text-emerald-600" : "text-amber-600"}`}>{split}%</span>
        <span className={`text-xs font-semibold ${isValid ? "text-emerald-600" : "text-amber-600"}`}>
          {isValid ? tDash("splitOk") : tDash("splitNeeds", { value: Math.round((100 - split) * 100) / 100 })}
        </span>
      </div>
      <div className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-slate-100">
        {rows.map((r) => (
          <div key={r.key} className={r.color} style={{ width: `${Math.min(100, Math.max(0, r.value))}%` }} />
        ))}
      </div>
      <ul className="mt-4 space-y-2">
        {rows.map((r) => (
          <li key={r.key} className="flex items-center justify-between gap-2 text-sm">
            <span className="flex min-w-0 items-center gap-2 text-slate-600">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${r.color}`} />
              <span className="truncate">{r.label}</span>
            </span>
            <span className="font-semibold tabular-nums text-slate-900">{r.value}%</span>
          </li>
        ))}
      </ul>
    </SideCard>
  );
}

const SUPPORT_PHONE = "+977 9816382405";
const SUPPORT_WHATSAPP = "9779816382405";

/** Paid bid-preparation help: flat prices and a direct line to the support team. */
export function BidSupportCard() {
  const t = useTranslations("summary");
  const prices = [
    { label: t("singleEnvelope"), price: "5,000" },
    { label: t("doubleEnvelope"), price: "10,000" },
  ];

  return (
    <section className="relative overflow-hidden rounded-md bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 p-5 text-white shadow-lg shadow-blue-600/25 ring-1 ring-white/10 dark:from-blue-700 dark:via-blue-700 dark:to-indigo-800">
      <span className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
      <span className="pointer-events-none absolute -bottom-12 -left-8 h-28 w-28 rounded-full bg-amber-300/15" />

      <div className="relative">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-blue-900">
            <Headset size={16} />
          </span>
          <h3 className="text-base font-bold text-white" style={{ color: "#fff" }}>{t("bidSupportTitle")}</h3>
        </div>
        <p className="mt-2 text-[13px] text-blue-100">{t("bidSupportHint")}</p>

        <ul className="mt-4 space-y-2">
          {prices.map((p) => (
            <li
              key={p.label}
              className="flex items-center justify-between gap-3 rounded-sm bg-white/12 px-3 py-2.5 ring-1 ring-white/20 backdrop-blur-sm"
            >
              <span className="text-sm font-medium text-blue-50">{p.label}</span>
              <span className="whitespace-nowrap">
                <span className="text-[11px] font-semibold text-amber-200">NPR </span>
                <span className="text-lg font-extrabold tabular-nums text-amber-300">{p.price}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex gap-2">
          <a
            href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-sm bg-amber-400 px-3 py-2.5 text-[13px] font-bold text-blue-950 transition hover:bg-amber-300"
          >
            <Phone size={14} />
            {SUPPORT_PHONE}
          </a>
          <a
            href={`https://wa.me/${SUPPORT_WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("bidSupportWhatsapp")}
            title={t("bidSupportWhatsapp")}
            className="inline-flex items-center justify-center rounded-sm bg-emerald-500 px-3 py-2.5 text-white transition hover:bg-emerald-400"
          >
            <MessageCircle size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Clipboard, FileUp, Minus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { btn, cardClass } from "@/components/ui/styles";
import { api, getToken } from "@/lib/api";
import { useBid, type DraftOut } from "@/lib/bid-context";
import { errorMessage } from "@/lib/download";
import { PERCENTAGE_KEYS } from "@/lib/constants";
import { percentageTotal, readiness } from "@/lib/validation";
import { useWorkspace } from "@/lib/workspace-context";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
    { label: t("splitComplete"), ok: checklist.splitComplete },
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

export function EmployerPdfCard() {
  const t = useTranslations("summary");
  const { draftId } = useBid();
  const { notify } = useWorkspace();
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function loadPreview() {
    setPdfUrl(null);
    if (!draftId) return;
    const res = await fetch(`${API_URL}/drafts/${draftId}/employer-pdf`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) return;
    const blob = await res.blob();
    setPdfUrl(URL.createObjectURL(blob));
  }

  const upload = useMutation({
    mutationFn: (file: File) => {
      const form = new FormData();
      form.append("file", file);
      return api.put<DraftOut>(`/drafts/${draftId}/employer-pdf`, form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["draft", draftId] });
      loadPreview();
    },
    onError: (err) => notify("error", errorMessage(err, t("uploadPdf"))),
  });

  const copyText = useMutation({
    mutationFn: async () => {
      const res = await api.get<{ text: string }>(`/drafts/${draftId}/employer-pdf/text?page=0`);
      await navigator.clipboard.writeText(res.text);
    },
    onSuccess: () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    },
  });

  useEffect(() => {
    loadPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftId]);

  return (
    <SideCard title={t("employerPdf")}>
      {!draftId ? (
        <p className="text-[13px] text-slate-500">{t("saveDraftFirst")}</p>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => inputRef.current?.click()}
              disabled={upload.isPending}
              className={`${btn.secondary} ${btn.sm} flex-1`}
            >
              <FileUp size={14} />
              {upload.isPending ? t("uploading") : t("uploadPdf")}
            </button>
            {pdfUrl && (
              <button onClick={() => copyText.mutate()} className={`${btn.secondary} ${btn.sm} flex-1`}>
                {copied ? <Check size={14} /> : <Clipboard size={14} />}
                {copied ? t("copied") : t("copyText")}
              </button>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload.mutate(file);
              e.target.value = "";
            }}
          />
          {pdfUrl && (
            <iframe src={pdfUrl} title={t("employerPdfPreview")} className="h-80 w-full rounded-sm border border-slate-200" />
          )}
        </div>
      )}
    </SideCard>
  );
}

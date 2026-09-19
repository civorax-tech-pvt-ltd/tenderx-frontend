"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Clipboard, Download, Upload, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { api, getToken } from "@/lib/api";
import { useBid, type DraftOut } from "@/lib/bid-context";
import { percentageTotal, readiness } from "@/lib/validation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function SummaryPanel() {
  const t = useTranslations("summary");
  const { fieldData, images, draftId } = useBid();
  const split = percentageTotal(fieldData);
  const hasAuthorizedSig =
    Boolean(fieldData.AUTHORIZED_PERSON_NAME) && Object.keys(images).some((k) => k.endsWith("_CEO_SIG"));
  const checklist = readiness(fieldData, hasAuthorizedSig);

  const items: { label: string; ok: boolean }[] = [
    { label: t("partnerNamesFilled"), ok: checklist.partnerNamesFilled },
    { label: t("splitComplete"), ok: checklist.splitComplete },
    { label: t("signatureUploaded"), ok: checklist.signaturePresent },
  ];

  return (
    <aside className="flex w-full shrink-0 flex-col gap-4 border-l border-ink-200 bg-white p-4 dark:border-ink-800 dark:bg-ink-900 lg:w-80">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{t("overview")}</p>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-500">{fieldData.BID_TYPE === "Single Bidder" ? t("firm") : t("jvName")}</dt>
            <dd className="max-w-[60%] truncate font-medium text-ink-900 dark:text-ink-100">
              {fieldData.JV_NAME || "—"}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-500">{t("project")}</dt>
            <dd className="max-w-[60%] truncate font-medium text-ink-900 dark:text-ink-100">
              {fieldData.PROJECT_NAME || "—"}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-500">{t("split")}</dt>
            <dd
              className={`font-mono font-semibold tabular-nums ${
                Math.abs(split - 100) < 0.01 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
              }`}
            >
              {split}%
            </dd>
          </div>
        </dl>
      </div>

      <div className="border-t border-ink-100 pt-4 dark:border-ink-800">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{t("readiness")}</p>
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li key={item.label} className="flex items-center gap-2 text-sm">
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  item.ok
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                    : "bg-ink-100 text-ink-400 dark:bg-ink-800"
                }`}
              >
                {item.ok ? <Check size={11} /> : <X size={11} />}
              </span>
              <span className={item.ok ? "text-ink-700 dark:text-ink-300" : "text-ink-400"}>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-ink-100 pt-4 dark:border-ink-800">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{t("generationHistory")}</p>
        <GenerationHistoryPanel />
      </div>

      <div className="flex min-h-0 flex-1 flex-col border-t border-ink-100 pt-4 dark:border-ink-800">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{t("employerPdf")}</p>
        <EmployerPdfPanel draftId={draftId} />
      </div>
    </aside>
  );
}

type GeneratedDocumentItem = {
  id: string;
  doc_id: string;
  filename: string;
  jv_name: string;
  partner_count: number;
  created_at: string;
  download_url: string;
};

export function GenerationHistoryPanel() {
  const t = useTranslations("summary");

  const { data } = useQuery({
    queryKey: ["generation-history"],
    queryFn: () => api.get<{ total: number; items: GeneratedDocumentItem[] }>("/generate/history"),
  });

  async function download(item: GeneratedDocumentItem) {
    const res = await fetch(`${API_URL}${item.download_url}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = item.filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mt-2">
      <p className="text-sm font-medium text-ink-700 dark:text-ink-300">
        {t("generationCount", { count: data?.total ?? 0 })}
      </p>
      {data && data.items.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {data.items.slice(0, 5).map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-2 text-xs">
              <div className="min-w-0">
                <p className="truncate font-medium text-ink-700 dark:text-ink-300">{item.jv_name || item.filename}</p>
                <p className="text-ink-400">{new Date(item.created_at).toLocaleString()}</p>
              </div>
              <button
                onClick={() => download(item)}
                className="shrink-0 text-brand-600 hover:text-brand-700 dark:text-brand-400"
                aria-label={t("download")}
              >
                <Download size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EmployerPdfPanel({ draftId }: { draftId: string | null }) {
  const t = useTranslations("summary");
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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

  async function loadPreview() {
    if (!draftId) return;
    const res = await fetch(`${API_URL}/drafts/${draftId}/employer-pdf`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) return;
    const blob = await res.blob();
    setPdfUrl(URL.createObjectURL(blob));
  }

  useEffect(() => {
    loadPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftId]);

  if (!draftId) {
    return <p className="mt-2 text-xs text-ink-400">{t("saveDraftFirst")}</p>;
  }

  return (
    <div className="mt-2 flex min-h-0 flex-1 flex-col gap-2">
      <div className="flex gap-2">
        <button
          onClick={() => inputRef.current?.click()}
          disabled={upload.isPending}
          className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-ink-200 text-xs font-medium text-ink-600 hover:bg-ink-50 dark:border-ink-700 dark:text-ink-400 dark:hover:bg-ink-800"
        >
          <Upload size={12} />
          {upload.isPending ? t("uploading") : t("uploadPdf")}
        </button>
        {pdfUrl && (
          <button
            onClick={() => copyText.mutate()}
            className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-ink-200 text-xs font-medium text-ink-600 hover:bg-ink-50 dark:border-ink-700 dark:text-ink-400 dark:hover:bg-ink-800"
          >
            {copied ? <Check size={12} /> : <Clipboard size={12} />}
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
        <iframe
          src={pdfUrl}
          title={t("employerPdfPreview")}
          className="min-h-[240px] flex-1 rounded-lg border border-ink-200 dark:border-ink-700"
        />
      )}
    </div>
  );
}

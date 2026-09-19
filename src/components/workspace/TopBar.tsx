"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Download, FileOutput, Menu, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api, ApiError, getToken } from "@/lib/api";
import { useBid } from "@/lib/bid-context";
import { determinePartnerCount, percentageTotal } from "@/lib/validation";
import type { TabKey } from "@/components/workspace/Sidebar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function errorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError) {
    try {
      const parsed = JSON.parse(err.message);
      return Array.isArray(parsed) ? parsed.join("\n") : err.message;
    } catch {
      return err.message;
    }
  }
  return err instanceof Error ? err.message : fallback;
}

async function downloadBlob(
  path: string,
  filename: string,
  downloadFailedMessage: string,
  method: "GET" | "POST" = "GET"
) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error(downloadFailedMessage);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function TopBar({ activeTab, onMenuClick }: { activeTab: TabKey; onMenuClick: () => void }) {
  const t = useTranslations("topbar");
  const tNav = useTranslations("nav");
  const { fieldData, draftId, newBid } = useBid();
  const queryClient = useQueryClient();
  const [lastGeneratedDocId, setLastGeneratedDocId] = useState<string | null>(null);
  const split = percentageTotal(fieldData);
  const isValid = Math.abs(split - 100) < 0.01;

  const tabLabel = activeTab === "project" ? tNav("projectInfo") : tNav(`${activeTab}Partner` as any);

  const generate = useMutation({
    mutationFn: async () => {
      if (!draftId) throw new Error(t("saveDraftFirst"));
      const { download_url, filename, id } = await api.post<{
        id: string;
        download_url: string;
        filename: string;
      }>("/generate", { draft_id: draftId, field_data: fieldData });
      await downloadBlob(download_url, filename, t("downloadFailed"));
      return id;
    },
    onSuccess: (id) => {
      setLastGeneratedDocId(id);
      queryClient.invalidateQueries({ queryKey: ["generation-history"] });
    },
    onError: (err) => alert(errorMessage(err, t("saveDraftFirst"))),
  });

  const generatePdfs = useMutation({
    mutationFn: async () => {
      if (!lastGeneratedDocId) throw new Error(t("generateDocFirst"));
      const partnerCount = determinePartnerCount(fieldData);
      await downloadBlob(
        `/generate/${lastGeneratedDocId}/pdf?partner_count=${partnerCount}`,
        `${lastGeneratedDocId}_sections.zip`,
        t("downloadFailed"),
        "POST"
      );
    },
    onError: (err) => alert(errorMessage(err, t("generateDocFirst"))),
  });

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-ink-200 bg-white px-3 dark:border-ink-800 dark:bg-ink-900 sm:px-5">
      <div className="flex min-w-0 items-center gap-2">
        <button
          onClick={onMenuClick}
          className="shrink-0 rounded-lg p-1.5 text-ink-500 hover:bg-ink-50 dark:text-ink-400 dark:hover:bg-ink-800 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
        <div className="min-w-0">
          <p className="text-xs text-ink-400">{t("bidWorkspace")}</p>
          <p className="truncate text-sm font-medium text-ink-900 dark:text-ink-100">{tabLabel}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums ${
            isValid
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
              : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
          }`}
        >
          {t("split", { value: split })}
        </span>

        <button
          onClick={() => confirm(t("confirmClear")) && newBid()}
          className="flex h-8 items-center gap-1.5 rounded-lg border border-ink-200 px-2 text-xs font-medium text-ink-600 hover:bg-ink-50 dark:border-ink-700 dark:text-ink-400 dark:hover:bg-ink-800 sm:px-3"
        >
          <Trash2 size={13} />
          <span className="hidden sm:inline">{t("clear")}</span>
        </button>

        <button
          onClick={() => generatePdfs.mutate()}
          disabled={!lastGeneratedDocId || generatePdfs.isPending}
          className="flex h-8 items-center gap-1.5 rounded-lg border border-ink-200 px-2 text-xs font-medium text-ink-600 hover:bg-ink-50 disabled:opacity-40 dark:border-ink-700 dark:text-ink-400 dark:hover:bg-ink-800 sm:px-3"
        >
          <FileOutput size={13} />
          <span className="hidden sm:inline">{generatePdfs.isPending ? t("splitting") : t("generatePdfs")}</span>
        </button>

        <button
          onClick={() => generate.mutate()}
          disabled={generate.isPending}
          className="flex h-8 items-center gap-1.5 rounded-lg bg-brand-500 px-2.5 text-xs font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-50 sm:px-3.5"
        >
          <Download size={13} />
          <span className="hidden sm:inline">{generate.isPending ? t("generating") : t("generateBid")}</span>
        </button>
      </div>
    </header>
  );
}

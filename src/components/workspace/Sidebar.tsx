"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, LayoutGrid, Save, Users, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { saveDraft, useBid, type DraftOut } from "@/lib/bid-context";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

type DraftSummary = { id: string; name: string; updated_at: string };

export type TabKey = "project" | "lead" | "first" | "second";

const TAB_ORDER: { key: TabKey; icon: typeof LayoutGrid }[] = [
  { key: "project", icon: LayoutGrid },
  { key: "lead", icon: Users },
  { key: "first", icon: Users },
  { key: "second", icon: Users },
];

export function Sidebar({
  activeTab,
  onTabChange,
  isOpen,
  onClose,
}: {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("nav");
  const tApp = useTranslations("app");
  const tAuth = useTranslations("auth");
  const { user, logout } = useAuth();
  const { draftId, draftName, fieldData, loadDraft, newBid } = useBid();
  const queryClient = useQueryClient();
  const isSingle = fieldData.BID_TYPE === "Single Bidder";

  const { data: drafts } = useQuery({
    queryKey: ["drafts"],
    queryFn: () => api.get<DraftSummary[]>("/drafts"),
  });

  const save = useMutation({
    mutationFn: () => saveDraft(draftId, draftName || fieldData.JV_NAME || t("untitledBid"), fieldData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["drafts"] }),
  });

  const openDraft = useMutation({
    mutationFn: (id: string) => api.get<DraftOut>(`/drafts/${id}`),
    onSuccess: (draft) => loadDraft(draft),
  });

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 -translate-x-full flex-col border-r border-ink-200 bg-white transition-transform duration-200 dark:border-ink-800 dark:bg-ink-900 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : ""
        }`}
      >
      <div className="flex items-center gap-2.5 border-b border-ink-100 px-4 py-4 dark:border-ink-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white">
          TX
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold leading-tight text-ink-900 dark:text-ink-100">{tApp("name")}</p>
          <p className="truncate text-[11px] leading-tight text-ink-500">{user?.email}</p>
        </div>
        <button onClick={onClose} className="shrink-0 text-ink-400 hover:text-ink-600 lg:hidden" aria-label="Close menu">
          <X size={18} />
        </button>
      </div>

      <div className="border-b border-ink-100 p-3 dark:border-ink-800">
        <select
          value={draftId ?? ""}
          onChange={(e) => {
            if (e.target.value === "__new__") newBid();
            else if (e.target.value) openDraft.mutate(e.target.value);
          }}
          className="h-9 w-full rounded-lg border border-ink-200 bg-white px-2.5 text-xs font-medium text-ink-800 outline-none focus:border-brand-500 dark:border-ink-700 dark:bg-ink-950 dark:text-ink-200"
        >
          <option value="">{t("currentBid")}</option>
          {(drafts ?? []).map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
          <option value="__new__">{t("newBid")}</option>
        </select>
        <button
          onClick={() => save.mutate()}
          disabled={save.isPending}
          className="mt-2 flex h-8 w-full items-center justify-center gap-1.5 rounded-lg bg-brand-500 text-xs font-medium text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
        >
          <Save size={13} />
          {save.isPending ? t("saving") : draftId ? t("update") : t("save")}
        </button>
      </div>

      <nav className="flex-1 space-y-0.5 p-2.5">
        {TAB_ORDER.filter(({ key }) => {
          if (key === "first" && !user?.can_use_first_partner) return false;
          if (key === "second" && !user?.can_use_second_partner) return false;
          return true;
        }).map(({ key, icon: Icon }) => {
          const disabled = (key === "first" || key === "second") && isSingle;
          return (
            <button
              key={key}
              onClick={() => onTabChange(key)}
              disabled={disabled}
              className={`flex h-9 w-full items-center gap-2.5 rounded-lg px-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                activeTab === key
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400"
                  : "text-ink-600 hover:bg-ink-50 dark:text-ink-400 dark:hover:bg-ink-800"
              }`}
            >
              <Icon size={15} />
              {key === "project" ? t("projectInfo") : t(`${key}Partner` as any)}
            </button>
          );
        })}
      </nav>

      {user?.is_admin && (
        <div className="px-2.5 pb-2">
          <a
            href={process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3001"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-full items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-50 dark:text-ink-400 dark:hover:bg-ink-800"
          >
            <ExternalLink size={15} />
            Admin Dashboard
          </a>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-ink-100 p-3 dark:border-ink-800">
        <LanguageSwitcher />
        <button onClick={logout} className="text-xs font-medium text-ink-500 hover:text-red-500">
          {tAuth("logout")}
        </button>
      </div>
      </aside>
    </>
  );
}

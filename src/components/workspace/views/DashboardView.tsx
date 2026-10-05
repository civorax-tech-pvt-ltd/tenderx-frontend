"use client";

import {
  ArrowRight,
  CalendarClock,
  Contact,
  Download,
  FileDown,
  FileText,
  FolderOpen,
  PenLine,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { btn, cardClass } from "@/components/ui/styles";
import { EmptyState, TableCard, tableClass, td, th, theadClass, trClass } from "@/components/ui/TableCard";
import { ProgressBar, ReadinessList, useReadiness } from "@/components/workspace/SummaryPanel";
import { useOpenDraft, useStartNewBid } from "@/lib/bid-actions";
import { useAuth } from "@/lib/auth-context";
import { useBid } from "@/lib/bid-context";
import {
  downloadHistoryItem,
  useDateFormat,
  useDrafts,
  useGenerationHistory,
  useProfiles,
} from "@/lib/workspace-queries";
import { FIRST_STEP, useWorkspace } from "@/lib/workspace-context";

export function DashboardView() {
  const t = useTranslations("dash.home");
  const tNav = useTranslations("dash.nav");
  const locale = useLocale();
  const { user } = useAuth();
  const { draftId, draftName, fieldData, isDirty } = useBid();
  const { setView, notify } = useWorkspace();
  const startNewBid = useStartNewBid();
  const openDraft = useOpenDraft();
  const { relative, date, dateTime } = useDateFormat();
  const { items: readinessItems, done, total } = useReadiness();

  const drafts = useDrafts();
  const profiles = useProfiles();
  const history = useGenerationHistory();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? t("morning") : hour < 17 ? t("afternoon") : t("evening");
  const firstName = (user?.full_name || "").trim().split(/\s+/)[0] || user?.email?.split("@")[0] || "";
  const today = new Date().toLocaleDateString(locale === "ne" ? "ne-NP" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const daysLeft = user?.trial_ends_at
    ? Math.ceil((new Date(user.trial_ends_at).getTime() - Date.now()) / 86400000)
    : null;

  const hasCurrentBid = Boolean(draftId || fieldData.JV_NAME || fieldData.PROJECT_NAME || fieldData.LEAD_PARTNER_NAME);
  const currentTitle = draftName || fieldData.JV_NAME || tNav("untitledBid");
  const latestDoc = history.data?.items[0];

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome banner */}
      <section className="relative overflow-hidden rounded-md bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 px-6 py-7 text-white shadow-hero sm:px-8">
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-white/10" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-28 right-28 h-56 w-56 rounded-full bg-white/5" aria-hidden="true" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-100">{today}</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-[28px]">
            {greeting}
            {firstName && `, ${firstName}`} 👋
          </h1>
          <p className="mt-1 text-[15px] text-blue-100">{t("subtitle")}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <BannerButton onClick={startNewBid} icon={Plus}>
              {t("newBid")}
            </BannerButton>
            {hasCurrentBid && (
              <BannerButton onClick={() => setView(FIRST_STEP)} icon={PenLine}>
                {t("continueBid")}
              </BannerButton>
            )}
            <BannerButton onClick={() => setView("bids")} icon={FolderOpen}>
              {tNav("bids")}
            </BannerButton>
            <BannerButton onClick={() => setView("profiles")} icon={Contact}>
              {tNav("profiles")}
            </BannerButton>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t("statBids")}
          value={drafts.data?.length ?? "–"}
          description={
            drafts.data?.[0] ? t("lastUpdated", { when: relative(drafts.data[0].updated_at) }) : t("noBidsYet")
          }
          icon={FolderOpen}
          tone="blue"
          onClick={() => setView("bids")}
        />
        <StatCard
          label={t("statDocuments")}
          value={history.data?.total ?? "–"}
          description={latestDoc ? t("lastGenerated", { when: relative(latestDoc.created_at) }) : t("noDocsYet")}
          icon={FileDown}
          tone="green"
          onClick={() => setView("documents")}
        />
        <StatCard
          label={t("statProfiles")}
          value={profiles.data?.length ?? "–"}
          description={t("profilesHint")}
          icon={Users}
          tone="gray"
          onClick={() => setView("profiles")}
        />
        {user?.is_admin ? (
          <StatCard label={t("statAccess")} value={t("unlimited")} description={t("adminAccount")} icon={Sparkles} tone="blue" />
        ) : (
          <StatCard
            label={t("statAccess")}
            value={daysLeft !== null ? t("daysLeft", { count: Math.max(0, daysLeft) }) : "–"}
            description={user?.trial_ends_at ? t("activeUntil", { date: date(user.trial_ends_at) }) : undefined}
            icon={CalendarClock}
            tone={daysLeft !== null && daysLeft <= 7 ? "red" : "amber"}
          />
        )}
      </div>

      {/* Current bid + how it works */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <section className={`${cardClass} p-5 lg:col-span-3`}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-500 dark:text-ink-400">{t("currentBid")}</p>
              <p className="mt-1 truncate text-lg font-bold text-slate-900 dark:text-ink-100">
                {hasCurrentBid ? currentTitle : t("noCurrentBid")}
              </p>
              {hasCurrentBid && fieldData.PROJECT_NAME && (
                <p className="truncate text-[13px] text-slate-500 dark:text-ink-400">{fieldData.PROJECT_NAME}</p>
              )}
            </div>
            {hasCurrentBid &&
              (!draftId ? (
                <Badge tone="amber">{t("notSaved")}</Badge>
              ) : isDirty ? (
                <Badge tone="amber">{t("unsaved")}</Badge>
              ) : (
                <Badge tone="green">{t("saved")}</Badge>
              ))}
          </div>

          {hasCurrentBid ? (
            <>
              <div className="mt-5 mb-1.5 flex items-baseline justify-between text-sm">
                <span className="font-semibold text-slate-700 dark:text-ink-300">{t("readiness")}</span>
                <span className="font-semibold tabular-nums text-slate-500 dark:text-ink-400">
                  {done}/{total}
                </span>
              </div>
              <ProgressBar value={(done / total) * 100} tone={done === total ? "green" : "blue"} />
              <div className="mt-4">
                <ReadinessList items={readinessItems} />
              </div>
              <button onClick={() => setView(FIRST_STEP)} className={`${btn.primary} mt-5`}>
                {t("continueBid")}
                <ArrowRight size={16} />
              </button>
            </>
          ) : (
            <div className="mt-4">
              <p className="text-sm text-slate-500 dark:text-ink-400">{t("noCurrentBidBody")}</p>
              <button onClick={startNewBid} className={`${btn.primary} mt-4`}>
                <Plus size={16} />
                {t("newBid")}
              </button>
            </div>
          )}
        </section>

        <section className={`${cardClass} p-5 lg:col-span-2`}>
          <p className="text-sm font-semibold text-slate-900 dark:text-ink-100">{t("howItWorks")}</p>
          <ol className="mt-4 space-y-4">
            {[
              { icon: Users, title: t("how2Title"), body: t("how2Body") },
              { icon: FileText, title: t("how1Title"), body: t("how1Body") },
              { icon: Download, title: t("how3Title"), body: t("how3Body") },
            ].map(({ icon: Icon, title, body }, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-blue-50 text-blue-600 dark:bg-brand-900 dark:text-brand-400">
                  <Icon size={17} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-ink-200">
                    {i + 1}. {title}
                  </p>
                  <p className="text-[13px] text-slate-500 dark:text-ink-400">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* Recent bids */}
      <TableCard
        title={t("recentBids")}
        description={t("recentBidsHint")}
        action={
          <button onClick={() => setView("bids")} className={`${btn.ghost} ${btn.sm} text-blue-600`}>
            {t("viewAll")}
            <ArrowRight size={14} />
          </button>
        }
      >
        {drafts.data && drafts.data.length > 0 ? (
          <table className={tableClass}>
            <thead className={theadClass}>
              <tr>
                <th className={th}>{t("colName")}</th>
                <th className={th}>{t("colUpdated")}</th>
                <th className={`${th} text-right`}>
                  <span className="sr-only">{t("colActions")}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {drafts.data.slice(0, 5).map((d) => (
                <tr key={d.id} className={trClass}>
                  <td className={`${td} font-semibold text-slate-900 dark:text-ink-100`}>
                    {d.name}
                    {d.id === draftId && (
                      <span className="ml-2">
                        <Badge tone="blue">{t("open")}</Badge>
                      </span>
                    )}
                  </td>
                  <td className={`${td} text-slate-500 dark:text-ink-400`} title={dateTime(d.updated_at)}>
                    {relative(d.updated_at)}
                  </td>
                  <td className={`${td} text-right`}>
                    <button
                      onClick={() => openDraft.open(d.id)}
                      disabled={openDraft.isPending}
                      className={`${btn.secondary} ${btn.sm}`}
                    >
                      <PenLine size={13} />
                      {t("edit")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState
            icon={FolderOpen}
            title={drafts.isLoading ? t("loading") : t("noBidsYet")}
            body={drafts.isLoading ? undefined : t("noBidsBody")}
          />
        )}
      </TableCard>

      {/* Recent documents */}
      <TableCard
        title={t("recentDocs")}
        description={t("recentDocsHint")}
        action={
          <button onClick={() => setView("documents")} className={`${btn.ghost} ${btn.sm} text-blue-600`}>
            {t("viewAll")}
            <ArrowRight size={14} />
          </button>
        }
      >
        {history.data && history.data.items.length > 0 ? (
          <table className={tableClass}>
            <thead className={theadClass}>
              <tr>
                <th className={th}>{t("colBid")}</th>
                <th className={th}>{t("colPartners")}</th>
                <th className={th}>{t("colGenerated")}</th>
                <th className={`${th} text-right`}>
                  <span className="sr-only">{t("colActions")}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {history.data.items.slice(0, 5).map((item) => (
                <tr key={item.id} className={trClass}>
                  <td className={`${td} font-semibold text-slate-900 dark:text-ink-100`}>{item.jv_name || item.filename}</td>
                  <td className={td}>
                    <Badge tone="gray">{t("partnerCount", { count: item.partner_count })}</Badge>
                  </td>
                  <td className={`${td} text-slate-500 dark:text-ink-400`} title={dateTime(item.created_at)}>
                    {relative(item.created_at)}
                  </td>
                  <td className={`${td} text-right`}>
                    <button
                      onClick={() => downloadHistoryItem(item).catch(() => notify("error", t("downloadFailed")))}
                      className={`${btn.secondary} ${btn.sm}`}
                    >
                      <Download size={13} />
                      {t("download")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState
            icon={FileDown}
            title={history.isLoading ? t("loading") : t("noDocsYet")}
            body={history.isLoading ? undefined : t("noDocsBody")}
          />
        )}
      </TableCard>
    </div>
  );
}

function BannerButton({
  onClick,
  icon: Icon,
  children,
}: {
  onClick: () => void;
  icon: typeof Plus;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex h-9 items-center gap-1.5 rounded-sm bg-white/15 px-3.5 text-[13px] font-semibold text-white ring-1 ring-inset ring-white/20 backdrop-blur transition hover:bg-white/25"
    >
      <Icon size={15} />
      {children}
    </button>
  );
}

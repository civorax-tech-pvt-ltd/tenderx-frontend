"use client";

import { ArrowLeft, ArrowRight, Check, Download, FileArchive, Loader2, Save, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { PartnerTab } from "@/components/tabs/PartnerTab";
import { BidTypeCard, ProjectTab } from "@/components/tabs/ProjectTab";
import { Badge, PageHeader } from "@/components/ui/PageHeader";
import { btn } from "@/components/ui/styles";
import { useStepAccess } from "@/components/workspace/Sidebar";
import { BidSupportCard, ReadinessCard, SplitCard } from "@/components/workspace/SummaryPanel";
import { useGenerateBid, useGeneratePdfs, useSaveBid } from "@/lib/bid-actions";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { useBid } from "@/lib/bid-context";
import { stepComplete } from "@/lib/validation";
import { BUILDER_STEPS, FIRST_STEP, useWorkspace, type StepKey } from "@/lib/workspace-context";

export function BuilderView({ step }: { step: StepKey }) {
  const t = useTranslations("dash.builder");
  const tNav = useTranslations("dash.nav");
  const tTop = useTranslations("topbar");
  const { draftId, draftName, fieldData, isDirty, newBid } = useBid();
  const { setView, lastGeneratedDocId, setLastGeneratedDocId } = useWorkspace();
  const confirm = useConfirm();
  const stepAccess = useStepAccess();
  const save = useSaveBid();
  const generate = useGenerateBid();
  const generatePdfs = useGeneratePdfs();

  const steps = BUILDER_STEPS.filter((s) => stepAccess(s).visible);
  const enabledSteps = steps.filter((s) => !stepAccess(s).disabled);
  const index = enabledSteps.indexOf(step);
  const prev = index > 0 ? enabledSteps[index - 1] : null;
  const next = index >= 0 && index < enabledSteps.length - 1 ? enabledSteps[index + 1] : null;

  const bidTitle = draftName || fieldData.JV_NAME || tNav("untitledBid");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={tNav(step)}
        description={t(`${step}Description`)}
        meta={
          <>
            <span className="max-w-[16rem] truncate text-sm font-semibold text-slate-700">{bidTitle}</span>
            {!draftId ? (
              <Badge tone="amber">{t("notSaved")}</Badge>
            ) : isDirty ? (
              <Badge tone="amber">{t("unsavedChanges")}</Badge>
            ) : (
              <Badge tone="green">
                <Check size={12} strokeWidth={3} />
                {t("saved")}
              </Badge>
            )}
          </>
        }
        actions={
          <>
            <button
              onClick={async () => {
                const ok = await confirm({ message: tTop("confirmClear"), confirmLabel: "Clear", variant: "warning" });
                if (!ok) return;
                newBid();
                setLastGeneratedDocId(null);
                setView(FIRST_STEP);
              }}
              className={`${btn.ghost} px-3`}
              title={tTop("clear")}
            >
              <Trash2 size={16} />
              <span className="hidden xl:inline">{tTop("clear")}</span>
            </button>
            <button onClick={() => save.mutate()} disabled={save.isPending} className={btn.secondary}>
              {save.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {draftId ? t("saveChanges") : t("saveDraft")}
            </button>
            <button
              onClick={() => generatePdfs.mutate()}
              disabled={!lastGeneratedDocId || generatePdfs.isPending}
              className={btn.secondary}
              title={!lastGeneratedDocId ? tTop("generateDocFirst") : undefined}
            >
              {generatePdfs.isPending ? <Loader2 size={16} className="animate-spin" /> : <FileArchive size={16} />}
              {generatePdfs.isPending ? tTop("splitting") : tTop("generatePdfs")}
            </button>
            <button onClick={() => generate.mutate()} disabled={generate.isPending} className={btn.primary}>
              {generate.isPending ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              {generate.isPending ? tTop("generating") : tTop("generateBid")}
            </button>
          </>
        }
      />

      <BidTypeCard />

      {/* Stepper */}
      <ol className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-0">
        {steps.map((s, i) => {
          const { disabled } = stepAccess(s);
          const active = s === step;
          const done = stepComplete(fieldData, s);
          return (
            <li key={s} className="flex items-center sm:flex-1">
              <button
                onClick={() => setView(s)}
                disabled={disabled}
                title={disabled ? tNav("singleBidderHint") : undefined}
                className={`flex w-full items-center gap-2.5 rounded-sm border px-3 py-2.5 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  active
                    ? "border-blue-500 bg-white shadow-card-blue ring-4 ring-blue-500/10"
                    : "border-slate-200 bg-white/60 hover:border-slate-300 hover:bg-white"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    done ? "bg-emerald-500 text-white" : active ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {done ? <Check size={14} strokeWidth={3} /> : i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    {t("stepN", { n: i + 1 })}
                  </span>
                  <span className={`block truncate text-sm font-semibold ${active ? "text-blue-700" : "text-slate-700"}`}>
                    {tNav(s)}
                  </span>
                </span>
              </button>
              {i < steps.length - 1 && <span className="mx-2 hidden h-px w-6 shrink-0 bg-slate-300 sm:block" />}
            </li>
          );
        })}
      </ol>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          {step === "project" ? <ProjectTab /> : <PartnerTab role={step} />}

          <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-200 pt-5">
            {prev ? (
              <button onClick={() => setView(prev)} className={btn.secondary}>
                <ArrowLeft size={16} />
                {tNav(prev)}
              </button>
            ) : (
              <span />
            )}
            {next ? (
              <button onClick={() => setView(next)} className={btn.primary}>
                {t("next", { step: tNav(next) })}
                <ArrowRight size={16} />
              </button>
            ) : (
              <button onClick={() => generate.mutate()} disabled={generate.isPending} className={btn.primary}>
                {generate.isPending ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                {tTop("generateBid")}
              </button>
            )}
          </div>
        </div>

        <aside className="flex flex-col gap-6 xl:sticky xl:top-6 xl:self-start">
          <ReadinessCard />
          {fieldData.BID_TYPE !== "Single Bidder" && <SplitCard />}
          <BidSupportCard />
        </aside>
      </div>
    </div>
  );
}

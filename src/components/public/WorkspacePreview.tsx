"use client";

import { useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Building2,
  Check,
  FileText,
  FolderCheck,
  Signature,
  Stamp,
  Users,
} from "lucide-react";
import { Wordmark } from "./Wordmark";

const TABS = ["project", "partners", "documents"] as const;
type TabKey = (typeof TABS)[number];

/** Interactive sample workspace (§13): keyboard-navigable tabs, 200ms switch. */
export function WorkspacePreview() {
  const t = useTranslations("landing.preview");
  const [active, setActive] = useState<TabKey>("project");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const baseId = useId();

  function onKeyDown(e: React.KeyboardEvent) {
    const index = TABS.indexOf(active);
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (index + 1) % TABS.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TABS.length - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(TABS[next]);
    tabRefs.current[TABS[next]]?.focus();
  }

  return (
    <section className="section-y bg-blue-50" id="workspace">
      <div className="container-x">
        <p className="reveal eyebrow text-center">{t("eyebrow")}</p>

        <div className="reveal mt-10 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-preview">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-7">
            <Wordmark />
            <span className="chip">{t("samplePill")}</span>
          </div>

          <div
            role="tablist"
            aria-label={t("eyebrow")}
            onKeyDown={onKeyDown}
            className="flex gap-1 overflow-x-auto border-b border-slate-200 px-3 sm:px-5"
          >
            {TABS.map((key, i) => {
              const selected = key === active;
              return (
                <button
                  key={key}
                  ref={(el) => {
                    tabRefs.current[key] = el;
                  }}
                  role="tab"
                  id={`${baseId}-tab-${key}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel-${key}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(key)}
                  className={`relative shrink-0 px-3 py-4 text-[15px] font-semibold transition-colors duration-200 ${
                    selected ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <span className="tabular me-2 text-[12px] font-bold text-slate-600">
                    0{i + 1}
                  </span>
                  {t(`tabs.${key}`)}
                  <span
                    className={`absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-blue-500 transition-opacity duration-200 ${
                      selected ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div
            key={active}
            role="tabpanel"
            id={`${baseId}-panel-${active}`}
            aria-labelledby={`${baseId}-tab-${active}`}
            tabIndex={0}
            className="animate-fade-slide p-5 outline-none sm:p-7"
          >
            {active === "project" && <ProjectPanel />}
            {active === "partners" && <PartnersPanel />}
            {active === "documents" && <DocumentsPanel />}
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-200 bg-blue-50/60 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <p className="text-[15px] font-semibold text-slate-800">{t("footer.title")}</p>
            <div className="flex items-center gap-3">
              <div className="rounded-md border border-slate-200 bg-white px-3 py-2">
                <p className="text-[13px] font-semibold text-slate-900">{t("footer.badgeTitle")}</p>
                <p className="mt-0.5 text-[12px] text-slate-600">{t("footer.badgeBody")}</p>
              </div>
              <p className="hidden text-[12px] text-slate-600 sm:block">{t("footer.hint")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectPanel() {
  const t = useTranslations("landing.preview");
  const rows = [
    { label: t("project.projectName"), caption: t("project.projectName") },
    { label: t("project.jvName"), caption: t("project.jvName") },
    { label: t("project.bidType"), caption: t("project.bidType") },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_260px]">
      <div>
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-slate-600">
          {t("project.header")}
        </p>
        <h3 className="mt-2 text-h3 text-slate-900">{t("project.panelTitle")}</h3>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-md border border-slate-200 bg-blue-50/50 px-4 py-3 sm:col-span-2">
            <dt className="text-[12px] font-semibold uppercase tracking-[0.1em] text-slate-600">
              {t("project.projectName")}
            </dt>
            <dd className="mt-1 text-[15px] font-semibold text-slate-900">{rows[0].caption}</dd>
          </div>
          <div className="rounded-md border border-slate-200 bg-blue-50/50 px-4 py-3">
            <dt className="text-[12px] font-semibold uppercase tracking-[0.1em] text-slate-600">
              {t("project.jvName")}
            </dt>
            <dd className="mt-1 text-[15px] font-semibold text-slate-900">{rows[1].caption}</dd>
          </div>
          <div className="rounded-md border border-slate-200 bg-blue-50/50 px-4 py-3">
            <dt className="text-[12px] font-semibold uppercase tracking-[0.1em] text-slate-600">
              {t("project.bidType")}
            </dt>
            <dd className="mt-1 text-[15px] font-semibold text-slate-900">{rows[2].caption}</dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-col justify-between rounded-md border border-slate-200 bg-blue-50/50 p-5">
        <div>
          <div className="flex items-center gap-2 text-blue-600">
            <FolderCheck size={18} strokeWidth={1.75} aria-hidden />
            <span className="text-[13px] font-semibold uppercase tracking-[0.1em]">
              {t("project.progressLabel")}
            </span>
          </div>
          <p className="tabular mt-3 text-[40px] font-bold leading-none text-slate-900">
            {t("project.progressValue")}
          </p> 
        </div>
        <div className="mt-5 h-2 w-full overflow-hidden rounded-pill bg-slate-200">
          <div className="h-full w-full rounded-pill bg-blue-500" />
        </div>
      </div>
    </div>
  );
}

function PartnersPanel() {
  const t = useTranslations("landing.preview");
  const partners = [
    { role: t("partners.lead"), company: t("partners.companyOne"), share: "50%" },
    { role: t("partners.first"), company: t("partners.companyTwo"), share: "30%" },
    { role: t("partners.second"), company: t("partners.companyThree"), share: "20%" },
  ];

  return (
    <div>
      <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-slate-600">
        {t("partners.header")}
      </p>

      <ul className="mt-6 grid gap-3">
        {partners.map((partner) => (
          <li
            key={partner.role}
            className="flex flex-wrap items-center gap-3 rounded-md border border-slate-200 bg-blue-50/50 px-4 py-3"
          >
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-blue-50 text-blue-600">
              <Building2 size={18} strokeWidth={1.75} aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-slate-600">
                {partner.role}
              </p>
              <p className="truncate text-[15px] font-semibold text-slate-900">{partner.company}</p>
            </div>
            <span className="chip">{t("partners.profileReady")}</span>
            <span className="tabular w-12 text-end text-[14px] font-semibold text-slate-600">
              {partner.share}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-md border border-slate-200 bg-white p-4">
          <Signature size={18} strokeWidth={1.75} className="text-blue-500" aria-hidden />
          <p className="mt-2 text-[13px] font-semibold text-slate-900">{t("partners.signature")}</p>
          <svg viewBox="0 0 120 32" className="mt-2 h-8 w-full" aria-hidden>
            <path
              d="M4 24c10-16 16 6 24-6s10 14 18 2 12 10 20-4 14 8 24-2"
              fill="none"
              stroke="#155eef"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-4">
          <Stamp size={18} strokeWidth={1.75} className="text-blue-500" aria-hidden />
          <p className="mt-2 text-[13px] font-semibold text-slate-900">{t("partners.stamp")}</p>
          <div className="mt-2 flex h-8 w-8 items-center justify-center rounded-pill border-2 border-blue-500/70 text-[9px] font-bold uppercase tracking-wider text-blue-500">
            JV
          </div>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-4">
          <Users size={18} strokeWidth={1.75} className="text-blue-600" aria-hidden />
          <p className="mt-2 text-[13px] font-semibold text-slate-900">{t("partners.reusable")}</p>
          <p className="mt-1 text-[12px] text-slate-600">{t("footer.badgeBody")}</p>
        </div>
      </div>
    </div>
  );
}

function DocumentsPanel() {
  const t = useTranslations("landing.preview");
  const docs = [
    t("documents.bidDocument"),
    t("documents.signatures"),
    t("documents.supporting"),
  ];

  return (
    <div>
      <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-slate-600">
        {t("documents.header")}
      </p>

      <ul className="mt-6 grid gap-3">
        {docs.map((doc) => (
          <li
            key={doc}
            className="flex items-center gap-3 rounded-md border border-slate-200 bg-blue-50/50 px-4 py-3"
          >
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-white text-blue-600 ring-1 ring-slate-200">
              <FileText size={17} strokeWidth={1.75} aria-hidden />
            </span>
            <p className="min-w-0 flex-1 truncate text-[15px] font-semibold text-slate-900">{doc}</p>
            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-success">
              <Check size={15} strokeWidth={2.5} aria-hidden />
              {t("documents.ready")}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <span
          role="note"
          className="inline-flex h-10 cursor-not-allowed items-center rounded-button border border-slate-300 bg-slate-100 px-4 text-[14px] font-semibold text-slate-600"
        >
          {t("documents.generatePreview")}
        </span>
        <p className="max-w-[420px] text-[12px] text-slate-600">{t("documents.note")}</p>
      </div>
    </div>
  );
}

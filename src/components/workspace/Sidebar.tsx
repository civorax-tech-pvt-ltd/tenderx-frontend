"use client";

import {
  Building2,
  Check,
  ChevronDown,
  ChevronsLeft,
  ExternalLink,
  FileDown,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Plus,
  Settings,
  UserPlus,
  Users,
  Contact,
  X,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useBid } from "@/lib/bid-context";
import { useStartNewBid } from "@/lib/bid-actions";
import { stepComplete } from "@/lib/validation";
import { isStep, useWorkspace, type StepKey, type ViewKey } from "@/lib/workspace-context";

type NavItem = { key: ViewKey; icon: LucideIcon };
type NavGroup = { id: "builder" | "library"; items: NavItem[] };

const GROUPS: NavGroup[] = [
  {
    id: "builder",
    items: [
      { key: "lead", icon: Building2 },
      { key: "first", icon: Users },
      { key: "second", icon: UserPlus },
      { key: "project", icon: FileText },
    ],
  },
  {
    id: "library",
    items: [
      { key: "bids", icon: FolderOpen },
      { key: "profiles", icon: Contact },
      { key: "documents", icon: FileDown },
    ],
  },
];

/** Which builder steps this user can see, and which are disabled for the current bid type. */
export function useStepAccess() {
  const { user } = useAuth();
  const { fieldData } = useBid();
  const isSingle = fieldData.BID_TYPE === "Single Bidder";
  return (step: StepKey) => {
    const permitted =
      step === "first" ? Boolean(user?.can_use_first_partner) : step === "second" ? Boolean(user?.can_use_second_partner) : true;
    const disabled = isSingle && (step === "first" || step === "second");
    return { visible: permitted, disabled };
  };
}

export function Sidebar({
  isOpen,
  onClose,
  collapsed,
  onToggleCollapsed,
}: {
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}) {
  const t = useTranslations("dash.nav");
  const { user } = useAuth();
  const { fieldData } = useBid();
  const { view, setView } = useWorkspace();
  const stepAccess = useStepAccess();
  const startNewBid = useStartNewBid();
  const [closedGroups, setClosedGroups] = useState<Record<string, boolean>>({});

  function go(key: ViewKey) {
    setView(key);
    onClose();
  }

  // Collapsed rail only applies on desktop; the mobile drawer is always full width.
  const narrow = collapsed ? "lg:w-[76px]" : "lg:w-64";
  const hideWhenNarrow = collapsed ? "lg:hidden" : "";

  return (
    <>
      {isOpen && <div onClick={onClose} className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" aria-hidden="true" />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 shrink-0 -translate-x-full flex-col border-r border-slate-200 bg-white transition-[transform,width] duration-200 dark:border-ink-800 dark:bg-ink-900 lg:static lg:translate-x-0 ${narrow} ${
          isOpen ? "translate-x-0" : ""
        }`}
      >
        {/* Brand */}
        <div className={`flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 px-4 dark:border-ink-800 ${collapsed ? "lg:justify-center lg:px-0" : ""}`}>
          <Image src="/logo.png" alt="TenderX" width={40} height={26} className="h-7 w-auto shrink-0" priority />
          <div className={`min-w-0 flex-1 ${hideWhenNarrow}`}>
            <p className="truncate text-[15px] font-bold leading-tight text-slate-900 dark:text-ink-100">
              Tender<span className="text-blue-500">X</span> Nepal
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-ink-500">{t("workspace")}</p>
          </div>
          <button
            onClick={onToggleCollapsed}
            className={`hidden rounded-xs p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-ink-500 dark:hover:bg-ink-800 dark:hover:text-ink-300 lg:block ${hideWhenNarrow}`}
            aria-label={t("collapse")}
            title={t("collapse")}
          >
            <ChevronsLeft size={18} />
          </button>
          <button onClick={onClose} className="rounded-xs p-1 text-slate-400 hover:text-slate-600 lg:hidden" aria-label={t("closeMenu")}>
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {collapsed && (
            <button
              onClick={onToggleCollapsed}
              className="mb-3 hidden h-10 w-full items-center justify-center rounded-sm text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-ink-500 dark:hover:bg-ink-800 dark:hover:text-ink-300 lg:flex"
              aria-label={t("expand")}
              title={t("expand")}
            >
              <ChevronsLeft size={18} className="rotate-180" />
            </button>
          )}

          <NavButton
            label={t("dashboard")}
            icon={LayoutDashboard}
            active={view === "dashboard"}
            collapsed={collapsed}
            onClick={() => go("dashboard")}
          />

          <button
            onClick={() => {
              startNewBid();
              onClose();
            }}
            title={collapsed ? t("newBid") : undefined}
            className={`mt-1 flex h-10 w-full items-center gap-3 rounded-sm px-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 ${
              collapsed ? "lg:justify-center lg:px-0" : ""
            }`}
          >
            <Plus size={18} className="shrink-0" />
            <span className={hideWhenNarrow}>{t("newBid")}</span>
          </button>

          {GROUPS.map((group) => {
            const isClosed = closedGroups[group.id] && !collapsed;
            return (
              <div key={group.id} className="mt-5">
                <button
                  onClick={() => setClosedGroups((prev) => ({ ...prev, [group.id]: !prev[group.id] }))}
                  className={`mb-1 flex w-full items-center justify-between px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 hover:text-slate-600 dark:text-ink-500 dark:hover:text-ink-400 ${hideWhenNarrow}`}
                >
                  {t(group.id)}
                  <ChevronDown size={14} className={`transition-transform ${isClosed ? "-rotate-90" : ""}`} />
                </button>
                {collapsed && <div className="mx-3 mb-2 hidden border-t border-slate-200 dark:border-ink-800 lg:block" />}

                {!isClosed && (
                  <div className="space-y-0.5">
                    {group.items.map(({ key, icon }) => {
                      if (isStep(key)) {
                        const access = stepAccess(key);
                        if (!access.visible) return null;
                        return (
                          <NavButton
                            key={key}
                            label={t(key)}
                            icon={icon}
                            active={view === key}
                            collapsed={collapsed}
                            disabled={access.disabled}
                            disabledHint={t("singleBidderHint")}
                            done={stepComplete(fieldData, key)}
                            onClick={() => go(key)}
                          />
                        );
                      }
                      return (
                        <NavButton
                          key={key}
                          label={t(key)}
                          icon={icon}
                          active={view === key}
                          collapsed={collapsed}
                          onClick={() => go(key)}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <div className="mt-5">
            <p className={`mb-1 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-ink-500 ${hideWhenNarrow}`}>
              {t("accountGroup")}
            </p>
            {collapsed && <div className="mx-3 mb-2 hidden border-t border-slate-200 dark:border-ink-800 lg:block" />}
            <NavButton
              label={t("account")}
              icon={Settings}
              active={view === "account"}
              collapsed={collapsed}
              onClick={() => go("account")}
            />
          </div>

          {user?.is_admin && (
            <div className="mt-5">
              <p className={`mb-1 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-ink-500 ${hideWhenNarrow}`}>
                {t("admin")}
              </p>
              <a
                href={process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3001"}
                target="_blank"
                rel="noopener noreferrer"
                title={collapsed ? t("adminDashboard") : undefined}
                className={`flex h-10 w-full items-center gap-3 rounded-sm px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-ink-100 ${
                  collapsed ? "lg:justify-center lg:px-0" : ""
                }`}
              >
                <ExternalLink size={18} className="shrink-0 text-slate-400 dark:text-ink-500" />
                <span className={hideWhenNarrow}>{t("adminDashboard")}</span>
              </a>
            </div>
          )}
        </nav>

        <div className={`shrink-0 border-t border-slate-200 px-4 py-3 dark:border-ink-800 ${hideWhenNarrow}`}>
          <p className="text-[10px] leading-tight text-slate-400 dark:text-ink-600">
            © {new Date().getFullYear()} TenderX Nepal
          </p>
          <p className="text-[10px] leading-tight text-slate-400 dark:text-ink-600">
            Developed by CivoraX Tech Pvt. Ltd.
          </p>
        </div>
      </aside>
    </>
  );
}

function NavButton({
  label,
  icon: Icon,
  active,
  collapsed,
  disabled,
  disabledHint,
  done,
  onClick,
}: {
  label: string;
  icon: LucideIcon;
  active: boolean;
  collapsed: boolean;
  disabled?: boolean;
  disabledHint?: string;
  done?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={disabled ? disabledHint : collapsed ? label : undefined}
      className={`relative flex h-10 w-full items-center gap-3 rounded-sm px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
        collapsed ? "lg:justify-center lg:px-0" : ""
      } ${active ? "bg-blue-50 text-blue-700 dark:bg-brand-900 dark:text-brand-300" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-ink-100"}`}
    >
      {active && <span className="absolute inset-y-2 left-0 w-[3px] rounded-r bg-blue-500" aria-hidden="true" />}
      <Icon size={18} className={`shrink-0 ${active ? "text-blue-600 dark:text-brand-400" : "text-slate-400 dark:text-ink-500"}`} />
      <span className={`flex-1 truncate text-left ${collapsed ? "lg:hidden" : ""}`}>{label}</span>
      {done && (
        <span
          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white ${
            collapsed ? "lg:absolute lg:right-2 lg:top-1.5 lg:h-3.5 lg:w-3.5" : ""
          }`}
        >
          <Check size={10} strokeWidth={3} />
        </span>
      )}
    </button>
  );
}

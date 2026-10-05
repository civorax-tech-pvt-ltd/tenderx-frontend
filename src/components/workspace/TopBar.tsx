"use client";

import { CalendarClock, ChevronRight, LogOut, Menu, Moon, Settings, ShieldCheck, Sun } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { isStep, useWorkspace } from "@/lib/workspace-context";

function initials(name: string | undefined, email: string | undefined) {
  const source = (name || email || "?").trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const t = useTranslations("dash.nav");
  const tAuth = useTranslations("auth");
  const tUser = useTranslations("dash.user");
  const locale = useLocale();
  const { user, logout } = useAuth();
  const { view, setView } = useWorkspace();
  const { theme, toggle: toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const group =
    view === "dashboard" || view === "account"
      ? null
      : isStep(view)
        ? t("builder")
        : t("library");
  const accessUntil = user?.trial_ends_at
    ? new Date(user.trial_ends_at).toLocaleDateString(locale === "ne" ? "ne-NP" : "en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 dark:border-ink-800 dark:bg-ink-900 sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <button
          onClick={onMenuClick}
          className="shrink-0 rounded-xs p-1.5 text-slate-500 hover:bg-slate-100 dark:text-ink-400 dark:hover:bg-ink-800 lg:hidden"
          aria-label={t("openMenu")}
        >
          <Menu size={20} />
        </button>
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
          <span className="hidden text-slate-400 dark:text-ink-500 sm:inline">{t("workspace")}</span>
          {group && (
            <>
              <ChevronRight size={14} className="hidden shrink-0 text-slate-300 dark:text-ink-600 sm:block" />
              <span className="hidden text-slate-400 dark:text-ink-500 sm:inline">{group}</span>
            </>
          )}
          <ChevronRight size={14} className="hidden shrink-0 text-slate-300 dark:text-ink-600 sm:block" />
          <span className="truncate font-semibold text-slate-700 dark:text-ink-200">{t(view)}</span>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="rounded-sm p-1.5 text-slate-500 transition hover:bg-slate-100 dark:text-ink-400 dark:hover:bg-ink-800"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Light mode" : "Dark mode"}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="hidden sm:block">
          <LanguageSwitcher />
        </div>

        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-800 text-sm font-bold text-white ring-offset-2 transition hover:ring-2 hover:ring-blue-200"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label={tUser("menu")}
          >
            {initials(user?.full_name, user?.email)}
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-12 z-50 w-72 animate-fade-slide overflow-hidden rounded-md border border-slate-200 bg-white shadow-md-blue dark:border-ink-800 dark:bg-ink-900"
            >
              <div className="border-b border-slate-100 px-4 py-3.5 dark:border-ink-800">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-ink-100">{user?.full_name || user?.email}</p>
                <p className="truncate text-xs text-slate-500 dark:text-ink-400">{user?.email}</p>
              </div>
              <div className="space-y-2 px-4 py-3 text-[13px] text-slate-600 dark:text-ink-300">
                {user?.is_admin ? (
                  <p className="flex items-center gap-2">
                    <ShieldCheck size={15} className="text-blue-500" />
                    {tUser("adminAccount")}
                  </p>
                ) : (
                  accessUntil && (
                    <p className="flex items-center gap-2">
                      <CalendarClock size={15} className="text-slate-400" />
                      {tUser("accessUntil", { date: accessUntil })}
                    </p>
                  )
                )}
                <div className="sm:hidden">
                  <LanguageSwitcher />
                </div>
              </div>
              <button
                role="menuitem"
                onClick={() => { setView("account"); setMenuOpen(false); }}
                className="flex w-full items-center gap-2 border-t border-slate-100 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-ink-800 dark:text-ink-200 dark:hover:bg-ink-800"
              >
                <Settings size={16} className="text-slate-400" />
                {tUser("accountSettings")}
              </button>
              <button
                role="menuitem"
                onClick={logout}
                className="flex w-full items-center gap-2 border-t border-slate-100 px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:border-ink-800 dark:hover:bg-red-900/20"
              >
                <LogOut size={16} />
                {tAuth("logout")}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

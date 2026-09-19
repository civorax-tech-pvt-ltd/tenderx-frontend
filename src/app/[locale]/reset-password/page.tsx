"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { api, ApiError, setToken } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function ResetPasswordPage() {
  const t = useTranslations("auth");
  const tApp = useTranslations("app");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { refreshUser } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      setError("Missing reset token.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      const { access_token } = await api.post<{ access_token: string }>("/auth/reset-password", {
        token,
        new_password: newPassword,
      });
      setToken(access_token);
      await refreshUser();
      router.push("/bid");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : tCommon("somethingWrong"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-50 px-4 dark:bg-ink-950">
      <div className="w-full max-w-sm rounded-2xl border border-ink-200 bg-white p-8 shadow-sm dark:border-ink-800 dark:bg-ink-900">
        <div className="mb-6 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white">
            TX
          </div>
          <p className="text-sm font-semibold text-ink-900 dark:text-ink-100">{tApp("name")}</p>
        </div>

        <h1 className="text-lg font-semibold text-ink-900 dark:text-ink-100">{t("resetPassword")}</h1>

        {!token ? (
          <p className="mt-4 text-sm text-red-500">Missing or invalid reset link.</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-ink-600 dark:text-ink-400">{t("newPassword")}</span>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-10 w-full rounded-lg border border-ink-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-ink-700 dark:bg-ink-950 dark:text-ink-100"
              />
            </label>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 w-full rounded-lg bg-brand-500 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
            >
              {isSubmitting ? "…" : t("resetPassword")}
            </button>
          </form>
        )}

        <p className="mt-5 text-center text-xs text-ink-500">
          <Link href="/login" className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">
            {t("backToLogin")}
          </Link>
        </p>
      </div>
    </main>
  );
}

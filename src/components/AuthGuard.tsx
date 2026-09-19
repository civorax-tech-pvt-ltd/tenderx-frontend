"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { InvoiceScreen } from "@/components/InvoiceScreen";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const t = useTranslations("auth");
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50 dark:bg-ink-950">
        <p className="text-sm text-ink-400">{t("loading")}</p>
      </div>
    );
  }

  if (!user.is_admin && !user.email_verified) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4 dark:bg-ink-950">
        <div className="w-full max-w-sm rounded-2xl border border-ink-200 bg-white p-8 text-center shadow-sm dark:border-ink-800 dark:bg-ink-900">
          <h1 className="text-lg font-semibold text-ink-900 dark:text-ink-100">Verify your email</h1>
          <p className="mt-2 text-sm text-ink-500">
            We sent a verification link to <strong>{user.email}</strong>. Click it to activate your account.
          </p>
          <button
            onClick={async () => {
              await api.post("/auth/resend-verification");
              setResent(true);
            }}
            disabled={resent}
            className="mt-5 h-9 w-full rounded-lg border border-ink-200 text-sm font-medium text-ink-600 hover:bg-ink-50 disabled:opacity-50 dark:border-ink-700 dark:text-ink-400 dark:hover:bg-ink-800"
          >
            {resent ? "Verification email sent" : "Resend verification email"}
          </button>
          <button
            onClick={logout}
            className="mt-3 h-9 w-full rounded-lg text-sm font-medium text-ink-500 hover:text-red-500"
          >
            {t("logout")}
          </button>
        </div>
      </div>
    );
  }

  if (!user.is_admin && user.trial_expired) {
    return <InvoiceScreen />;
  }

  return <>{children}</>;
}

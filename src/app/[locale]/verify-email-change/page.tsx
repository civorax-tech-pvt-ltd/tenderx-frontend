"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { AuthShell } from "@/components/auth/AuthShell";
import { Spinner, SuccessMark } from "@/components/auth/AuthStatus";

export default function VerifyEmailChangePage() {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) { setStatus("error"); setError("No token provided."); return; }
    let cancelled = false;
    api
      .post("/auth/verify-email-change", { token })
      .then(async () => {
        if (cancelled) return;
        await refreshUser();
        if (!cancelled) setStatus("success");
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus("error");
        setError(err instanceof ApiError ? err.message : "Invalid or expired link.");
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (status === "verifying") {
    return (
      <AuthShell title="Confirming your new email" subtitle="Please wait…">
        <p className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-4 py-4 text-[15px] font-medium text-slate-700">
          <Spinner className="text-blue-500" />
          Verifying…
        </p>
      </AuthShell>
    );
  }

  if (status === "success") {
    return (
      <AuthShell title="Email updated!" subtitle="Your email address has been changed successfully.">
        <div className="text-center"><SuccessMark label="Email updated" /></div>
        <Link href={`/${locale}/bid`} className="btn-primary w-full">Go to workspace</Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Link expired" subtitle={error}>
      <Link href={`/${locale}/login`} className="btn-primary w-full">Back to login</Link>
    </AuthShell>
  );
}

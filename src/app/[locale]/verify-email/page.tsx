"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type Status = "verifying" | "success" | "error";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState<Status>("verifying");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("Missing verification token.");
      return;
    }
    api
      .post("/auth/verify-email", { token })
      .then(async () => {
        await refreshUser();
        setStatus("success");
      })
      .catch((err) => {
        setStatus("error");
        setError(err instanceof ApiError ? err.message : "Verification failed.");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-50 px-4 dark:bg-ink-950">
      <div className="w-full max-w-sm rounded-2xl border border-ink-200 bg-white p-8 text-center shadow-sm dark:border-ink-800 dark:bg-ink-900">
        <div className="mx-auto mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white">
          TX
        </div>

        {status === "verifying" && <p className="text-sm text-ink-500">Verifying your email…</p>}

        {status === "success" && (
          <>
            <h1 className="text-lg font-semibold text-ink-900 dark:text-ink-100">Email verified</h1>
            <p className="mt-2 text-sm text-ink-500">Your account is ready to use.</p>
            <Link
              href="/bid"
              className="mt-5 inline-flex h-10 items-center rounded-lg bg-brand-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
            >
              Go to Bid Workspace
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-lg font-semibold text-ink-900 dark:text-ink-100">Verification failed</h1>
            <p className="mt-2 text-sm text-red-500">{error}</p>
            <Link href="/login" className="mt-5 inline-block text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">
              Back to login
            </Link>
          </>
        )}
      </div>
    </main>
  );
}

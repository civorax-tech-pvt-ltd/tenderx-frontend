"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { api, ApiError, getToken } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Invoice = {
  id: string;
  amount: number;
  duration_days: number;
  status: "pending" | "submitted" | "verified" | "rejected";
  proof_reference: string | null;
  submitted_at: string | null;
  created_at: string;
};

type CurrentInvoiceResponse = {
  locked: boolean;
  invoice: Invoice | null;
  qr_code_available: boolean;
  message: string | null;
};

export function InvoiceScreen() {
  const { logout, refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [reference, setReference] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["billing-me"],
    queryFn: () => api.get<CurrentInvoiceResponse>("/billing/me"),
  });

  useEffect(() => {
    if (!data?.qr_code_available) return;
    let objectUrl: string | null = null;
    fetch(`${API_URL}/billing/qr-code`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then((res) => (res.ok ? res.blob() : null))
      .then((blob) => {
        if (blob) {
          objectUrl = URL.createObjectURL(blob);
          setQrUrl(objectUrl);
        }
      });
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [data?.qr_code_available]);

  const submitProof = useMutation({
    mutationFn: async () => {
      if (!data?.invoice) return;
      const form = new FormData();
      form.append("proof_reference", reference);
      if (file) form.append("file", file);
      await api.post(`/billing/invoices/${data.invoice.id}/submit-proof`, form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing-me"] });
      refreshUser();
    },
    onError: (err) => alert(err instanceof ApiError ? err.message : "Failed to submit payment proof."),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50 dark:bg-ink-950">
        <p className="text-sm text-ink-400">Loading…</p>
      </div>
    );
  }

  const invoice = data?.invoice ?? null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4 py-8 dark:bg-ink-950">
      <div className="w-full max-w-sm rounded-2xl border border-ink-200 bg-white p-8 shadow-sm dark:border-ink-800 dark:bg-ink-900">
        <div className="mb-5 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white">
            TX
          </div>
          <p className="text-sm font-semibold text-ink-900 dark:text-ink-100">TenderX Nepal</p>
        </div>

        {!invoice && (
          <>
            <h1 className="text-lg font-semibold text-ink-900 dark:text-ink-100">Access expired</h1>
            <p className="mt-2 text-sm text-ink-500">
              {data?.message || "Your trial has ended. Contact support to continue."}
            </p>
          </>
        )}

        {invoice && invoice.status === "submitted" && (
          <>
            <h1 className="text-lg font-semibold text-ink-900 dark:text-ink-100">Payment submitted</h1>
            <p className="mt-2 text-sm text-ink-500">
              We've received your payment proof and it's awaiting verification. This usually doesn't take long —
              check back soon.
            </p>
            {invoice.proof_reference && (
              <p className="mt-2 text-xs text-ink-400">Reference: {invoice.proof_reference}</p>
            )}
          </>
        )}

        {invoice && (invoice.status === "pending" || invoice.status === "rejected") && (
          <>
            <h1 className="text-lg font-semibold text-ink-900 dark:text-ink-100">Payment due</h1>
            {invoice.status === "rejected" && (
              <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-500/10 dark:text-red-400">
                Your previous payment proof was rejected. Please check the details and resubmit.
              </p>
            )}
            <div className="mt-3 rounded-lg bg-ink-50 p-3 dark:bg-ink-800">
              <p className="text-2xl font-semibold text-ink-900 dark:text-ink-100">
                NPR {invoice.amount.toLocaleString()}
              </p>
              <p className="text-xs text-ink-500">for {invoice.duration_days} days of access</p>
            </div>

            {qrUrl ? (
              <img src={qrUrl} alt="Payment QR code" className="mx-auto mt-4 h-48 w-48 rounded-lg border border-ink-200 object-contain dark:border-ink-700" />
            ) : (
              <p className="mt-4 text-xs text-ink-400">
                {data?.qr_code_available ? "Loading QR code…" : "No payment QR code has been set up yet — contact support."}
              </p>
            )}

            <div className="mt-5 space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-ink-600 dark:text-ink-400">
                  Transaction reference (optional)
                </span>
                <input
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. transaction ID"
                  className="h-9 w-full rounded-lg border border-ink-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-ink-700 dark:bg-ink-950 dark:text-ink-100"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-ink-600 dark:text-ink-400">
                  Payment screenshot (optional)
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="block w-full text-xs text-ink-500 file:mr-3 file:h-8 file:rounded-lg file:border file:border-ink-200 file:bg-white file:px-3 file:text-xs file:font-medium file:text-ink-600 dark:file:border-ink-700 dark:file:bg-ink-950 dark:file:text-ink-400"
                />
              </label>
              <button
                onClick={() => submitProof.mutate()}
                disabled={submitProof.isPending}
                className="h-10 w-full rounded-lg bg-brand-500 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
              >
                {submitProof.isPending ? "Submitting…" : "I've Paid — Submit Proof"}
              </button>
            </div>
          </>
        )}

        <button onClick={logout} className="mt-4 h-9 w-full rounded-lg text-sm font-medium text-ink-500 hover:text-red-500">
          Log Out
        </button>
      </div>
    </div>
  );
}

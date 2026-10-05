"use client";

import { KeyRound, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AuthField, PasswordField } from "@/components/auth/AuthField";
import { api, ApiError } from "@/lib/api";
import { useWorkspace } from "@/lib/workspace-context";

export function AccountView() {
  const t = useTranslations("account");
  const { notify } = useWorkspace();

  // Change password
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  // Change email
  const [newEmail, setNewEmail] = useState("");
  const [emailPw, setEmailPw] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwLoading(true);
    try {
      await api.put("/auth/me/password", { current_password: pwCurrent, new_password: pwNew });
      notify("success", t("pwSuccess"));
      setPwCurrent("");
      setPwNew("");
    } catch (err) {
      notify("error", err instanceof ApiError ? err.message : t("pwError"));
    } finally {
      setPwLoading(false);
    }
  }

  async function handleChangeEmail(e: React.FormEvent) {
    e.preventDefault();
    setEmailLoading(true);
    try {
      await api.put("/auth/me/email", { email: newEmail, password: emailPw });
      setEmailSent(true);
      setNewEmail("");
      setEmailPw("");
    } catch (err) {
      notify("error", err instanceof ApiError ? err.message : t("emailError"));
    } finally {
      setEmailLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <h1 className="text-xl font-bold text-slate-900">{t("title")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>
      </div>

      {/* Change password */}
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <KeyRound size={18} className="text-blue-500" />
          <h2 className="font-semibold text-slate-800">{t("pwTitle")}</h2>
        </div>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <PasswordField
            label={t("currentPw")}
            value={pwCurrent}
            onChange={setPwCurrent}
            required
            autoComplete="current-password"
          />
          <PasswordField
            label={t("newPw")}
            value={pwNew}
            onChange={setPwNew}
            required
            minLength={8}
            autoComplete="new-password"
          />
          <button type="submit" disabled={pwLoading} className="btn-primary w-full">
            {pwLoading ? t("saving") : t("pwSave")}
          </button>
        </form>
      </section>

      {/* Change email */}
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <Mail size={18} className="text-blue-500" />
          <h2 className="font-semibold text-slate-800">{t("emailTitle")}</h2>
        </div>
        {emailSent ? (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {t("emailSent")}
          </div>
        ) : (
          <form onSubmit={handleChangeEmail} className="space-y-4">
            <AuthField
              label={t("newEmail")}
              type="email"
              value={newEmail}
              onChange={setNewEmail}
              required
              autoComplete="email"
            />
            <PasswordField
              label={t("confirmPw")}
              value={emailPw}
              onChange={setEmailPw}
              required
              autoComplete="current-password"
            />
            <p className="text-xs text-slate-500">{t("emailHint")}</p>
            <button type="submit" disabled={emailLoading} className="btn-primary w-full">
              {emailLoading ? t("sending") : t("emailSave")}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}

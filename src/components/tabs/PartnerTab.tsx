"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { FormCard } from "@/components/ui/FormCard";
import { TextField } from "@/components/ui/FormField";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useBid, type DraftOut } from "@/lib/bid-context";
import {
  ATTACHMENT_CATEGORIES,
  PERCENTAGE_KEYS,
  roleFieldKey,
  roleImageKeys,
  type PartnerRole,
} from "@/lib/constants";

type ProfileSummary = { id: string; name: string; role: string; partner_name: string };
type ProfileOut = {
  id: string;
  partner_name: string;
  partner_short: string;
  address: string;
  partner_ceo: string;
  partner_md1: string;
  partner_md2: string;
};

export function PartnerTab({ role }: { role: PartnerRole }) {
  const t = useTranslations("partner");
  const { user } = useAuth();
  const { fieldData, setFields } = useBid();
  const queryClient = useQueryClient();
  const [profileName, setProfileName] = useState("");
  const [selectedProfileId, setSelectedProfileId] = useState("");

  const locked = (role === "first" && !user?.can_use_first_partner) || (role === "second" && !user?.can_use_second_partner);

  const f = (suffix: string) => roleFieldKey(role, suffix);
  const imgKeys = roleImageKeys(role);
  const percentageKey = PERCENTAGE_KEYS[role];

  const { data: profiles } = useQuery({
    queryKey: ["profiles"],
    queryFn: () => api.get<ProfileSummary[]>("/profiles"),
  });

  const loadProfile = useMutation({
    mutationFn: (profileId: string) => api.get<ProfileOut>(`/profiles/${profileId}`),
    onSuccess: (profile) => {
      setFields({
        [f("PARTNER_NAME")]: profile.partner_name,
        [f("PARTNER_SHORT")]: profile.partner_short,
        [f("ADDRESS")]: profile.address,
        [f("PARTNER_CEO")]: profile.partner_ceo,
        [f("PARTNER_MD1")]: profile.partner_md1,
        [f("PARTNER_MD2")]: profile.partner_md2,
      });
    },
  });

  const saveAsProfile = useMutation({
    mutationFn: () =>
      api.post("/profiles", {
        name: profileName || fieldData[f("PARTNER_NAME")] || t("untitledPartner"),
        role,
        partner_name: fieldData[f("PARTNER_NAME")] ?? "",
        partner_short: fieldData[f("PARTNER_SHORT")] ?? "",
        address: fieldData[f("ADDRESS")] ?? "",
        partner_ceo: fieldData[f("PARTNER_CEO")] ?? "",
        partner_md1: fieldData[f("PARTNER_MD1")] ?? "",
        partner_md2: fieldData[f("PARTNER_MD2")] ?? "",
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profiles"] }),
  });

  if (locked) {
    return (
      <div className="rounded-xl border border-dashed border-ink-300 bg-white p-8 text-center dark:border-ink-700 dark:bg-ink-900">
        <p className="text-sm font-medium text-ink-700 dark:text-ink-300">This tab isn't available on your account yet.</p>
        <p className="mt-1 text-xs text-ink-500">Contact your administrator to enable access.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <FormCard title={t("reusableProfile")} subtitle={t("reusableProfileSubtitle")}>
        <label className="sm:col-span-2">
          <span className="mb-1.5 block text-xs font-medium text-ink-600 dark:text-ink-400">{t("loadProfile")}</span>
          <div className="flex gap-2">
            <select
              value={selectedProfileId}
              onChange={(e) => setSelectedProfileId(e.target.value)}
              className="h-9 flex-1 rounded-lg border border-ink-200 bg-white px-3 text-sm text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-ink-700 dark:bg-ink-950 dark:text-ink-100"
            >
              <option value="">{t("selectSavedProfile")}</option>
              {(profiles ?? []).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.partner_name})
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={!selectedProfileId || loadProfile.isPending}
              onClick={() => loadProfile.mutate(selectedProfileId)}
              className="h-9 shrink-0 rounded-lg bg-brand-500 px-3 text-sm font-medium text-white transition-colors hover:bg-brand-600 disabled:opacity-40"
            >
              {t("loadProfile")}
            </button>
          </div>
        </label>

        <label className="sm:col-span-2">
          <span className="mb-1.5 block text-xs font-medium text-ink-600 dark:text-ink-400">{t("profileName")}</span>
          <div className="flex gap-2">
            <input
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder={fieldData[f("PARTNER_NAME")] || t("profileNamePlaceholder")}
              className="h-9 flex-1 rounded-lg border border-ink-200 bg-white px-3 text-sm text-ink-900 outline-none placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-ink-700 dark:bg-ink-950 dark:text-ink-100"
            />
            <button
              type="button"
              disabled={saveAsProfile.isPending}
              onClick={() => saveAsProfile.mutate()}
              className="h-9 shrink-0 rounded-lg border border-ink-200 px-3 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-50 disabled:opacity-40 dark:border-ink-700 dark:text-ink-300 dark:hover:bg-ink-800"
            >
              {t("saveAsProfile")}
            </button>
          </div>
        </label>
      </FormCard>

      <FormCard title={t("organisationDetails")}>
        <TextField fieldKey={f("PARTNER_NAME")} label={t("partnerName")} span={2} />
        <div className="sm:col-span-2">
          <ImageUpload imgKey={imgKeys.stamp} label={t("stamp")} />
        </div>
        <TextField fieldKey={f("PARTNER_SHORT")} label={t("shortName")} />
        <TextField fieldKey={f("ADDRESS")} label={t("address")} />
      </FormCard>

      <FormCard title={t("authorisedPersons")}>
        <TextField fieldKey={f("PARTNER_CEO")} label={t("ceo")} span={2} />
        <div className="sm:col-span-2">
          <ImageUpload imgKey={imgKeys.ceoSig} label={t("ceoSignature")} />
        </div>
        <TextField fieldKey={f("PARTNER_MD1")} label={t("md1")} span={2} />
        <div className="sm:col-span-2">
          <ImageUpload imgKey={imgKeys.md1} label={t("md1Signature")} />
        </div>
        <TextField fieldKey={f("PARTNER_MD2")} label={t("md2")} span={2} />
        <div className="sm:col-span-2">
          <ImageUpload imgKey={imgKeys.md2} label={t("md2Signature")} />
        </div>
      </FormCard>

      <FormCard title={t("ownership")}>
        <TextField fieldKey={percentageKey} label={t("percentage")} mono />
      </FormCard>

      <AttachmentsCard role={role} />
    </div>
  );
}

function AttachmentsCard({ role }: { role: PartnerRole }) {
  const t = useTranslations("attachments");
  const tPartner = useTranslations("partner");
  const { draftId } = useBid();
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const queryClient = useQueryClient();

  const { data: draft } = useQuery({
    queryKey: ["draft", draftId],
    queryFn: () => api.get<DraftOut & { session_docs: { id: string; role: string; category: string; original_filename: string }[] }>(`/drafts/${draftId}`),
    enabled: Boolean(draftId),
  });

  const upload = useMutation({
    mutationFn: ({ category, file }: { category: string; file: File }) => {
      const form = new FormData();
      form.append("role", role);
      form.append("category", category);
      form.append("file", file);
      return api.post(`/drafts/${draftId}/session-docs`, form);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["draft", draftId] }),
  });

  const remove = useMutation({
    mutationFn: (docId: string) => api.del(`/drafts/${draftId}/session-docs/${docId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["draft", draftId] }),
  });

  const docsForRole = (draft?.session_docs ?? []).filter((d) => d.role === role);

  return (
    <section className="rounded-xl border border-ink-200 bg-white p-4 shadow-sm dark:border-ink-800 dark:bg-ink-900 sm:p-5">
      <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-100">{tPartner("supportingDocuments")}</h3>
      {!draftId && <p className="mt-1 text-xs text-ink-500">{tPartner("saveDraftFirstAttach")}</p>}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ATTACHMENT_CATEGORIES.map((category) => {
          const docs = docsForRole.filter((d) => d.category === category);
          return (
            <div key={category} className="rounded-lg border border-ink-100 p-3 dark:border-ink-800">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-ink-700 dark:text-ink-300">{t(category as any)}</p>
                <button
                  type="button"
                  disabled={!draftId}
                  onClick={() => inputRefs.current[category]?.click()}
                  className="text-xs font-medium text-brand-600 hover:text-brand-700 disabled:opacity-40 dark:text-brand-400"
                >
                  {t("upload")}
                </button>
                <input
                  ref={(el) => {
                    inputRefs.current[category] = el;
                  }}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) upload.mutate({ category, file });
                    e.target.value = "";
                  }}
                />
              </div>
              <ul className="mt-2 space-y-1">
                {docs.map((doc) => (
                  <li key={doc.id} className="flex items-center justify-between text-xs text-ink-500">
                    <span className="truncate">{doc.original_filename}</span>
                    <button onClick={() => remove.mutate(doc.id)} className="text-red-500 hover:text-red-600">
                      {t("remove")}
                    </button>
                  </li>
                ))}
                {docs.length === 0 && <li className="text-xs text-ink-400">{tPartner("noFilesYet")}</li>}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookmarkPlus,
  Building2,
  Download,
  FileStack,
  Link2,
  Lock,
  Paperclip,
  PieChart,
  RefreshCw,
  Trash2,
  Unlink,
  UserCheck,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { FormCard } from "@/components/ui/FormCard";
import { TextField } from "@/components/ui/FormField";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { btn, cardClass, inputClass, labelClass } from "@/components/ui/styles";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useBid, type DraftOut } from "@/lib/bid-context";
import { errorMessage } from "@/lib/download";
import {
  ATTACHMENT_CATEGORIES,
  PERCENTAGE_KEYS,
  PROFILE_FIELD_MAP,
  roleFieldKey,
  roleImageKeys,
  type PartnerRole,
  type ProfileFieldKey,
} from "@/lib/constants";
import { percentageTotal } from "@/lib/validation";
import { useWorkspace } from "@/lib/workspace-context";
import { useProfiles } from "@/lib/workspace-queries";

export function PartnerTab({ role }: { role: PartnerRole }) {
  const t = useTranslations("partner");
  const tDash = useTranslations("dash.form");
  const { user } = useAuth();
  const { fieldData } = useBid();

  const locked = (role === "first" && !user?.can_use_first_partner) || (role === "second" && !user?.can_use_second_partner);

  const f = (suffix: string) => roleFieldKey(role, suffix);
  const imgKeys = roleImageKeys(role);
  const percentageKey = PERCENTAGE_KEYS[role];
  const split = percentageTotal(fieldData);

  if (locked) {
    return (
      <div className={`${cardClass} flex flex-col items-center px-6 py-14 text-center`}>
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <Lock size={22} />
        </span>
        <p className="mt-4 text-base font-semibold text-slate-900">{tDash("lockedTitle")}</p>
        <p className="mt-1 max-w-sm text-sm text-slate-500">{tDash("lockedBody")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <LoadProfileCard role={role} />

      <FormCard title={t("organisationDetails")} subtitle={tDash("organisationHint")} icon={Building2}>
        <TextField fieldKey={f("PARTNER_NAME")} label={t("partnerName")} placeholder={t("profileNamePlaceholder")} span={2} />
        <TextField fieldKey={f("PARTNER_SHORT")} label={t("shortName")} placeholder="ABC" hint={tDash("shortNameHint")} />
        <TextField fieldKey={f("ADDRESS")} label={t("address")} />
        <div className="sm:col-span-2">
          <ImageUpload imgKey={imgKeys.stamp} label={t("stamp")} />
        </div>
      </FormCard>

      <FormCard title={t("authorisedPersons")} subtitle={tDash("personsHint")} icon={UserCheck}>
        <TextField fieldKey={f("PARTNER_CEO")} label={t("ceo")} />
        <div className="sm:pt-[26px]">
          <ImageUpload imgKey={imgKeys.ceoSig} label={t("ceoSignature")} />
        </div>
        <TextField fieldKey={f("PARTNER_MD1")} label={t("md1")} />
        <div className="sm:pt-[26px]">
          <ImageUpload imgKey={imgKeys.md1} label={t("md1Signature")} />
        </div>
        <TextField fieldKey={f("PARTNER_MD2")} label={t("md2")} />
        <div className="sm:pt-[26px]">
          <ImageUpload imgKey={imgKeys.md2} label={t("md2Signature")} />
        </div>
      </FormCard>

      <FormCard title={t("ownership")} subtitle={tDash("ownershipHint")} icon={PieChart}>
        <TextField
          fieldKey={percentageKey}
          label={t("percentage")}
          mono
          suffix="%"
          inputMode="decimal"
          placeholder="0"
          hint={tDash("splitTotalNow", { value: split })}
        />
      </FormCard>

      <SaveProfileCard role={role} />

      <AttachmentsCard role={role} />
    </div>
  );
}

function AttachmentsCard({ role }: { role: PartnerRole }) {
  const t = useTranslations("attachments");
  const tPartner = useTranslations("partner");
  const tDash = useTranslations("dash.form");
  const { draftId } = useBid();
  const { notify } = useWorkspace();
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const queryClient = useQueryClient();

  const { data: draft } = useQuery({
    queryKey: ["draft", draftId],
    queryFn: () =>
      api.get<DraftOut & { session_docs: { id: string; role: string; category: string; original_filename: string }[] }>(
        `/drafts/${draftId}`
      ),
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
    onError: (err) => notify("error", errorMessage(err, tDash("uploadFailed"))),
  });

  const remove = useMutation({
    mutationFn: (docId: string) => api.del(`/drafts/${draftId}/session-docs/${docId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["draft", draftId] }),
    onError: (err) => notify("error", errorMessage(err, tDash("removeFailed"))),
  });

  const docsForRole = (draft?.session_docs ?? []).filter((d) => d.role === role);

  return (
    <FormCard
      title={tPartner("supportingDocuments")}
      subtitle={draftId ? tDash("attachmentsHint") : tPartner("saveDraftFirstAttach")}
      icon={FileStack}
    >
      {ATTACHMENT_CATEGORIES.map((category) => {
        const docs = docsForRole.filter((d) => d.category === category);
        return (
          <div key={category} className="rounded-sm border border-slate-200 bg-slate-50/50 p-3.5">
            <div className="flex items-center justify-between gap-2">
              <p className="flex min-w-0 items-center gap-2 text-[13px] font-semibold text-slate-800">
                <span className="truncate">{t(category as any)}</span>
                {docs.length > 0 && (
                  <span className="rounded-full bg-blue-100 px-1.5 text-[11px] font-bold text-blue-700">{docs.length}</span>
                )}
              </p>
              <button
                type="button"
                disabled={!draftId || upload.isPending}
                onClick={() => inputRefs.current[category]?.click()}
                className={`${btn.secondary} ${btn.sm}`}
              >
                <Paperclip size={13} />
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
            <ul className="mt-2.5 space-y-1.5">
              {docs.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center justify-between gap-2 rounded-xs bg-white px-2.5 py-1.5 text-xs text-slate-600 ring-1 ring-slate-200"
                >
                  <span className="truncate">{doc.original_filename}</span>
                  <button
                    onClick={() => remove.mutate(doc.id)}
                    className="shrink-0 text-slate-400 hover:text-red-600"
                    aria-label={t("remove")}
                    title={t("remove")}
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
              {docs.length === 0 && <li className="text-xs text-slate-400">{tPartner("noFilesYet")}</li>}
            </ul>
          </div>
        );
      })}
    </FormCard>
  );
}

type ProfileOut = { id: string; name: string } & Record<ProfileFieldKey, string>;

/** Load a saved partner profile into this role and keep it in sync. */
function LoadProfileCard({ role }: { role: PartnerRole }) {
  const t = useTranslations("partner");
  const tDash = useTranslations("dash.form");
  const tP = useTranslations("dash.profile");
  const { fieldData, setFields, linkedProfiles, setLinkedProfile } = useBid();
  const { notify } = useWorkspace();
  const queryClient = useQueryClient();
  const [selectedProfileId, setSelectedProfileId] = useState("");
  const confirm = useConfirm();

  const f = (suffix: string) => roleFieldKey(role, suffix);
  const current = Object.fromEntries(
    PROFILE_FIELD_MAP.map(([col, suffix]) => [col, fieldData[f(suffix)] ?? ""])
  ) as Record<ProfileFieldKey, string>;

  const profiles = useProfiles();
  const linkedId = linkedProfiles[role];
  const linkedSummary = profiles.data?.find((p) => p.id === linkedId);

  const linkedProfile = useQuery({
    queryKey: ["profile", linkedId],
    queryFn: () => api.get<ProfileOut>(`/profiles/${linkedId}`),
    enabled: Boolean(linkedSummary),
  });

  const outOfSync =
    linkedProfile.data !== undefined &&
    PROFILE_FIELD_MAP.some(([col]) => (linkedProfile.data[col] ?? "") !== current[col]);

  function refreshProfiles(id?: string) {
    queryClient.invalidateQueries({ queryKey: ["profiles"] });
    if (id) queryClient.invalidateQueries({ queryKey: ["profile", id] });
  }

  const loadProfile = useMutation({
    mutationFn: (profileId: string) => api.get<ProfileOut>(`/profiles/${profileId}`),
    onSuccess: (profile) => {
      setFields(Object.fromEntries(PROFILE_FIELD_MAP.map(([col, suffix]) => [f(suffix), profile[col] ?? ""])));
      setLinkedProfile(role, profile.id);
      setSelectedProfileId("");
      queryClient.setQueryData(["profile", profile.id], profile);
      notify("success", tDash("profileLoaded", { name: profile.partner_name }));
    },
    onError: (err) => notify("error", errorMessage(err, tDash("profileLoadFailed"))),
  });

  const updateProfile = useMutation({
    mutationFn: () => api.put<ProfileOut>(`/profiles/${linkedId}`, current),
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile", profile.id], profile);
      refreshProfiles();
      notify("success", tP("updated", { name: profile.name }));
    },
    onError: (err) => notify("error", errorMessage(err, tP("updateFailed"))),
  });

  const deleteProfile = useMutation({
    mutationFn: () => api.del(`/profiles/${linkedId}`),
    onSuccess: () => {
      setLinkedProfile(role, null);
      refreshProfiles();
      notify("success", tP("deleted"));
    },
    onError: (err) => notify("error", errorMessage(err, tP("deleteFailed"))),
  });

  return (
    <FormCard title={t("reusableProfile")} subtitle={t("reusableProfileSubtitle")} icon={BookmarkPlus}>
      {linkedSummary && (
        <div className="rounded-sm border border-blue-200 bg-blue-50/60 p-3.5 sm:col-span-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-blue-500 text-white">
                <Link2 size={16} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">{tP("linkedTo")}</p>
                <p className="truncate text-sm font-semibold text-slate-900">
                  {linkedSummary.name}
                  {linkedSummary.partner_name && linkedSummary.partner_name !== linkedSummary.name && (
                    <span className="font-normal text-slate-500"> · {linkedSummary.partner_name}</span>
                  )}
                </p>
                <p className={`mt-0.5 text-xs ${outOfSync ? "font-semibold text-amber-700" : "text-slate-500"}`}>
                  {outOfSync ? tP("outOfSync") : tP("inSync")}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => updateProfile.mutate()}
                disabled={!outOfSync || updateProfile.isPending}
                className={`${btn.primary} ${btn.sm}`}
                title={!outOfSync ? tP("nothingToUpdate") : undefined}
              >
                <RefreshCw size={13} className={updateProfile.isPending ? "animate-spin" : ""} />
                {t("updateProfile")}
              </button>
              <button
                type="button"
                onClick={() => setLinkedProfile(role, null)}
                className={`${btn.secondary} ${btn.sm}`}
                title={tP("unlinkHint")}
              >
                <Unlink size={13} />
                {tP("unlink")}
              </button>
              <button
                type="button"
                onClick={async () => {
                  const ok = await confirm({ message: tP("confirmDelete", { name: linkedSummary.name }), confirmLabel: "Delete", variant: "danger" });
                  if (ok) deleteProfile.mutate();
                }}
                disabled={deleteProfile.isPending}
                className={`${btn.danger} ${btn.sm}`}
                aria-label={t("deleteProfile")}
                title={t("deleteProfile")}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="sm:col-span-2">
        <span className={labelClass}>{linkedSummary ? tP("loadDifferent") : t("loadProfile")}</span>
        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={selectedProfileId}
            onChange={(e) => setSelectedProfileId(e.target.value)}
            className={`${inputClass} sm:flex-1`}
          >
            <option value="">{(profiles.data ?? []).length ? t("selectSavedProfile") : tDash("noProfilesYet")}</option>
            {(profiles.data ?? []).map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.partner_name})
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={!selectedProfileId || loadProfile.isPending}
            onClick={() => loadProfile.mutate(selectedProfileId)}
            className={btn.primary}
          >
            <Download size={15} />
            {t("loadProfile")}
          </button>
        </div>
      </div>
    </FormCard>
  );
}

/** Save current partner details as a new reusable profile. */
function SaveProfileCard({ role }: { role: PartnerRole }) {
  const t = useTranslations("partner");
  const tDash = useTranslations("dash.form");
  const tP = useTranslations("dash.profile");
  const { fieldData, linkedProfiles, setLinkedProfile } = useBid();
  const { notify } = useWorkspace();
  const queryClient = useQueryClient();
  const [profileName, setProfileName] = useState("");

  const f = (suffix: string) => roleFieldKey(role, suffix);
  const current = Object.fromEntries(
    PROFILE_FIELD_MAP.map(([col, suffix]) => [col, fieldData[f(suffix)] ?? ""])
  ) as Record<ProfileFieldKey, string>;

  const linkedId = linkedProfiles[role];

  const saveAsProfile = useMutation({
    mutationFn: () =>
      api.post<ProfileOut>("/profiles", {
        name: profileName || current.partner_name || t("untitledPartner"),
        role,
        ...current,
      }),
    onSuccess: (profile) => {
      setLinkedProfile(role, profile.id);
      setProfileName("");
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      queryClient.invalidateQueries({ queryKey: ["profile", profile.id] });
      notify("success", tDash("profileSaved"));
    },
    onError: (err) => notify("error", errorMessage(err, tDash("profileSaveFailed"))),
  });

  if (linkedId) return null;

  return (
    <FormCard title={tP("saveNew")} icon={BookmarkPlus}>
      <div className="sm:col-span-2">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            placeholder={current.partner_name || t("profileNamePlaceholder")}
            aria-label={t("profileName")}
            className={`${inputClass} sm:flex-1`}
          />
          <button
            type="button"
            disabled={saveAsProfile.isPending || !current.partner_name}
            onClick={() => saveAsProfile.mutate()}
            className={btn.secondary}
            title={!current.partner_name ? tDash("fillNameFirst") : undefined}
          >
            <BookmarkPlus size={15} />
            {t("saveAsProfile")}
          </button>
        </div>
      </div>
    </FormCard>
  );
}

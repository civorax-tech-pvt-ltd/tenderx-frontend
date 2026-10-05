"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Contact, Download, FileDown, FolderOpen, Loader2, PenLine, Plus, Save, Search, Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { Badge, PageHeader } from "@/components/ui/PageHeader";
import { btn, inputClass, labelClass } from "@/components/ui/styles";
import { PROFILE_FIELD_MAP, type ProfileFieldKey } from "@/lib/constants";
import { EmptyState, TableCard, tableClass, td, th, theadClass, trClass } from "@/components/ui/TableCard";
import { api } from "@/lib/api";
import { useOpenDraft, useStartNewBid } from "@/lib/bid-actions";
import { useBid } from "@/lib/bid-context";
import { errorMessage } from "@/lib/download";
import {
  downloadHistoryItem,
  useDateFormat,
  useDrafts,
  useGenerationHistory,
  useProfiles,
} from "@/lib/workspace-queries";
import { useWorkspace } from "@/lib/workspace-context";

function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative max-w-sm">
      <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${inputClass} pl-9`}
      />
    </div>
  );
}

const matches = (query: string, ...fields: (string | undefined)[]) =>
  !query || fields.some((f) => f?.toLowerCase().includes(query.trim().toLowerCase()));

export function BidsView() {
  const t = useTranslations("dash.library");
  const tNav = useTranslations("dash.nav");
  const { draftId, newBid } = useBid();
  const { notify } = useWorkspace();
  const queryClient = useQueryClient();
  const drafts = useDrafts();
  const openDraft = useOpenDraft();
  const startNewBid = useStartNewBid();
  const { relative, dateTime } = useDateFormat();
  const [query, setQuery] = useState("");
  const confirm = useConfirm();

  const remove = useMutation({
    mutationFn: (id: string) => api.del(`/drafts/${id}`),
    onSuccess: (_, id) => {
      if (id === draftId) newBid();
      queryClient.invalidateQueries({ queryKey: ["drafts"] });
      notify("success", t("bidDeleted"));
    },
    onError: (err) => notify("error", errorMessage(err, t("deleteFailed"))),
  });

  const rows = (drafts.data ?? []).filter((d) => matches(query, d.name));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={tNav("bids")}
        description={t("bidsDescription")}
        actions={
          <button onClick={startNewBid} className={btn.primary}>
            <Plus size={16} />
            {tNav("newBid")}
          </button>
        }
      />
      <TableCard toolbar={<SearchBox value={query} onChange={setQuery} placeholder={t("searchBids")} />}>
        {rows.length > 0 ? (
          <table className={tableClass}>
            <thead className={theadClass}>
              <tr>
                <th className={th}>{t("colName")}</th>
                <th className={th}>{t("colUpdated")}</th>
                <th className={`${th} text-right`}>{t("colActions")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => (
                <tr key={d.id} className={trClass}>
                  <td className={`${td} font-semibold text-slate-900`}>
                    <button onClick={() => openDraft.open(d.id)} className="text-left hover:text-blue-600">
                      {d.name}
                    </button>
                    {d.id === draftId && (
                      <span className="ml-2">
                        <Badge tone="blue">{t("openNow")}</Badge>
                      </span>
                    )}
                  </td>
                  <td className={`${td} text-slate-500`} title={dateTime(d.updated_at)}>
                    {relative(d.updated_at)}
                  </td>
                  <td className={`${td} text-right`}>
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => openDraft.open(d.id)}
                        disabled={openDraft.isPending}
                        className={`${btn.secondary} ${btn.sm}`}
                      >
                        <PenLine size={13} />
                        {t("edit")}
                      </button>
                      <button
                        onClick={async () => {
                          const ok = await confirm({ title: t("delete"), message: t("confirmDeleteBid", { name: d.name }), confirmLabel: t("delete"), variant: "danger" });
                          if (ok) remove.mutate(d.id);
                        }}
                        disabled={remove.isPending}
                        className={`${btn.danger} ${btn.sm}`}
                        aria-label={t("delete")}
                        title={t("delete")}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState
            icon={FolderOpen}
            title={drafts.isLoading ? t("loading") : query ? t("noMatches") : t("noBids")}
            body={drafts.isLoading || query ? undefined : t("noBidsBody")}
            action={
              !drafts.isLoading && !query ? (
                <button onClick={startNewBid} className={btn.primary}>
                  <Plus size={16} />
                  {tNav("newBid")}
                </button>
              ) : undefined
            }
          />
        )}
      </TableCard>
    </div>
  );
}

export function ProfilesView() {
  const t = useTranslations("dash.library");
  const tNav = useTranslations("dash.nav");
  const { notify } = useWorkspace();
  const { linkedProfiles, setLinkedProfile } = useBid();
  const queryClient = useQueryClient();
  const profiles = useProfiles();
  const { relative, dateTime } = useDateFormat();
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const confirm = useConfirm();

  const remove = useMutation({
    mutationFn: (id: string) => api.del(`/profiles/${id}`),
    onSuccess: (_, id) => {
      // Drop the link from any partner in the open bid that was using this profile.
      for (const [role, linked] of Object.entries(linkedProfiles)) if (linked === id) setLinkedProfile(role, null);
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      notify("success", t("profileDeleted"));
    },
    onError: (err) => notify("error", errorMessage(err, t("deleteFailed"))),
  });

  const rows = (profiles.data ?? []).filter((p) => matches(query, p.name, p.partner_name));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={tNav("profiles")} description={t("profilesDescription")} />
      <TableCard toolbar={<SearchBox value={query} onChange={setQuery} placeholder={t("searchProfiles")} />}>
        {rows.length > 0 ? (
          <table className={tableClass}>
            <thead className={theadClass}>
              <tr>
                <th className={th}>{t("colProfile")}</th>
                <th className={th}>{t("colOrganisation")}</th>
                <th className={th}>{t("colSavedFrom")}</th>
                <th className={th}>{t("colUpdated")}</th>
                <th className={`${th} text-right`}>{t("colActions")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className={trClass}>
                  <td className={`${td} font-semibold text-slate-900`}>{p.name}</td>
                  <td className={td}>{p.partner_name || "—"}</td>
                  <td className={td}>
                    <Badge tone="gray">{tNav(p.role === "first" || p.role === "second" ? p.role : "lead")}</Badge>
                  </td>
                  <td className={`${td} text-slate-500`} title={p.updated_at ? dateTime(p.updated_at) : undefined}>
                    {p.updated_at ? relative(p.updated_at) : "—"}
                  </td>
                  <td className={`${td} text-right`}>
                    <div className="inline-flex gap-2">
                      <button onClick={() => setEditingId(p.id)} className={`${btn.secondary} ${btn.sm}`}>
                        <PenLine size={13} />
                        {t("edit")}
                      </button>
                      <button
                        onClick={async () => {
                          const ok = await confirm({ title: t("delete"), message: t("confirmDeleteProfile", { name: p.name }), confirmLabel: t("delete"), variant: "danger" });
                          if (ok) remove.mutate(p.id);
                        }}
                        disabled={remove.isPending}
                        className={`${btn.danger} ${btn.sm}`}
                        aria-label={t("delete")}
                        title={t("delete")}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState
            icon={Contact}
            title={profiles.isLoading ? t("loading") : query ? t("noMatches") : t("noProfiles")}
            body={profiles.isLoading || query ? undefined : t("noProfilesBody")}
          />
        )}
      </TableCard>
      {editingId && <EditProfileDialog profileId={editingId} onClose={() => setEditingId(null)} />}
    </div>
  );
}

type ProfileDetail = { id: string; name: string } & Record<ProfileFieldKey, string>;

/** Modal form to edit a saved partner profile's details directly from the library. */
function EditProfileDialog({ profileId, onClose }: { profileId: string; onClose: () => void }) {
  const t = useTranslations("dash.profile");
  const tPartner = useTranslations("partner");
  const { notify } = useWorkspace();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<Record<string, string> | null>(null);

  const profile = useQuery({
    queryKey: ["profile", profileId],
    queryFn: () => api.get<ProfileDetail>(`/profiles/${profileId}`),
  });

  useEffect(() => {
    if (profile.data && !form) {
      setForm({ name: profile.data.name, ...Object.fromEntries(PROFILE_FIELD_MAP.map(([col]) => [col, profile.data[col] ?? ""])) });
    }
  }, [profile.data, form]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const save = useMutation({
    mutationFn: () => api.put<ProfileDetail>(`/profiles/${profileId}`, form),
    onSuccess: (updated) => {
      queryClient.setQueryData(["profile", profileId], updated);
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      notify("success", t("updated", { name: updated.name }));
      onClose();
    },
    onError: (err) => notify("error", errorMessage(err, t("updateFailed"))),
  });

  const fields: { key: string; label: string; span?: boolean }[] = [
    { key: "name", label: tPartner("profileName"), span: true },
    { key: "partner_name", label: tPartner("partnerName"), span: true },
    { key: "partner_short", label: tPartner("shortName") },
    { key: "address", label: tPartner("address") },
    { key: "partner_ceo", label: tPartner("ceo"), span: true },
    { key: "partner_md1", label: tPartner("md1") },
    { key: "partner_md2", label: tPartner("md2") },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-xl animate-fade-slide flex-col overflow-hidden rounded-t-md bg-white shadow-md-blue sm:rounded-md"
      >
        <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 id="edit-profile-title" className="text-base font-semibold text-slate-900">
              {t("editTitle")}
            </h2>
            <p className="mt-0.5 text-[13px] text-slate-500">{t("editDescription")}</p>
          </div>
          <button onClick={onClose} className="rounded-xs p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label={t("cancel")}>
            <X size={18} />
          </button>
        </header>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto p-5 sm:grid-cols-2">
            {!form ? (
              <p className="text-sm text-slate-500">{t("loading")}</p>
            ) : (
              fields.map(({ key, label, span }) => (
                <label key={key} className={span ? "sm:col-span-2" : undefined}>
                  <span className={labelClass}>{label}</span>
                  <input
                    value={form[key] ?? ""}
                    onChange={(e) => setForm((prev) => ({ ...prev!, [key]: e.target.value }))}
                    required={key === "name"}
                    className={inputClass}
                  />
                </label>
              ))
            )}
          </div>
          <footer className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-3.5">
            <button type="button" onClick={onClose} className={btn.secondary}>
              {t("cancel")}
            </button>
            <button type="submit" disabled={!form || save.isPending} className={btn.primary}>
              {save.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {t("saveChanges")}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

export function DocumentsView() {
  const t = useTranslations("dash.library");
  const tNav = useTranslations("dash.nav");
  const { notify } = useWorkspace();
  const history = useGenerationHistory();
  const { relative, dateTime } = useDateFormat();
  const [query, setQuery] = useState("");

  const rows = (history.data?.items ?? []).filter((d) => matches(query, d.jv_name, d.filename));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={tNav("documents")}
        description={t("documentsDescription")}
        meta={history.data ? <Badge tone="blue">{t("totalGenerated", { count: history.data.total })}</Badge> : undefined}
      />
      <TableCard toolbar={<SearchBox value={query} onChange={setQuery} placeholder={t("searchDocuments")} />}>
        {rows.length > 0 ? (
          <table className={tableClass}>
            <thead className={theadClass}>
              <tr>
                <th className={th}>{t("colBid")}</th>
                <th className={th}>{t("colFile")}</th>
                <th className={th}>{t("colPartners")}</th>
                <th className={th}>{t("colGenerated")}</th>
                <th className={`${th} text-right`}>{t("colActions")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item.id} className={trClass}>
                  <td className={`${td} font-semibold text-slate-900`}>{item.jv_name || "—"}</td>
                  <td className={`${td} max-w-[16rem] truncate text-slate-500`} title={item.filename}>
                    {item.filename}
                  </td>
                  <td className={td}>
                    <Badge tone="gray">{t("partnerCount", { count: item.partner_count })}</Badge>
                  </td>
                  <td className={`${td} text-slate-500`} title={dateTime(item.created_at)}>
                    {relative(item.created_at)}
                  </td>
                  <td className={`${td} text-right`}>
                    <button
                      onClick={() => downloadHistoryItem(item).catch(() => notify("error", t("downloadFailed")))}
                      className={`${btn.secondary} ${btn.sm}`}
                    >
                      <Download size={13} />
                      {t("download")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState
            icon={FileDown}
            title={history.isLoading ? t("loading") : query ? t("noMatches") : t("noDocuments")}
            body={history.isLoading || query ? undefined : t("noDocumentsBody")}
          />
        )}
      </TableCard>
      {history.data && history.data.total > history.data.items.length && (
        <p className="text-center text-xs text-slate-400">{t("showingRecent", { count: history.data.items.length })}</p>
      )}
    </div>
  );
}

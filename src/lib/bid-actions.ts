"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { api } from "@/lib/api";
import { saveDraft, useBid, type DraftOut } from "@/lib/bid-context";
import { downloadBlob, errorMessage } from "@/lib/download";
import { determinePartnerCount } from "@/lib/validation";
import { FIRST_STEP, useWorkspace } from "@/lib/workspace-context";

/** Saves the current bid (create on first save, update afterwards). */
export function useSaveBid() {
  const t = useTranslations("dash.toast");
  const tNav = useTranslations("nav");
  const { draftId, draftName, fieldData, linkedProfiles, markSaved } = useBid();
  const { notify } = useWorkspace();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const sent = { fieldData, linkedProfiles };
      const draft = await saveDraft(draftId, draftName || fieldData.JV_NAME || tNav("untitledBid"), sent);
      return { draft, sent };
    },
    onSuccess: ({ draft, sent }) => {
      // Without this, the first save left draftId null and every later save created a duplicate draft.
      markSaved(draft.id, draft.name, sent);
      queryClient.invalidateQueries({ queryKey: ["drafts"] });
      notify("success", t("saved"));
    },
    onError: (err) => notify("error", errorMessage(err, t("saveFailed"))),
  });
}

/** Saves if needed, generates the .docx and downloads it. */
export function useGenerateBid() {
  const t = useTranslations("topbar");
  const tToast = useTranslations("dash.toast");
  const tNav = useTranslations("nav");
  const { draftId, draftName, fieldData, linkedProfiles, isDirty, markSaved } = useBid();
  const { notify, setLastGeneratedDocId } = useWorkspace();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      let id = draftId;
      if (!id || isDirty) {
        const sent = { fieldData, linkedProfiles };
        const draft = await saveDraft(id, draftName || fieldData.JV_NAME || tNav("untitledBid"), sent);
        markSaved(draft.id, draft.name, sent);
        queryClient.invalidateQueries({ queryKey: ["drafts"] });
        id = draft.id;
      }
      const res = await api.post<{ id: string; download_url: string; filename: string }>("/generate", {
        draft_id: id,
        field_data: fieldData,
      });
      await downloadBlob(res.download_url, res.filename, t("downloadFailed"));
      return res.id;
    },
    onSuccess: (docId) => {
      setLastGeneratedDocId(docId);
      queryClient.invalidateQueries({ queryKey: ["generation-history"] });
      notify("success", tToast("generated"));
    },
    onError: (err) => notify("error", errorMessage(err, tToast("generateFailed"))),
  });
}

/** Splits the last generated document into section PDFs (zip). */
export function useGeneratePdfs() {
  const t = useTranslations("topbar");
  const tToast = useTranslations("dash.toast");
  const { fieldData } = useBid();
  const { notify, lastGeneratedDocId } = useWorkspace();

  return useMutation({
    mutationFn: async () => {
      if (!lastGeneratedDocId) throw new Error(t("generateDocFirst"));
      await downloadBlob(
        `/generate/${lastGeneratedDocId}/pdf?partner_count=${determinePartnerCount(fieldData)}`,
        `${lastGeneratedDocId}_sections.zip`,
        t("downloadFailed"),
        "POST"
      );
    },
    onSuccess: () => notify("success", tToast("pdfsReady")),
    onError: (err) => notify("error", errorMessage(err, t("generateDocFirst"))),
  });
}

/** Opens a saved draft into the builder, confirming first if there are unsaved changes. */
export function useOpenDraft() {
  const tToast = useTranslations("dash.toast");
  const tConfirm = useTranslations("dash.confirm");
  const { isDirty, loadDraft } = useBid();
  const { notify, setView, setLastGeneratedDocId } = useWorkspace();
  const confirm = useConfirm();

  const mutation = useMutation({
    mutationFn: (id: string) => api.get<DraftOut>(`/drafts/${id}`),
    onSuccess: (draft) => {
      loadDraft(draft);
      setLastGeneratedDocId(null);
      setView(FIRST_STEP);
      notify("info", tToast("opened", { name: draft.name }));
    },
    onError: (err) => notify("error", errorMessage(err, tToast("openFailed"))),
  });

  return {
    ...mutation,
    open: async (id: string) => {
      if (isDirty) {
        const ok = await confirm({ message: tConfirm("discardChanges"), confirmLabel: "Discard", variant: "warning" });
        if (!ok) return;
      }
      mutation.mutate(id);
    },
  };
}

/** Starts a blank bid, confirming first if there are unsaved changes. */
export function useStartNewBid() {
  const tConfirm = useTranslations("dash.confirm");
  const { isDirty, newBid } = useBid();
  const { setView, setLastGeneratedDocId } = useWorkspace();
  const confirm = useConfirm();

  return async () => {
    if (isDirty) {
      const ok = await confirm({ message: tConfirm("discardChanges"), confirmLabel: "Discard", variant: "warning" });
      if (!ok) return;
    }
    newBid();
    setLastGeneratedDocId(null);
    setView(FIRST_STEP);
  };
}

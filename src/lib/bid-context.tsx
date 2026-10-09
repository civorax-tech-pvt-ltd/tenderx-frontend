"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { PERCENTAGE_KEYS } from "@/lib/constants";
import { clampPercentage, suggestedJvName, type FieldData } from "@/lib/validation";

export type DraftOut = {
  id: string;
  name: string;
  field_data: FieldData;
  linked_profiles: Record<string, string>;
  employer_pdf_path: string;
  images: { img_key: string; storage_path: string }[];
};

type BidContextValue = {
  draftId: string | null;
  draftName: string;
  fieldData: FieldData;
  images: Record<string, string>; // img_key -> storage_path
  /** Saved partner profile each role was loaded from / saved to (role -> profile id). Persisted on the draft. */
  linkedProfiles: Record<string, string>;
  jvNameManuallySet: boolean;
  isDirty: boolean;
  setField: (key: string, value: string) => void;
  setFields: (patch: FieldData) => void;
  setImage: (imgKey: string, storagePath: string) => void;
  setLinkedProfile: (role: string, profileId: string | null) => void;
  loadDraft: (draft: DraftOut) => void;
  newBid: () => void;
  setDraftMeta: (id: string, name: string) => void;
  /** Record a successful save: sets the draft id/name and resets the dirty baseline. */
  markSaved: (id: string, name: string, saved: SavedSnapshot) => void;
};

export type SavedSnapshot = { fieldData: FieldData; linkedProfiles: Record<string, string> };

const snapshotJson = (s: SavedSnapshot) => JSON.stringify([s.fieldData, s.linkedProfiles]);

const BidContext = createContext<BidContextValue | null>(null);

const EMPTY_FIELD_DATA: FieldData = {
  BID_TYPE: "Single Bidder",
  BID_DATE: new Date().toISOString().slice(0, 10),
  BID_VALIDITY_PERIOD: "120 days",
};

export function BidProvider({ children }: { children: React.ReactNode }) {
  const [draftId, setDraftId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [fieldData, setFieldData] = useState<FieldData>(EMPTY_FIELD_DATA);
  const [images, setImages] = useState<Record<string, string>>({});
  const [linkedProfiles, setLinkedProfiles] = useState<Record<string, string>>({});
  const [jvNameManuallySet, setJvNameManuallySet] = useState(false);
  // Snapshot of the last saved/loaded state, used to detect unsaved changes.
  const [savedJson, setSavedJson] = useState(() => snapshotJson({ fieldData: EMPTY_FIELD_DATA, linkedProfiles: {} }));
  const isDirty = snapshotJson({ fieldData, linkedProfiles }) !== savedJson;

  const setField = useCallback(
    (key: string, value: string) => {
      setFieldData((prev) => {
        if (Object.values(PERCENTAGE_KEYS).includes(key)) value = clampPercentage(prev, key, value);
        // Short names are always stored in capitals (they form the JV name, e.g. "ABC - XYZ J/V").
        const next = { ...prev, [key]: key.endsWith("_PARTNER_SHORT") ? value.toUpperCase() : value };

        if (key === "JV_NAME") {
          setJvNameManuallySet(value.length > 0);
          return next;
        }

        // Auto-suggest JV name from partner short names unless the user overrode it.
        if (key.endsWith("_PARTNER_SHORT") && !jvNameManuallySet) {
          next.JV_NAME = suggestedJvName(next);
        }

        return next;
      });
    },
    [jvNameManuallySet]
  );

  const setFields = useCallback((patch: FieldData) => {
    setFieldData((prev) => {
      const next = { ...prev, ...patch };
      for (const k of Object.keys(next)) {
        if (k.endsWith("_PARTNER_SHORT") && typeof next[k] === "string") next[k] = next[k].toUpperCase();
      }
      // Auto-suggest JV name if any short name changed and user hasn't manually set it
      const shortChanged = ["LEAD_PARTNER_SHORT", "FIRST_PARTNER_SHORT", "SECOND_PARTNER_SHORT"].some(
        (k) => k in patch
      );
      if (shortChanged && !jvNameManuallySet) {
        next.JV_NAME = suggestedJvName(next);
      }
      return next;
    });
  }, [jvNameManuallySet]);

  const setImage = useCallback((imgKey: string, storagePath: string) => {
    setImages((prev) => ({ ...prev, [imgKey]: storagePath }));
  }, []);

  const setLinkedProfile = useCallback((role: string, profileId: string | null) => {
    setLinkedProfiles((prev) => {
      const next = { ...prev };
      if (profileId) next[role] = profileId;
      else delete next[role];
      return next;
    });
  }, []);

  const loadDraft = useCallback((draft: DraftOut) => {
    setDraftId(draft.id);
    setDraftName(draft.name);
    setFieldData(draft.field_data);
    setLinkedProfiles(draft.linked_profiles ?? {});
    setSavedJson(snapshotJson({ fieldData: draft.field_data, linkedProfiles: draft.linked_profiles ?? {} }));
    setJvNameManuallySet(Boolean(draft.field_data.JV_NAME));
    const imgMap: Record<string, string> = {};
    for (const img of draft.images) imgMap[img.img_key] = img.storage_path;
    setImages(imgMap);
  }, []);

  const newBid = useCallback(() => {
    setDraftId(null);
    setDraftName("");
    setFieldData(EMPTY_FIELD_DATA);
    setLinkedProfiles({});
    setSavedJson(snapshotJson({ fieldData: EMPTY_FIELD_DATA, linkedProfiles: {} }));
    setImages({});
    setJvNameManuallySet(false);
  }, []);

  const setDraftMeta = useCallback((id: string, name: string) => {
    setDraftId(id);
    setDraftName(name);
  }, []);

  const markSaved = useCallback((id: string, name: string, saved: SavedSnapshot) => {
    setDraftId(id);
    setDraftName(name);
    setSavedJson(snapshotJson(saved));
  }, []);

  const value = useMemo(
    () => ({
      draftId,
      draftName,
      fieldData,
      images,
      linkedProfiles,
      jvNameManuallySet,
      isDirty,
      setField,
      setFields,
      setImage,
      setLinkedProfile,
      loadDraft,
      newBid,
      setDraftMeta,
      markSaved,
    }),
    [
      draftId,
      draftName,
      fieldData,
      images,
      linkedProfiles,
      jvNameManuallySet,
      isDirty,
      setField,
      setFields,
      setImage,
      setLinkedProfile,
      loadDraft,
      newBid,
      setDraftMeta,
      markSaved,
    ]
  );

  return <BidContext.Provider value={value}>{children}</BidContext.Provider>;
}

export function useBid() {
  const ctx = useContext(BidContext);
  if (!ctx) throw new Error("useBid must be used within BidProvider");
  return ctx;
}

export async function saveDraft(draftId: string | null, name: string, saved: SavedSnapshot) {
  const body = { name, field_data: saved.fieldData, linked_profiles: saved.linkedProfiles };
  if (draftId) {
    return api.put<DraftOut>(`/drafts/${draftId}`, body);
  }
  return api.post<DraftOut>("/drafts", body);
}

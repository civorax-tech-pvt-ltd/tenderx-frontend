"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { suggestedJvName, type FieldData } from "@/lib/validation";

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
  jvNameManuallySet: boolean;
  setField: (key: string, value: string) => void;
  setFields: (patch: FieldData) => void;
  setImage: (imgKey: string, storagePath: string) => void;
  loadDraft: (draft: DraftOut) => void;
  newBid: () => void;
  setDraftMeta: (id: string, name: string) => void;
};

const BidContext = createContext<BidContextValue | null>(null);

const EMPTY_FIELD_DATA: FieldData = {
  BID_TYPE: "Joint Venture",
  BID_DATE: new Date().toISOString().slice(0, 10),
  BID_VALIDITY_PERIOD: "120 days",
};

export function BidProvider({ children }: { children: React.ReactNode }) {
  const [draftId, setDraftId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [fieldData, setFieldData] = useState<FieldData>(EMPTY_FIELD_DATA);
  const [images, setImages] = useState<Record<string, string>>({});
  const [jvNameManuallySet, setJvNameManuallySet] = useState(false);

  const setField = useCallback(
    (key: string, value: string) => {
      setFieldData((prev) => {
        const next = { ...prev, [key]: value };

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
    setFieldData((prev) => ({ ...prev, ...patch }));
  }, []);

  const setImage = useCallback((imgKey: string, storagePath: string) => {
    setImages((prev) => ({ ...prev, [imgKey]: storagePath }));
  }, []);

  const loadDraft = useCallback((draft: DraftOut) => {
    setDraftId(draft.id);
    setDraftName(draft.name);
    setFieldData(draft.field_data);
    setJvNameManuallySet(Boolean(draft.field_data.JV_NAME));
    const imgMap: Record<string, string> = {};
    for (const img of draft.images) imgMap[img.img_key] = img.storage_path;
    setImages(imgMap);
  }, []);

  const newBid = useCallback(() => {
    setDraftId(null);
    setDraftName("");
    setFieldData(EMPTY_FIELD_DATA);
    setImages({});
    setJvNameManuallySet(false);
  }, []);

  const setDraftMeta = useCallback((id: string, name: string) => {
    setDraftId(id);
    setDraftName(name);
  }, []);

  const value = useMemo(
    () => ({
      draftId,
      draftName,
      fieldData,
      images,
      jvNameManuallySet,
      setField,
      setFields,
      setImage,
      loadDraft,
      newBid,
      setDraftMeta,
    }),
    [draftId, draftName, fieldData, images, jvNameManuallySet, setField, setFields, setImage, loadDraft, newBid, setDraftMeta]
  );

  return <BidContext.Provider value={value}>{children}</BidContext.Provider>;
}

export function useBid() {
  const ctx = useContext(BidContext);
  if (!ctx) throw new Error("useBid must be used within BidProvider");
  return ctx;
}

export async function saveDraft(draftId: string | null, name: string, fieldData: FieldData) {
  if (draftId) {
    return api.put<DraftOut>(`/drafts/${draftId}`, { name, field_data: fieldData });
  }
  return api.post<DraftOut>("/drafts", { name, field_data: fieldData });
}

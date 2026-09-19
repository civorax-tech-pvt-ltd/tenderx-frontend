"use client";

import { Lock, Upload, Check } from "lucide-react";
import { useRef, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useBid, type DraftOut } from "@/lib/bid-context";

export function ImageUpload({ imgKey, label }: { imgKey: string; label: string }) {
  const { user } = useAuth();
  const { draftId, images, setImage } = useBid();
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasImage = Boolean(images[imgKey]);
  const canUpload = Boolean(user?.can_upload_signature_stamp);

  async function handleFile(file: File) {
    if (!draftId) {
      alert("Save this bid as a draft first, then upload signatures/stamps.");
      return;
    }
    setIsUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const draft = await api.put<DraftOut>(`/drafts/${draftId}/images/${imgKey}`, form);
      const updated = draft.images.find((i) => i.img_key === imgKey);
      if (updated) setImage(imgKey, updated.storage_path);
    } finally {
      setIsUploading(false);
    }
  }

  if (!canUpload) {
    return (
      <div
        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-ink-200 bg-ink-50 px-2.5 text-xs font-medium text-ink-400 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-500"
        title="Signature/stamp upload has not been enabled for your account. Contact your administrator."
      >
        <Lock size={12} />
        {label} upload locked
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className={`inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium transition-colors ${
          hasImage
            ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
            : "border-ink-200 bg-white text-ink-600 hover:bg-ink-50 dark:border-ink-700 dark:bg-ink-950 dark:text-ink-400"
        }`}
      >
        {hasImage ? <Check size={13} /> : <Upload size={13} />}
        {isUploading ? "Uploading…" : hasImage ? `${label} uploaded` : `Upload ${label}`}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

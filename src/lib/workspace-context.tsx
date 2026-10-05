"use client";

import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

// Partners come first: Project Info derives the JV name and signatory options from them.
export const BUILDER_STEPS = ["lead", "first", "second", "project"] as const;
export const FIRST_STEP = BUILDER_STEPS[0];
export type StepKey = (typeof BUILDER_STEPS)[number];
export type ViewKey = "dashboard" | StepKey | "bids" | "profiles" | "documents" | "account";

export function isStep(view: ViewKey): view is StepKey {
  return (BUILDER_STEPS as readonly string[]).includes(view);
}

type ToastKind = "success" | "error" | "info";
type Toast = { id: number; kind: ToastKind; message: string };

type WorkspaceContextValue = {
  view: ViewKey;
  setView: (view: ViewKey) => void;
  /** Doc id of the most recent "Generate Bid" in this session; enables "Generate PDFs". */
  lastGeneratedDocId: string | null;
  setLastGeneratedDocId: (id: string | null) => void;
  notify: (kind: ToastKind, message: string) => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [view, setViewState] = useState<ViewKey>("dashboard");
  const [lastGeneratedDocId, setLastGeneratedDocId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const setView = useCallback((next: ViewKey) => {
    setViewState(next);
    document.getElementById("workspace-main")?.scrollTo({ top: 0 });
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    (kind: ToastKind, message: string) => {
      const id = nextId.current++;
      setToasts((prev) => [...prev.slice(-3), { id, kind, message }]);
      setTimeout(() => dismiss(id), kind === "error" ? 7000 : 4000);
    },
    [dismiss]
  );

  const value = useMemo(
    () => ({ view, setView, lastGeneratedDocId, setLastGeneratedDocId, notify }),
    [view, setView, lastGeneratedDocId, notify]
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(100vw-2rem,380px)] flex-col gap-2"
      >
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
        ))}
      </div>
    </WorkspaceContext.Provider>
  );
}

const TOAST_STYLE: Record<ToastKind, { icon: typeof Info; className: string }> = {
  success: { icon: CheckCircle2, className: "text-emerald-600" },
  error: { icon: XCircle, className: "text-red-600" },
  info: { icon: Info, className: "text-blue-500" },
};

function ToastCard({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const { icon: Icon, className } = TOAST_STYLE[toast.kind];
  return (
    <div
      role={toast.kind === "error" ? "alert" : "status"}
      className="pointer-events-auto flex animate-fade-slide items-start gap-3 rounded-md border border-slate-200 bg-white p-3.5 shadow-md-blue dark:border-ink-800 dark:bg-ink-900"
    >
      <Icon size={18} className={`mt-0.5 shrink-0 ${className}`} />
      <p className="min-w-0 flex-1 whitespace-pre-line text-sm font-medium text-slate-800 dark:text-ink-200">{toast.message}</p>
      <button onClick={onDismiss} className="shrink-0 text-slate-400 hover:text-slate-600" aria-label="Dismiss">
        <X size={16} />
      </button>
    </div>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
}

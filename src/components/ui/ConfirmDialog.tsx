"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";
import { createContext, useCallback, useContext, useRef, useState } from "react";
import { btn } from "@/components/ui/styles";

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning";
}

interface ConfirmContextValue {
  confirm: (opts: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function ConfirmDialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<ConfirmOptions>({ message: "" });
  const resolveRef = useRef<(v: boolean) => void>(() => {});

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    setOpts(options);
    setOpen(true);
    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const handleConfirm = () => {
    setOpen(false);
    resolveRef.current(true);
  };

  const handleCancel = () => {
    setOpen(false);
    resolveRef.current(false);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={handleCancel}
          />
          {/* Dialog */}
          <div className="relative w-full max-w-sm rounded-md border border-slate-200 bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-start gap-3 p-5">
              <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-sm ${
                opts.variant === "danger"
                  ? "bg-red-50 text-red-500"
                  : "bg-amber-50 text-amber-500"
              }`}>
                {opts.variant === "danger" ? <Trash2 size={18} /> : <AlertTriangle size={18} />}
              </span>
              <div className="min-w-0 flex-1">
                {opts.title && (
                  <h3 className="text-[15px] font-semibold text-slate-900">{opts.title}</h3>
                )}
                <p className="mt-0.5 text-sm text-slate-600">{opts.message}</p>
              </div>
              <button
                onClick={handleCancel}
                className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-sm text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={15} />
              </button>
            </div>
            {/* Footer */}
            <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-3">
              <button onClick={handleCancel} className={`${btn.secondary} ${btn.sm}`}>
                {opts.cancelLabel ?? "Cancel"}
              </button>
              <button
                onClick={handleConfirm}
                className={opts.variant === "danger"
                  ? `${btn.sm} inline-flex h-8 shrink-0 items-center justify-center gap-2 rounded-sm px-3 text-[13px] font-semibold transition bg-red-500 text-white hover:bg-red-600`
                  : `${btn.primary} ${btn.sm}`
                }
              >
                {opts.confirmLabel ?? "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used inside ConfirmDialogProvider");
  return ctx.confirm;
}

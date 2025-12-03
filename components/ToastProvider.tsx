"use client";

import { createContext, useContext, useMemo, useState } from "react";

type ToastVariant = "success" | "error";

type Toast = {
  id: number;
  message: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  notify: (message: string, variant?: ToastVariant) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = (message: string, variant: ToastVariant = "success") => {
    setToasts((prev) => {
      const next = [...prev, { id: Date.now(), message, variant }];
      return next.slice(-4); // keep latest few
    });
    setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 3200);
  };

  const value = useMemo(() => ({ notify }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[1200] flex flex-col items-center gap-2 px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`w-full max-w-md rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg shadow-slate-900/10 backdrop-blur ${
              toast.variant === "success"
                ? "border-emerald-100 bg-white/90 text-emerald-800"
                : "border-rose-100 bg-white/90 text-rose-700"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}

import { useEffect, useRef } from "react";

function AlertDialog({ open, onClose, onConfirm, title, description, confirmText = "Ya, Hapus", cancelText = "Batal", variant = "danger" }) {
  const confirmRef = useRef(null);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => confirmRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const confirmStyles = {
    danger: "bg-red-600 text-white hover:bg-red-700",
    default: "bg-zinc-900 text-white hover:bg-zinc-800",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md animate-in fade-in-0 zoom-in-95 duration-200 rounded-xl border border-zinc-200 bg-white p-6 shadow-xl">
        <div className="flex flex-col gap-2 text-left mb-5">
          <h3 className="text-lg font-semibold leading-none tracking-tight text-zinc-950">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-zinc-500">{description}</p>
          )}
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-zinc-200 bg-white px-4 py-2 text-zinc-900 hover:bg-zinc-100 active:scale-[0.98]"
          >
            {cancelText}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors px-4 py-2 active:scale-[0.98] ${confirmStyles[variant] || confirmStyles.default}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertDialog;

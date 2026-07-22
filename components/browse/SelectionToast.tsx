import type { SelectionToast as SelectionToastData } from "./types";

type SelectionToastProps = {
  toast: SelectionToastData | null;
  onUndo: () => void;
  onClose: () => void;
};

export default function SelectionToast({
  toast,
  onUndo,
  onClose,
}: SelectionToastProps) {
  if (!toast) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-[#b9dfd0] bg-white p-4 shadow-[0_18px_50px_rgba(73,53,31,0.2)]"
    >
      <div className="flex items-start gap-3">
        <div
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf8f3]"
        >
          ✓
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm leading-6 text-[#211b16]">
            <strong>{toast.company}</strong>{" "}
            lisättiin tarjouspyyntöösi.
          </p>

          <button
            type="button"
            onClick={onUndo}
            className="mt-1 text-sm font-bold text-[#168365] transition hover:text-[#0f684f]"
          >
            Kumoa valinta
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Sulje ilmoitus"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#70675e] transition hover:bg-[#f4eee5] hover:text-[#211b16]"
        >
          ×
        </button>
      </div>
    </div>
  );
}
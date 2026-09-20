import { Loader2, Trash2 } from "lucide-react";
import Modal from "./Modal";

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  submitting,
  title = "Delete record?",
  message,
  confirmLabel = "Delete",
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} icon={Trash2} maxWidth="max-w-sm">
      <div className="space-y-5">
        <p className="text-sm text-gray-400">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 text-sm font-semibold text-gray-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-2.5 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={submitting}
            className="flex-1 flex items-center justify-center gap-2 text-sm font-bold text-white bg-gradient-to-br from-rose-500 to-rose-700 hover:shadow-[0_10px_30px_-10px_rgba(244,63,94,0.7)] rounded-xl py-2.5 transition-shadow disabled:opacity-60"
          >
            {submitting && <Loader2 size={15} className="animate-spin" />}
            {submitting ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, subtitle, icon: Icon, children, maxWidth = "max-w-lg" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            className={`relative w-full ${maxWidth} glass-panel rounded-3xl shadow-2xl overflow-hidden`}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                {Icon && (
                  <div className="grid place-items-center w-10 h-10 rounded-2xl gold-btn shrink-0">
                    <Icon size={20} strokeWidth={2.4} />
                  </div>
                )}
                <div>
                  <h3 className="font-display font-bold text-lg text-white leading-tight">{title}</h3>
                  {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
                </div>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 grid place-items-center w-9 h-9 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-5 max-h-[75vh] overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

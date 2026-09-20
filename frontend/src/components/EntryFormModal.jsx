import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Banknote, IndianRupee, Loader2, Pencil, PlusCircle, Smartphone } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "./Modal";
import { collectionsApi, expensesApi } from "../api/client";

const CONFIG = {
  collection: {
    createTitle: "New Collection",
    editTitle: "Edit Collection",
    subtitle: "Record a fund received for the festival",
    nameLabel: "Name",
    namePlaceholder: "e.g. Baskar",
    createLabel: "Save Collection",
    updateLabel: "Update Collection",
  },
  expense: {
    createTitle: "New Expense",
    editTitle: "Edit Expense",
    subtitle: "Record a payment made for the festival",
    nameLabel: "Expense For",
    namePlaceholder: "e.g. Decoration, Prasadam, Sound System",
    createLabel: "Save Expense",
    updateLabel: "Update Expense",
  },
};

const emptyForm = { name: "", amount: "", paymentType: "gpay", description: "" };

export default function EntryFormModal({ open, onClose, type, editingEntry, onSaved }) {
  const cfg = CONFIG[type] || CONFIG.collection;
  const isEditing = Boolean(editingEntry);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    if (editingEntry) {
      setForm({
        name: editingEntry.name || "",
        amount: String(editingEntry.amount ?? ""),
        paymentType: editingEntry.paymentType || "gpay",
        description: editingEntry.description || "",
      });
    } else {
      setForm(emptyForm);
    }
    setError("");
  }, [open, editingEntry]);

  const handleClose = () => {
    setError("");
    onClose();
  };

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const amountNum = Number(form.amount);
    if (!form.name.trim()) {
      setError(`${cfg.nameLabel} is required`);
      return;
    }
    if (!form.amount || Number.isNaN(amountNum) || amountNum <= 0) {
      setError("Enter a valid amount greater than 0");
      return;
    }

    setSubmitting(true);
    try {
      const payload =
        type === "collection"
          ? {
              name: form.name.trim(),
              amount: amountNum,
              paymentType: form.paymentType,
              description: form.description.trim(),
            }
          : {
              expenseFor: form.name.trim(),
              amount: amountNum,
              paymentType: form.paymentType,
              description: form.description.trim(),
            };

      const api = type === "collection" ? collectionsApi : expensesApi;
      if (isEditing) {
        await api.update(editingEntry.id, payload);
      } else {
        await api.create(payload);
      }

      const entityLabel = type === "collection" ? "Collection" : "Expense";
      toast.success(isEditing ? `${entityLabel} updated!` : `${entityLabel} saved!`);
      onSaved?.();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEditing ? cfg.editTitle : cfg.createTitle}
      subtitle={cfg.subtitle}
      icon={isEditing ? Pencil : PlusCircle}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            {cfg.nameLabel}
          </label>
          <input
            autoFocus
            value={form.name}
            onChange={update("name")}
            placeholder={cfg.namePlaceholder}
            className="mt-1.5 w-full bg-white/5 border border-white/10 focus:border-amber-400/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-600 outline-none transition-colors"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Amount</label>
          <div className="mt-1.5 relative">
            <IndianRupee size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="number"
              min="1"
              step="1"
              value={form.amount}
              onChange={update("amount")}
              placeholder="0"
              className="w-full bg-white/5 border border-white/10 focus:border-amber-400/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-600 outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Payment Type</label>
          <div className="mt-1.5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, paymentType: "gpay" }))}
              className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold border transition-colors ${
                form.paymentType === "gpay"
                  ? "bg-sky-500/15 border-sky-400/50 text-sky-300"
                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
              }`}
            >
              <Smartphone size={16} /> GPay
            </button>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, paymentType: "cash" }))}
              className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold border transition-colors ${
                form.paymentType === "cash"
                  ? "bg-emerald-500/15 border-emerald-400/50 text-emerald-300"
                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
              }`}
            >
              <Banknote size={16} /> Cash
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Description <span className="normal-case text-gray-600">(optional)</span>
          </label>
          <textarea
            value={form.description}
            onChange={update("description")}
            placeholder="Add a short note..."
            rows={3}
            className="mt-1.5 w-full bg-white/5 border border-white/10 focus:border-amber-400/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-600 outline-none transition-colors resize-none"
          />
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2"
          >
            {error}
          </motion.p>
        )}

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 gold-btn font-bold text-sm rounded-xl py-3 disabled:opacity-60"
        >
          {submitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : isEditing ? (
            <Pencil size={16} />
          ) : (
            <PlusCircle size={16} />
          )}
          {submitting ? "Saving..." : isEditing ? cfg.updateLabel : cfg.createLabel}
        </motion.button>
      </form>
    </Modal>
  );
}

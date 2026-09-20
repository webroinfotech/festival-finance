import { useEffect, useState } from "react";
import { History, Loader2, Pencil, PlusCircle, Trash2, UserCircle2 } from "lucide-react";
import Modal from "./Modal";
import { auditApi } from "../api/client";
import { formatCurrency, formatDateTime } from "../utils/format";

const ACTION_META = {
  create: { label: "Created", icon: PlusCircle, color: "text-emerald-300 bg-emerald-500/15 border-emerald-500/20" },
  update: { label: "Updated", icon: Pencil, color: "text-amber-300 bg-amber-500/15 border-amber-500/20" },
  delete: { label: "Deleted", icon: Trash2, color: "text-rose-300 bg-rose-500/15 border-rose-500/20" },
};

function diffFields(before, after) {
  if (!before || !after) return [];
  const fields = ["name", "amount", "paymentType", "description"];
  const changes = [];
  fields.forEach((field) => {
    const a = before[field] ?? "";
    const b = after[field] ?? "";
    if (String(a) !== String(b)) {
      changes.push({ field, from: before[field], to: after[field] });
    }
  });
  return changes;
}

function fieldLabel(field) {
  return { name: "Name", amount: "Amount", paymentType: "Payment", description: "Description" }[field] || field;
}

function fieldValue(field, value) {
  if (field === "amount") return formatCurrency(value);
  if (field === "paymentType") return value === "gpay" ? "GPay" : "Cash";
  return value || "—";
}

export default function AuditModal({ open, onClose }) {
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    setError("");
    auditApi
      .list()
      .then((data) => {
        if (!cancelled) setLog(data);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load the audit report.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Audit Report"
      subtitle="Every create, edit and delete across collections & expenses"
      icon={History}
      maxWidth="max-w-2xl"
    >
      <div className="max-h-[65vh] overflow-y-auto -mx-1 px-1">
        {loading && (
          <div className="flex flex-col items-center gap-2 text-gray-400 py-16">
            <Loader2 size={26} className="animate-spin text-amber-400" />
            <p className="text-sm">Loading audit trail...</p>
          </div>
        )}

        {!loading && error && <p className="text-sm text-rose-400 text-center py-10">{error}</p>}

        {!loading && !error && log.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-10">No changes recorded yet.</p>
        )}

        {!loading && !error && log.length > 0 && (
          <ul className="space-y-2.5">
            {log.map((entry) => {
              const meta = ACTION_META[entry.action] || ACTION_META.create;
              const Icon = meta.icon;
              const snapshot = entry.after || entry.before;
              const changes = entry.action === "update" ? diffFields(entry.before, entry.after) : [];

              return (
                <li key={entry.id} className="bg-white/5 border border-white/5 rounded-xl px-4 py-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`shrink-0 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide border px-2 py-1 rounded-full ${meta.color}`}
                      >
                        <Icon size={12} /> {meta.label}
                      </span>
                      <span className="text-xs text-gray-500 capitalize shrink-0">{entry.entityType}</span>
                    </div>
                    <span className="text-[11px] text-gray-500 shrink-0">{formatDateTime(entry.timestamp)}</span>
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p
                      className={`text-sm font-semibold truncate ${
                        entry.action === "delete" ? "text-gray-400 line-through" : "text-white"
                      }`}
                    >
                      {snapshot?.name || "—"}
                    </p>
                    {entry.action !== "update" && (
                      <p className="text-sm font-bold text-amber-300 shrink-0">
                        {formatCurrency(snapshot?.amount)}
                      </p>
                    )}
                  </div>

                  {changes.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {changes.map((c) => (
                        <span
                          key={c.field}
                          className="text-[11px] text-gray-300 bg-black/30 border border-white/10 rounded-lg px-2 py-1"
                        >
                          {fieldLabel(c.field)}:{" "}
                          <span className="text-gray-500">{fieldValue(c.field, c.from)}</span>
                          {" → "}
                          <span className="text-amber-300 font-semibold">{fieldValue(c.field, c.to)}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-gray-500">
                    <UserCircle2 size={12} /> {entry.performedBy}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Modal>
  );
}

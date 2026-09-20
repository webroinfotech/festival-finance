import { ArrowDownLeft, ArrowUpRight, Banknote, History, Pencil, Smartphone, Trash2 } from "lucide-react";
import { formatCurrency, formatDateTime } from "../utils/format";

export default function RecentEntries({ entries, loading, onEdit, onDelete, onOpenAudit }) {
  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display font-bold text-white text-base">Manage Records</h3>
          <p className="text-xs text-gray-500 mt-0.5">Edit or delete any collection or expense</p>
        </div>
        <button
          onClick={onOpenAudit}
          className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-amber-300 bg-amber-400/10 hover:bg-amber-400/15 border border-amber-400/20 px-3 py-1.5 rounded-full transition-colors"
        >
          <History size={13} /> Audit Report
        </button>
      </div>

      {loading && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && entries.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-6">No entries recorded yet.</p>
      )}

      {!loading && entries.length > 0 && (
        <ul className="space-y-2 max-h-[420px] overflow-y-auto -mx-1 px-1">
          {entries.map((item) => {
            const isCollection = item.type === "collection";
            return (
              <li
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3 bg-white/5 border border-white/5 rounded-xl px-3.5 py-3"
              >
                <div className="flex items-center gap-3 min-w-0 sm:flex-1">
                  <div
                    className={`grid place-items-center w-9 h-9 rounded-xl shrink-0 ${
                      isCollection
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-rose-500/15 text-rose-300"
                    }`}
                  >
                    {isCollection ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1">
                      {item.paymentType === "gpay" ? (
                        <Smartphone size={11} />
                      ) : (
                        <Banknote size={11} />
                      )}
                      {item.paymentType === "gpay" ? "GPay" : "Cash"} · {formatDateTime(item.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pl-12 sm:pl-0 shrink-0">
                  <p
                    className={`text-sm font-bold ${
                      isCollection ? "text-emerald-300" : "text-rose-300"
                    }`}
                  >
                    {isCollection ? "+" : "-"}
                    {formatCurrency(item.amount)}
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEdit?.(item)}
                      aria-label="Edit record"
                      className="grid place-items-center w-8 h-8 rounded-lg text-gray-400 hover:text-amber-300 hover:bg-amber-400/10 transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => onDelete?.(item)}
                      aria-label="Delete record"
                      className="grid place-items-center w-8 h-8 rounded-lg text-gray-400 hover:text-rose-300 hover:bg-rose-400/10 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

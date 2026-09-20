import { motion } from "framer-motion";
import { Banknote, Smartphone, Wallet } from "lucide-react";
import Modal from "./Modal";
import { formatCurrency } from "../utils/format";

export default function BalanceModal({ open, onClose, summary, loading }) {
  const rows = [
    {
      key: "gpay",
      label: "GPay Balance",
      value: summary?.gpayBalance ?? 0,
      icon: Smartphone,
      color: "from-sky-300 to-sky-600 text-sky-950",
      textColor: "text-sky-300",
    },
    {
      key: "cash",
      label: "Cash Balance",
      value: summary?.cashBalance ?? 0,
      icon: Banknote,
      color: "from-emerald-300 to-emerald-600 text-emerald-950",
      textColor: "text-emerald-300",
    },
  ];

  return (
    <Modal open={open} onClose={onClose} title="Current Balance" subtitle="Live totals across all entries" icon={Wallet}>
      <div className="space-y-4">
        <div className="glass-panel rounded-2xl p-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Total Balance</p>
          {loading ? (
            <div className="mt-2 h-9 w-40 mx-auto rounded-lg bg-white/10 animate-pulse" />
          ) : (
            <motion.p
              key={summary?.balance}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 font-display font-extrabold text-3xl gradient-text"
            >
              {formatCurrency(summary?.balance)}
            </motion.p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {rows.map((row) => (
            <div key={row.key} className="glass-panel rounded-2xl p-4 flex items-center gap-3">
              <div className={`grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br shrink-0 ${row.color}`}>
                <row.icon size={18} strokeWidth={2.3} />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{row.label}</p>
                {loading ? (
                  <div className="mt-1 h-5 w-20 rounded bg-white/10 animate-pulse" />
                ) : (
                  <p className={`font-display font-bold text-lg ${row.textColor}`}>
                    {formatCurrency(row.value)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-gray-500 text-center">
          Balance = Total Collections − Total Expenses, split by payment mode.
        </p>
      </div>
    </Modal>
  );
}

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const ACCENTS = {
  gold: {
    icon: "gold-btn",
    glow: "hover:shadow-[0_20px_50px_-20px_rgba(245,158,11,0.55)]",
    value: "text-amber-300",
  },
  emerald: {
    icon: "bg-gradient-to-br from-emerald-300 to-emerald-600 text-emerald-950",
    glow: "hover:shadow-[0_20px_50px_-20px_rgba(16,185,129,0.55)]",
    value: "text-emerald-300",
  },
  rose: {
    icon: "bg-gradient-to-br from-rose-300 to-rose-600 text-rose-950",
    glow: "hover:shadow-[0_20px_50px_-20px_rgba(244,63,94,0.55)]",
    value: "text-rose-300",
  },
  sky: {
    icon: "bg-gradient-to-br from-sky-300 to-sky-600 text-sky-950",
    glow: "hover:shadow-[0_20px_50px_-20px_rgba(56,189,248,0.55)]",
    value: "text-sky-300",
  },
};

export default function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  accent = "gold",
  onClick,
  loading,
}) {
  const theme = ACCENTS[accent] || ACCENTS.gold;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative text-left glass-panel rounded-3xl p-5 sm:p-6 transition-shadow duration-300 ${theme.glow}`}
    >
      <div className="flex items-start justify-between">
        <div className={`grid place-items-center w-11 h-11 rounded-2xl ${theme.icon} shrink-0`}>
          <Icon size={20} strokeWidth={2.3} />
        </div>
        <ArrowUpRight
          size={18}
          className="text-gray-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
        />
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>

      {loading ? (
        <div className="mt-2 h-8 w-28 rounded-lg bg-white/10 animate-pulse" />
      ) : (
        <p className={`mt-1 font-display font-extrabold text-2xl sm:text-3xl ${theme.value}`}>
          {value}
        </p>
      )}

      {subtitle && <p className="mt-1.5 text-xs text-gray-500">{subtitle}</p>}
    </motion.button>
  );
}

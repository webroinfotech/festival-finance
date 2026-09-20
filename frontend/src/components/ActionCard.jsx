import { motion } from "framer-motion";

export default function ActionCard({ icon: Icon, label, subtitle, onClick, tone = "primary" }) {
  const isPrimary = tone === "primary";

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative text-left rounded-3xl p-5 sm:p-6 transition-shadow duration-300 ${
        isPrimary
          ? "gold-btn hover:shadow-[0_20px_50px_-16px_rgba(245,158,11,0.7)]"
          : "glass-panel hover:shadow-[0_20px_50px_-20px_rgba(244,63,94,0.5)]"
      }`}
    >
      <div
        className={`grid place-items-center w-11 h-11 rounded-2xl shrink-0 ${
          isPrimary ? "bg-black/10" : "bg-gradient-to-br from-rose-300 to-rose-600 text-rose-950"
        }`}
      >
        <Icon size={20} strokeWidth={2.3} className={isPrimary ? "text-[#1a0f02]" : ""} />
      </div>
      <p
        className={`mt-4 font-display font-bold text-base sm:text-lg ${
          isPrimary ? "text-[#1a0f02]" : "text-white"
        }`}
      >
        {label}
      </p>
      {subtitle && (
        <p className={`mt-1 text-xs ${isPrimary ? "text-[#1a0f02]/70" : "text-gray-500"}`}>
          {subtitle}
        </p>
      )}
    </motion.button>
  );
}

import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Hero() {
  const { isAuthenticated, username } = useAuth();

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-6 text-center">
      <motion.p
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold tracking-wide uppercase text-amber-300/90 bg-amber-400/10 border border-amber-400/20 px-4 py-1.5 rounded-full mb-5"
      >
        {isAuthenticated ? `Welcome back, ${username}` : "Transparent · Real-time · Trusted"}
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="font-display font-extrabold text-3xl sm:text-5xl leading-tight text-white"
      >
        Festival <span className="gradient-text">Amount Maintenance</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-4 text-sm sm:text-base text-gray-400 max-w-xl mx-auto"
      >
        Every rupee collected and spent for the festival, tracked live —
        view reports anytime, download or share as PDF.
      </motion.p>
    </section>
  );
}

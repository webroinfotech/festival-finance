import { motion } from "framer-motion";
import { LogIn, LogOut, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Header({ onLoginClick }) {
  const { isAuthenticated, username, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40">
      <div className="glass-panel border-x-0 border-t-0">
        <div
          className="h-7 sm:h-9 md:h-11 w-full bg-black/40 border-b border-amber-400/15"
          style={{
            backgroundImage: "url(/bg.jpg)",
            backgroundRepeat: "repeat-x",
            backgroundSize: "auto 100%",
            backgroundPosition: "center",
          }}
          role="presentation"
          aria-hidden="true"
        />
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="grid place-items-center w-9 h-9 rounded-xl gold-btn shrink-0">
              <Sparkles size={18} strokeWidth={2.4} />
            </div>
            <div className="leading-tight">
              <p className="font-display font-bold text-sm sm:text-base text-white tracking-tight">
                Festival Amount Maintenance
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400 hidden sm:block">
                Community fund, tracked transparently
              </p>
            </div>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-amber-300 bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-full">
                <ShieldCheck size={14} /> {username}
              </span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => logout()}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-2 rounded-full transition-colors"
              >
                <LogOut size={15} />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
              onClick={onLoginClick}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-bold gold-btn px-4 py-2 rounded-full transition-shadow"
            >
              <LogIn size={15} />
              Admin Login
            </motion.button>
          )}
        </div>
      </div>
    </header>
  );
}

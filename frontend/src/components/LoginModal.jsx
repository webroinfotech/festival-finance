import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, KeyRound, Loader2, ShieldCheck, User } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "./Modal";
import { useAuth } from "../context/AuthContext";

export default function LoginModal({ open, onClose }) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setUsername("");
    setPassword("");
    setError("");
    setShowPassword(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(username.trim(), password);
      toast.success("Welcome back, Admin!");
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Admin Login" subtitle="Manage collections & expenses" icon={ShieldCheck}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Username</label>
          <div className="mt-1.5 relative">
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Admin"
              className="w-full bg-white/5 border border-white/10 focus:border-amber-400/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-600 outline-none transition-colors"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Password</label>
          <div className="mt-1.5 relative">
            <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 focus:border-amber-400/60 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-gray-600 outline-none transition-colors"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
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
          {submitting ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
          {submitting ? "Verifying..." : "Login"}
        </motion.button>
      </form>
    </Modal>
  );
}

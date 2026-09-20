import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Dashboard from "./components/Dashboard";
import LoginModal from "./components/LoginModal";

function AppShell() {
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => toast.error(e.detail);
    window.addEventListener("ffm:auth-message", handler);
    return () => window.removeEventListener("ffm:auth-message", handler);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="app-bg" />
      <Header onLoginClick={() => setLoginOpen(true)} />
      <Hero />
      <Dashboard />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#17181f",
            color: "#f3f4f6",
            border: "1px solid rgba(255,255,255,0.08)",
            fontSize: "13px",
          },
          success: { iconTheme: { primary: "#f59e0b", secondary: "#1a0f02" } },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

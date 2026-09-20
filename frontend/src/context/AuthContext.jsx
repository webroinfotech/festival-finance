import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { authApi, setSessionExpiredHandler } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("ffm_token"));
  const [username, setUsername] = useState(() => localStorage.getItem("ffm_username"));

  const logout = useCallback((message) => {
    localStorage.removeItem("ffm_token");
    localStorage.removeItem("ffm_username");
    setToken(null);
    setUsername(null);
    if (message) {
      window.dispatchEvent(new CustomEvent("ffm:auth-message", { detail: message }));
    }
  }, []);

  useEffect(() => {
    setSessionExpiredHandler(() => logout("Your session expired. Please login again."));
  }, [logout]);

  const login = useCallback(async (usernameInput, password) => {
    const data = await authApi.login(usernameInput, password);
    localStorage.setItem("ffm_token", data.token);
    localStorage.setItem("ffm_username", data.username);
    setToken(data.token);
    setUsername(data.username);
    return data;
  }, []);

  const value = {
    token,
    username,
    isAuthenticated: Boolean(token),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

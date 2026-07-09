import { createContext, useContext, useState, useCallback } from "react";
import API from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const raw = localStorage.getItem("astr_admin_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post("/api/auth/login", { email, password });
      localStorage.setItem("astr_admin_token", data.token);
      localStorage.setItem("astr_admin_user", JSON.stringify(data.admin));
      setAdmin(data.admin);
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.response?.data?.message || "Login failed" };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await API.post("/api/auth/logout");
    } catch {
      /* ignore */
    }
    localStorage.removeItem("astr_admin_token");
    localStorage.removeItem("astr_admin_user");
    setAdmin(null);
  }, []);

  return <AuthContext.Provider value={{ admin, login, logout, loading }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

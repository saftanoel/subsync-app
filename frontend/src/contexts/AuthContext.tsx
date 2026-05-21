import React, { createContext, useContext, useState, useCallback } from "react";
import { API_BASE } from "@/config/api";

// ── Types ─────────────────────────────────────────────────────────────────────
// Updated to match the shape returned by POST /login on the backend
interface User {
  id:       string;
  username: string;
  role:     string;   // 'admin' | 'user'
}

interface AuthContextType {
  user:            User | null;
  isAuthenticated: boolean;
  login:           (username: string, password: string) => Promise<boolean>;
  logout:          () => void;
  // kept so RegisterPage / other callers that still use it don't break
  register:        (name: string, email: string, password: string) => boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "subsync_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Rehydrate from localStorage so the session survives a page reload
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // ── Login: hits the real backend endpoint ───────────────────────────────────
  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ username, password }),
      });

      if (!res.ok) return false;               // 401 or any other error

      const data: User = await res.json();     // { id, username, role }
      setUser(data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch {
      return false;                            // backend is unreachable
    }
  }, []);

  // ── Logout ──────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // ── Register (stub — kept for UI compatibility, not wired to backend yet) ───
  const register = useCallback((_name: string, _email: string, _password: string): boolean => {
    // Silver challenge focuses only on persistency / login; registration can
    // be wired in a future sprint.
    return false;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

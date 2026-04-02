import React, { createContext, useContext, useState, useCallback } from "react";
import Cookies from "js-cookie";

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// In-memory user store
const userStore: { email: string; name: string; password: string }[] = [
  { email: "demo@subsync.com", name: "Demo User", password: "password123" },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = Cookies.get("subsync_user");
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  });

  const login = useCallback((email: string, password: string) => {
    const found = userStore.find(u => u.email === email && u.password === password);
    if (found) {
      const u = { email: found.email, name: found.name };
      setUser(u);
      Cookies.set("subsync_user", JSON.stringify(u), { expires: 7 });
      return true;
    }
    return false;
  }, []);

  const register = useCallback((name: string, email: string, password: string) => {
    if (userStore.find(u => u.email === email)) return false;
    userStore.push({ email, name, password });
    const u = { email, name };
    setUser(u);
    Cookies.set("subsync_user", JSON.stringify(u), { expires: 7 });
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    Cookies.remove("subsync_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

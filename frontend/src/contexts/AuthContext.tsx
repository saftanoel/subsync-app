import React, { useState, useCallback, useEffect } from "react";
import { AuthContext, User } from "@/contexts/authContextDef";
import { API_BASE } from "@/config/api";
import { parseJwt } from "@/lib/api";

const STORAGE_KEY_USER = "subsync_user";
const STORAGE_KEY_TOKEN = "subsync_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY_TOKEN);
  });

  // ── Logout ──────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  }, []);

  // Global unauthorized listener
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener("unauthorized", handleUnauthorized);
    return () => window.removeEventListener("unauthorized", handleUnauthorized);
  }, [logout]);

  // ── Auto-logout Inactivity Timer ─────────────────────────────────────────────
  useEffect(() => {
    if (!token) return; // Only track inactivity if the user is logged in

    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      // 15 minutes = 15 * 60 * 1000 = 900,000 ms
      timeoutId = setTimeout(() => {
        logout();
      }, 15 * 60 * 1000);
    };

    // Throttle the event listener execution to max once per second
    let lastActivity = Date.now();
    const handleActivity = () => {
      const now = Date.now();
      if (now - lastActivity > 1000) {
        lastActivity = now;
        resetTimer();
      }
    };

    // Initialize timer
    resetTimer();

    // Attach listeners
    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((event) => window.addEventListener(event, handleActivity));

    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => window.removeEventListener(event, handleActivity));
    };
  }, [token, logout]);

  // ── Login ───────────────────────────────────────────────────────────────────
  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const res = await fetch(`${API_BASE}/auth/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body:    formData,
      });

      if (!res.ok) return false;

      const data = await res.json();
      const accessToken = data.access_token;
      
      const decoded = parseJwt(accessToken);
      if (!decoded || !decoded.sub) return false;

      const userData: User = { 
        id: "mock-id-from-jwt", 
        username: decoded.sub, 
        role: "USER" 
      };

      setUser(userData);
      setToken(accessToken);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
      localStorage.setItem(STORAGE_KEY_TOKEN, accessToken);
      return true;
    } catch {
      return false;
    }
  }, []);

  // ── Register ────────────────────────────────────────────────────────────────
  const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name, email, password }),
      });

      if (!res.ok) return false;

      // Auto login after successful registration
      return await login(name, password);
    } catch {
      return false;
    }
  }, [login]);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

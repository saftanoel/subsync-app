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

  // ── Set Session ─────────────────────────────────────────────────────────────
  const setSession = useCallback((accessToken: string) => {
    try {
      const decoded = parseJwt(accessToken);
      if (!decoded || !decoded.sub) return;

      const userData: User = { 
        id: "mock-id-from-jwt", 
        username: decoded.sub, 
        role: decoded.role || "USER" 
      };

      setUser(userData);
      setToken(accessToken);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
      localStorage.setItem(STORAGE_KEY_TOKEN, accessToken);
    } catch {
      console.error("Failed to set session");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, logout, setSession }}>
      {children}
    </AuthContext.Provider>
  );
}

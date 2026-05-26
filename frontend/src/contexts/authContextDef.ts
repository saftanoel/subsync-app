import { createContext } from "react";
import { API_BASE } from "@/config/api";

// Re-export so consumers get a single import point
export { API_BASE };

// ── Types ─────────────────────────────────────────────────────────────────────
export interface User {
  id:       string;
  username: string;
  role:     string;
}

export interface AuthContextType {
  user:            User | null;
  token:           string | null;
  isAuthenticated: boolean;
  login:           (username: string, password: string) => Promise<boolean>;
  logout:          () => void;
  register:        (name: string, email: string, password: string) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

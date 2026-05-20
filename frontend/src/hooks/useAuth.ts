// Separate file so that AuthContext.tsx only exports a component (AuthProvider),
// satisfying Vite's Fast Refresh requirement.
export { useAuth } from "@/contexts/AuthContext";

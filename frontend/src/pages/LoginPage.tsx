import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Monitor, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("All fields are required.");
      return;
    }

    setIsLoading(true);
    try {
      const ok = await login(username, password);
      if (ok) {
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        toast.error("Invalid username or password.");
      }
    } catch {
      toast.error("Could not connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass w-full max-w-md rounded-2xl p-8"
      >
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary mb-3">
            <Monitor className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to SubSync</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="admin_user"
              className="bg-secondary/50 border-border"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-secondary/50 border-border"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full gradient-primary text-primary-foreground font-semibold glow-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</>
            ) : (
              "Login"
            )}
          </Button>
        </form>

        {/* Hint for the demo credentials */}
        <div className="mt-4 rounded-lg bg-secondary/40 px-4 py-3 text-xs text-muted-foreground space-y-1">
          <p className="font-semibold text-foreground">Demo credentials</p>
          <p>Admin: <span className="text-primary font-mono">admin_user / admin123</span></p>
          <p>User: &nbsp;<span className="text-primary font-mono">normal_user / user123</span></p>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline">Register</Link>
        </p>
      </motion.div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Monitor } from "lucide-react";
import { API_BASE } from "@/config/api";
import { toast } from "sonner";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("What was your childhood nickname?");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password || !confirm || !securityAnswer) { setError("All fields are required."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: name, 
          email, 
          password,
          security_question: securityQuestion,
          security_answer: securityAnswer
        }),
      });

      if (res.ok) {
        toast.success("Registration successful! Please login.");
        navigate("/login");
      } else {
        setError("Registration failed. Email or username might already exist.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
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
          <h1 className="font-display text-2xl font-bold">Create account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Join SubSync today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Username</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="johndoe" className="bg-secondary/50 border-border" disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="bg-secondary/50 border-border" disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="bg-secondary/50 border-border" disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm Password</Label>
            <Input id="confirm" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" className="bg-secondary/50 border-border" disabled={isLoading} />
          </div>
          
          <div className="space-y-2 pt-2 border-t border-border/50">
            <Label htmlFor="securityQuestion">Security Question</Label>
            <Input id="securityQuestion" type="text" value={securityQuestion} onChange={e => setSecurityQuestion(e.target.value)} placeholder="What was your childhood nickname?" className="bg-secondary/50 border-border" disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="securityAnswer">Security Answer</Label>
            <Input id="securityAnswer" type="text" value={securityAnswer} onChange={e => setSecurityAnswer(e.target.value)} placeholder="Answer" className="bg-secondary/50 border-border" disabled={isLoading} />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full mt-6" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

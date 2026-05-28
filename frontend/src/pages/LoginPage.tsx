import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, KeyRound, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { API_BASE } from "@/config/api";

export default function LoginPage() {
  const { setSession } = useAuth();
  const navigate = useNavigate();
  
  // Step state
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [tempToken, setTempToken] = useState("");
  
  // Form fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) { toast.error("All fields are required."); return; }
    
    setIsLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      if (!res.ok) throw new Error("Invalid username or password");
      
      const data = await res.json();
      if (data.status === "needs_email_verification") {
        setTempToken(data.temp_token);
        setStep(2);
        toast.info("Check your email for the OTP");
      }
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) { toast.error("OTP is required."); return; }
    
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ temp_token: tempToken, otp }),
      });

      if (!res.ok) throw new Error("Invalid OTP");
      
      const data = await res.json();
      if (data.status === "needs_security_question") {
        setTempToken(data.temp_token);
        setSecurityQuestion(data.question);
        setStep(3);
        toast.info("Answer your security question");
      }
    } catch (err: any) {
      toast.error(err.message || "OTP Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!securityAnswer) { toast.error("Answer is required."); return; }
    
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/verify-security`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ temp_token: tempToken, answer: securityAnswer }),
      });

      if (!res.ok) throw new Error("Incorrect answer");
      
      const data = await res.json();
      if (data.access_token) {
        setSession(data.access_token);
        toast.success("Welcome back!");
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message || "Security verification failed");
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
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="mb-8 flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary mb-3">
                  <Monitor className="h-6 w-6 text-primary-foreground" />
                </div>
                <h1 className="font-display text-2xl font-bold">Welcome back</h1>
                <p className="mt-1 text-sm text-muted-foreground">Sign in to SubSync</p>
              </div>

              <form onSubmit={handleStep1} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="admin_user" className="bg-secondary/50 border-border" disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="bg-secondary/50 border-border" disabled={isLoading} />
                </div>
                <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Sign In"}
                </Button>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="mb-8 flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary mb-3">
                  <KeyRound className="h-6 w-6 text-primary-foreground" />
                </div>
                <h1 className="font-display text-2xl font-bold">Email Verification</h1>
                <p className="mt-1 text-sm text-muted-foreground">Enter the 6-digit OTP sent to your email.</p>
              </div>

              <form onSubmit={handleStep2} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">One-Time Password</Label>
                  <Input id="otp" type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} placeholder="123456" className="bg-secondary/50 border-border text-center tracking-widest text-lg" disabled={isLoading} />
                </div>
                <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                  {isLoading ? "Checking..." : "Verify OTP"}
                </Button>
              </form>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="mb-8 flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary mb-3">
                  <ShieldCheck className="h-6 w-6 text-primary-foreground" />
                </div>
                <h1 className="font-display text-2xl font-bold">Security Question</h1>
                <p className="mt-1 text-sm text-muted-foreground text-center">Answer the security question you set during registration.</p>
              </div>

              <form onSubmit={handleStep3} className="space-y-4">
                <div className="space-y-2 p-3 bg-secondary/50 rounded-md border border-border">
                  <p className="text-sm font-medium">{securityQuestion}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="securityAnswer">Your Answer</Label>
                  <Input id="securityAnswer" type="text" value={securityAnswer} onChange={e => setSecurityAnswer(e.target.value)} placeholder="Answer" className="bg-secondary/50 border-border" disabled={isLoading} />
                </div>
                <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                  {isLoading ? "Authorizing..." : "Complete Login"}
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {step === 1 && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        )}
      </motion.div>
    </div>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { DatabaseZap, Square, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { API_BASE } from "@/config/api";
import { useAuth } from "@/hooks/useAuth";

export function DataGenerator() {
  const { token } = useAuth();
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/start-generator`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setIsRunning(true);
        toast.success("Data generator started! New subscriptions are being generated.");
      } else {
        toast.error("Failed to start generator. Is the backend running?");
      }
    } catch {
      toast.error("Could not connect to backend.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/stop-generator`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setIsRunning(false);
        toast.info("Data generator stopped.");
      } else {
        toast.error("Failed to stop generator.");
      }
    } catch {
      toast.error("Could not connect to backend.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-xl p-4 flex items-center justify-between gap-4 border border-border/50"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary flex-shrink-0">
          <DatabaseZap className={`h-4 w-4 ${isRunning ? "text-emerald-400 animate-pulse" : "text-muted-foreground"}`} />
        </div>
        <div>
          <p className="text-sm font-semibold leading-none">Data Generator</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {isRunning ? (
              <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                Running — generating fake subscriptions…
              </span>
            ) : (
              "Start to auto-populate the database with fake subscription data."
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Button
          size="sm"
          variant="outline"
          onClick={handleStop}
          disabled={!isRunning || isLoading}
          className="gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
        >
          {isLoading && !isRunning ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Square className="h-3.5 w-3.5" />
          )}
          Stop
        </Button>
        <Button
          size="sm"
          onClick={handleStart}
          disabled={isRunning || isLoading}
          className="gap-1.5 gradient-primary text-primary-foreground font-semibold glow-primary disabled:opacity-40"
        >
          {isLoading && isRunning ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <DatabaseZap className="h-3.5 w-3.5" />
          )}
          Start
        </Button>
      </div>
    </motion.div>
  );
}

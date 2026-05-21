import { useEffect, useState } from "react";
import { AlertCircle, ShieldAlert, Clock, UserX } from "lucide-react";
import { motion } from "framer-motion";
import { API_BASE } from "@/config/api";
import { cn } from "@/lib/utils";

interface FlaggedUser {
  _id: string;
  username: string;
  reason: string;
  timestamp: string;
}

export function AdminObservationList() {
  const [flaggedUsers, setFlaggedUsers] = useState<FlaggedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFlaggedUsers = async () => {
      try {
        // AICI ESTE MAGIA: Header-ul care îi spune lui Ngrok să ne lase să trecem
        const res = await fetch(`${API_BASE}/admin/flagged-users`, {
          headers: {
            "ngrok-skip-browser-warning": "69420"
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          setFlaggedUsers(data);
        } else {
          console.error("Failed to fetch flagged users");
        }
      } catch (error) {
        console.error("Error fetching flagged users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlaggedUsers();
  }, []);

  return (
    <div className={cn('glass', 'rounded-xl', 'border', 'border-destructive/50', 'bg-destructive/5', 'shadow-sm', 'overflow-hidden', 'mt-6')}>
      <div className={cn('flex', 'items-center', 'gap-2', 'border-b', 'border-destructive/20', 'bg-destructive/10', 'px-4', 'py-3')}>
        <div className={cn('flex', 'h-8', 'w-8', 'items-center', 'justify-center', 'rounded-lg', 'bg-destructive/20', 'text-destructive')}>
          <ShieldAlert className={cn('h-5', 'w-5')} />
        </div>
        <div>
          <h3 className={cn('font-display', 'text-sm', 'font-semibold', 'text-destructive')}>Security Alerts</h3>
          <p className={cn('text-xs', 'text-destructive/80')}>Flagged User Activity Observation</p>
        </div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className={cn('flex', 'flex-col', 'items-center', 'justify-center', 'py-8', 'text-muted-foreground', 'animate-pulse')}>
            <div className={cn('h-6', 'w-6', 'border-2', 'border-destructive', 'border-t-transparent', 'rounded-full', 'animate-spin', 'mb-2')}></div>
            <p className="text-sm">Loading security logs...</p>
          </div>
        ) : flaggedUsers.length === 0 ? (
          <div className={cn('flex', 'flex-col', 'items-center', 'justify-center', 'py-8', 'text-muted-foreground')}>
            <AlertCircle className={cn('h-10', 'w-10', 'text-emerald-500/50', 'mb-3')} />
            <p className={cn('text-sm', 'font-medium', 'text-emerald-500')}>No anomalies detected.</p>
            <p className="text-xs">All user activity is normal.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {flaggedUsers.map((user, idx) => (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={user._id}
                className={cn('flex', 'flex-col', 'sm:flex-row', 'sm:items-center', 'justify-between', 'gap-3', 'rounded-lg', 'border', 'border-destructive/20', 'bg-background/50', 'p-3')}
              >
                <div className={cn('flex', 'items-start', 'sm:items-center', 'gap-3')}>
                  <div className={cn('rounded-full', 'bg-destructive/10', 'p-2', 'text-destructive')}>
                    <UserX className={cn('h-4', 'w-4')} />
                  </div>
                  <div>
                    <p className={cn('text-sm', 'font-semibold', 'text-foreground')}>
                      {user.username}
                    </p>
                    <p className={cn('text-xs', 'text-muted-foreground')}>
                      {user.reason}
                    </p>
                  </div>
                </div>
                <div className={cn('flex', 'items-center', 'gap-1.5', 'text-xs', 'text-muted-foreground', 'sm:ml-auto', 'bg-secondary/50', 'px-2.5', 'py-1', 'rounded-md')}>
                  <Clock className={cn('h-3.5', 'w-3.5')} />
                  {new Date(user.timestamp).toLocaleString([], {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
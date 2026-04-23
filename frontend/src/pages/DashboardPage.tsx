import { useState, useMemo, useEffect } from "react";
import { useSubscriptions } from "@/contexts/SubscriptionContext";
import { SubscriptionTable } from "@/components/SubscriptionTable";
import { StatsCharts } from "@/components/StatsCharts";
import { SubscriptionForm } from "@/components/SubscriptionForm";
import { SubscriptionDetail } from "@/components/SubscriptionDetail";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, DollarSign, CreditCard, TrendingUp, WifiOff } from "lucide-react";
import type { Subscription } from "@/types/subscription";

export default function DashboardPage() {
  // GOLD CHALLENGE: Am adus isLoading, hasMore și loadMore din Context
  const { subscriptions, isOnline, isLoading, hasMore, loadMore } = useSubscriptions();
  const [showForm, setShowForm] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);

  const totalMonthly = useMemo(() =>
    subscriptions.reduce((sum, s) => sum + s.monthlyCost, 0), [subscriptions]);
  const totalAnnual = totalMonthly * 12;
  const avgRating = useMemo(() => {
    if (!subscriptions.length) return 0;
    return subscriptions.reduce((sum, s) => sum + s.valueRating, 0) / subscriptions.length;
  }, [subscriptions]);

  const stats = [
    { icon: DollarSign, label: "Monthly Spend", value: `$${totalMonthly.toFixed(2)}`, color: "text-primary" },
    { icon: CreditCard, label: "Annual Spend", value: `$${totalAnnual.toFixed(2)}`, color: "text-chart-2" },
    { icon: TrendingUp, label: "Avg Rating", value: `${avgRating.toFixed(1)} / 5`, color: "text-chart-4" },
    { icon: CreditCard, label: "Active Subs", value: String(subscriptions.length), color: "text-chart-3" },
  ];

  useEffect(() => {
    document.cookie = "user-activity=active; path=/; max-age=86400"; 
    document.cookie = "preferences=dark-mode; path=/; max-age=86400";
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 flex items-center justify-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
          >
            <WifiOff className="h-4 w-4" />
            Atenție: Ești în modul Offline. Modificările sunt salvate local și se vor sincroniza când revine conexiunea.
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className={`font-display text-lg font-bold ${s.color} ${s.label === "Monthly Spend" ? "total-amount" : ""}`}>
                  {s.value}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Your Subscriptions</h1>
        <Button onClick={() => { setEditingSub(null); setShowForm(true); }} className="gradient-primary text-primary-foreground font-semibold glow-primary gap-2">
          <Plus className="h-4 w-4" /> Add Subscription
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        
        {/* ZONA DE TABEL + BUTON DE LOAD MORE */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <SubscriptionTable
            onEdit={(sub) => { setEditingSub(sub); setShowForm(true); }}
            onSelect={setSelectedSub}
          />
          
          {/* Logica de Paginare / Infinite Scroll */}
          {hasMore && (
            <Button 
              variant="outline" 
              className="w-full border-dashed py-6 text-muted-foreground hover:text-foreground"
              onClick={loadMore}
              disabled={isLoading || !isOnline}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  Se încarcă...
                </span>
              ) : (
                " Încarcă următoarea pagină "
              )}
            </Button>
          )}
          
          {!hasMore && subscriptions.length > 0 && (
            <p className="text-center text-xs text-muted-foreground">
              Ai ajuns la finalul bazei de date. Toate datele sunt afișate.
            </p>
          )}
        </div>

        <div className="lg:col-span-2">
          <StatsCharts />
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <SubscriptionForm
            subscription={editingSub}
            onClose={() => { setShowForm(false); setEditingSub(null); }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedSub && (
          <SubscriptionDetail
            subscription={selectedSub}
            onClose={() => setSelectedSub(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
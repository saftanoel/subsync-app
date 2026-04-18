import { useState, useMemo, useEffect } from "react";
import { useSubscriptions } from "@/contexts/SubscriptionContext";
import { SubscriptionTable } from "@/components/SubscriptionTable";
import { StatsCharts } from "@/components/StatsCharts";
import { SubscriptionForm } from "@/components/SubscriptionForm";
import { SubscriptionDetail } from "@/components/SubscriptionDetail";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, DollarSign, CreditCard, TrendingUp } from "lucide-react";
import type { Subscription } from "@/types/subscription";

export default function DashboardPage() {
  const { subscriptions } = useSubscriptions();
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
    // Setează cookie-urile cerute de testul Playwright
    document.cookie = "user-activity=active; path=/; max-age=86400"; // Expiră în 24h
    document.cookie = "preferences=dark-mode; path=/; max-age=86400";

    console.log("Cookies have been set for Silver Challenge");
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Stats row */}
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

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Your Subscriptions</h1>
        <Button onClick={() => { setEditingSub(null); setShowForm(true); }} className="gradient-primary text-primary-foreground font-semibold glow-primary gap-2">
          <Plus className="h-4 w-4" /> Add Subscription
        </Button>
      </div>

      {/* Side by side: Table + Charts */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <SubscriptionTable
            onEdit={(sub) => { setEditingSub(sub); setShowForm(true); }}
            onSelect={setSelectedSub}
          />
        </div>
        <div className="lg:col-span-2">
          <StatsCharts />
        </div>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <SubscriptionForm
            subscription={editingSub}
            onClose={() => { setShowForm(false); setEditingSub(null); }}
          />
        )}
      </AnimatePresence>

      {/* Detail Modal */}
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

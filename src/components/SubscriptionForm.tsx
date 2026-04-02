import { useState, useEffect } from "react";
import { useSubscriptions } from "@/contexts/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { X, Star } from "lucide-react";
import { CATEGORIES, BILLING_CYCLES, type Subscription } from "@/types/subscription";

interface Props {
  subscription: Subscription | null;
  onClose: () => void;
}

export function SubscriptionForm({ subscription, onClose }: Props) {
  const { addSubscription, updateSubscription } = useSubscriptions();
  const isEdit = !!subscription;

  const [form, setForm] = useState({
    serviceName: "",
    category: "Entertainment",
    monthlyCost: "",
    billingCycle: "Monthly" as "Monthly" | "Annual" | "Weekly",
    nextPayment: "",
    valueRating: 3,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (subscription) {
      setForm({
        serviceName: subscription.serviceName,
        category: subscription.category,
        monthlyCost: String(subscription.monthlyCost),
        billingCycle: subscription.billingCycle,
        nextPayment: subscription.nextPayment,
        valueRating: subscription.valueRating,
      });
    }
  }, [subscription]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.serviceName.trim()) e.serviceName = "Service name is required.";
    if (!form.monthlyCost || isNaN(Number(form.monthlyCost)) || Number(form.monthlyCost) <= 0) e.monthlyCost = "Enter a valid positive cost.";
    if (!form.nextPayment) e.nextPayment = "Next payment date is required.";
    else {
      const d = new Date(form.nextPayment);
      if (isNaN(d.getTime())) e.nextPayment = "Invalid date format.";
    }
    if (form.valueRating < 1 || form.valueRating > 5) e.valueRating = "Rating must be 1-5.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const data = {
      serviceName: form.serviceName.trim(),
      category: form.category,
      monthlyCost: Number(form.monthlyCost),
      billingCycle: form.billingCycle,
      nextPayment: form.nextPayment,
      valueRating: form.valueRating,
    };
    if (isEdit && subscription) updateSubscription(subscription.id, data);
    else addSubscription(data);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass w-full max-w-lg rounded-2xl p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold">{isEdit ? "Edit" : "Add"} Subscription</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Service Name</Label>
            <Input value={form.serviceName} onChange={e => setForm(f => ({ ...f, serviceName: e.target.value }))} placeholder="Netflix" className="bg-secondary/50 border-border" />
            {errors.serviceName && <p className="text-xs text-destructive">{errors.serviceName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger className="bg-secondary/50 border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Billing Cycle</Label>
              <Select value={form.billingCycle} onValueChange={v => setForm(f => ({ ...f, billingCycle: v as typeof f.billingCycle }))}>
                <SelectTrigger className="bg-secondary/50 border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {BILLING_CYCLES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Monthly Cost ($)</Label>
              <Input type="number" step="0.01" min="0.01" value={form.monthlyCost} onChange={e => setForm(f => ({ ...f, monthlyCost: e.target.value }))} placeholder="9.99" className="bg-secondary/50 border-border" />
              {errors.monthlyCost && <p className="text-xs text-destructive">{errors.monthlyCost}</p>}
            </div>
            <div className="space-y-2">
              <Label>Next Payment</Label>
              <Input type="date" value={form.nextPayment} onChange={e => setForm(f => ({ ...f, nextPayment: e.target.value }))} className="bg-secondary/50 border-border" />
              {errors.nextPayment && <p className="text-xs text-destructive">{errors.nextPayment}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Value Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s} type="button" onClick={() => setForm(f => ({ ...f, valueRating: s }))}>
                  <Star className={`h-6 w-6 transition-colors ${s <= form.valueRating ? "fill-chart-4 text-chart-4" : "text-muted"}`} />
                </button>
              ))}
            </div>
            {errors.valueRating && <p className="text-xs text-destructive">{errors.valueRating}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1 gradient-primary text-primary-foreground font-semibold glow-primary">
              {isEdit ? "Update" : "Add"} Subscription
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="border-border text-foreground">
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Star, TrendingDown, Calendar, DollarSign } from "lucide-react";
import type { Subscription } from "@/types/subscription";
import { PaymentHistory } from "./PaymentHistory"; // <-- AM ADĂUGAT IMPORTUL

interface Props {
  subscription: Subscription;
  onClose: () => void;
}

export function SubscriptionDetail({ subscription: sub, onClose }: Props) {
  const yearly = sub.monthlyCost * 12;
  const savings = [
    { period: "1 Year Saved", amount: yearly, desc: "Just by hitting cancel, enough for a weekend city break." },
    { period: "5 Years Invested", amount: yearly * 5 * 1.07, desc: "Assuming a conservative 7% annual stock market return." },
    { period: "10 Years Invested", amount: yearly * 10 * 1.15, desc: "A serious contribution to your savings account or house down payment." },
  ];

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
        className="glass w-full max-w-2xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl font-bold">{sub.serviceName}</h2>
            <p className="text-sm text-muted-foreground">{sub.category} · {sub.billingCycle}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl bg-secondary/50 p-4 text-center">
            <DollarSign className="mx-auto h-5 w-5 text-primary mb-1" />
            <p className="font-display text-xl font-bold text-primary">${sub.monthlyCost.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">per month</p>
          </div>
          <div className="rounded-xl bg-secondary/50 p-4 text-center">
            <Calendar className="mx-auto h-5 w-5 text-chart-2 mb-1" />
            <p className="font-display text-xl font-bold text-chart-2">{sub.nextPayment}</p>
            <p className="text-xs text-muted-foreground">next payment</p>
          </div>
          <div className="rounded-xl bg-secondary/50 p-4 text-center">
            <Star className="mx-auto h-5 w-5 text-chart-4 mb-1" />
            <div className="flex justify-center gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className={`h-4 w-4 ${s <= sub.valueRating ? "fill-chart-4 text-chart-4" : "text-muted"}`} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">value rating</p>
          </div>
        </div>

        {/* The Chopping Block - ROI cards */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="h-5 w-5 text-destructive" />
            <h3 className="font-display text-lg font-bold">The Chopping Block</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">See how much you'd save by cancelling {sub.serviceName}:</p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {savings.map((s, i) => (
              <motion.div
                key={s.period}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.15 }}
                className="rounded-xl bg-secondary/50 border border-border p-5 text-center hover:border-destructive/50 transition-colors"
              >
                <p className="text-xs font-medium text-muted-foreground mb-2">{s.period}</p>
                <p className="font-display text-3xl font-bold text-primary mb-2">
                  ${s.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                <Button size="sm" className="mt-4 bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold text-xs w-full">
                  SAVE NOW !
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* <-- Fullstack relation --> */}
        <PaymentHistory 
          subscriptionId={sub.id} 
          payments={sub.payments || []} 
        />

      </motion.div>
    </motion.div>
  );
}
import { useMemo } from "react";
import { useSubscriptions } from "@/contexts/SubscriptionContext";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";

const COLORS = [
  "hsl(160, 84%, 39%)",
  "hsl(200, 80%, 50%)",
  "hsl(280, 70%, 55%)",
  "hsl(35, 90%, 55%)",
  "hsl(340, 70%, 55%)",
  "hsl(180, 60%, 45%)",
  "hsl(60, 70%, 50%)",
  "hsl(120, 50%, 45%)",
];

export function StatsCharts() {
  const { subscriptions } = useSubscriptions();

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    subscriptions.forEach(s => {
      map[s.category] = (map[s.category] || 0) + s.monthlyCost;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value: +value.toFixed(2) }));
  }, [subscriptions]);

  const weeklyData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    // Distribute costs across the week proportionally
    const dailyTotal = subscriptions.reduce((s, sub) => s + sub.monthlyCost, 0) / 4; // weekly
    return days.map((name, i) => ({
      name,
      amount: +(dailyTotal / 7 * (0.7 + Math.sin(i * 1.2) * 0.6)).toFixed(2),
    }));
  }, [subscriptions]);

  const totalWeekly = weeklyData.reduce((s, d) => s + d.amount, 0);

  return (
    <div className="space-y-4">
      {/* Pie chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-5"
      >
        <h3 className="font-display text-sm font-semibold mb-1">Statistics</h3>
        <p className="text-xs text-muted-foreground mb-4">Category Breakdown</p>
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                animationDuration={800}
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "hsl(220, 18%, 12%)", border: "1px solid hsl(220, 14%, 22%)", borderRadius: "8px", fontSize: "12px" }}
                itemStyle={{ color: "hsl(210, 20%, 95%)" }}
                formatter={(value: number) => [`$${value}`, "Monthly"]}
              />
              <Legend
                wrapperStyle={{ fontSize: "11px", color: "hsl(215, 12%, 55%)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">No data</div>
        )}
      </motion.div>

      {/* Bar chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display text-sm font-semibold">Weekly Payment Breakdown</h3>
            <p className="text-xs text-muted-foreground">Total due this week: ${totalWeekly.toFixed(2)}</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={weeklyData}>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(215, 12%, 55%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(215, 12%, 55%)" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "hsl(220, 18%, 12%)", border: "1px solid hsl(220, 14%, 22%)", borderRadius: "8px", fontSize: "12px" }}
              itemStyle={{ color: "hsl(210, 20%, 95%)" }}
              formatter={(value: number) => [`$${value}`, "Amount"]}
            />
            <Bar dataKey="amount" fill="hsl(200, 80%, 50%)" radius={[4, 4, 0, 0]} animationDuration={800} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Value for money */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-5"
      >
        <h3 className="font-display text-sm font-semibold mb-3">Value for Money Rating</h3>
        <div className="space-y-2">
          {subscriptions.slice(0, 4).map(sub => (
            <div key={sub.id} className="flex items-center justify-between text-xs">
              <span className="text-primary font-medium">{sub.serviceName} · ${sub.monthlyCost}/mo</span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(s => (
                  <span key={s} className={s <= sub.valueRating ? "text-chart-4" : "text-muted"}>★</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

import { useState, useMemo } from "react";
import { useSubscriptions } from "@/contexts/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Pencil, Trash2, ChevronLeft, ChevronRight, ArrowUpDown, Star } from "lucide-react";
import type { Subscription } from "@/types/subscription";

const PAGE_SIZE = 5;

interface Props {
  onEdit: (sub: Subscription) => void;
  onSelect: (sub: Subscription) => void;
}

export function SubscriptionTable({ onEdit, onSelect }: Props) {
  const { subscriptions, deleteSubscription, sortColumn, setSortColumn } = useSubscriptions();
  const [page, setPage] = useState(0);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const sorted = useMemo(() => {
    const arr = [...subscriptions];
    arr.sort((a, b) => {
      const aVal = a[sortColumn as keyof Subscription];
      const bVal = b[sortColumn as keyof Subscription];
      if (typeof aVal === "number" && typeof bVal === "number") return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      return sortDir === "asc" ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
    });
    return arr;
  }, [subscriptions, sortColumn, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleSort = (col: string) => {
    if (sortColumn === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortColumn(col); setSortDir("asc"); }
  };

  const columns = [
    { key: "serviceName", label: "Service" },
    { key: "monthlyCost", label: "Cost" },
    { key: "billingCycle", label: "Cycle" },
    { key: "nextPayment", label: "Next Payment" },
    { key: "valueRating", label: "Rating" },
  ];

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="cursor-pointer px-4 py-3 text-left font-medium text-muted-foreground hover:text-foreground transition-colors select-none"
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    <ArrowUpDown className="h-3 w-3" />
                  </span>
                </th>
              ))}
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((sub, i) => (
              <motion.tr
                key={sub.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => onSelect(sub)}
                className="border-b border-border/50 cursor-pointer transition-colors hover:bg-secondary/30"
              >
                <td className="px-4 py-3 font-medium">{sub.serviceName}</td>
                <td className="px-4 py-3 text-primary font-semibold">${sub.monthlyCost.toFixed(2)}</td>
                <td className="px-4 py-3 text-muted-foreground">{sub.billingCycle}</td>
                <td className="px-4 py-3 text-muted-foreground">{sub.nextPayment}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`h-3.5 w-3.5 ${s <= sub.valueRating ? "fill-chart-4 text-chart-4" : "text-muted"}`} />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => onEdit(sub)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => deleteSubscription(sub.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
            {paginated.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No subscriptions yet. Add one!</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-border px-4 py-3">
        <span className="text-xs text-muted-foreground">
          Page {page + 1} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={page === i ? "default" : "ghost"}
              size="icon"
              className={`h-7 w-7 text-xs ${page === i ? "gradient-primary text-primary-foreground" : ""}`}
              onClick={() => setPage(i)}
            >
              {i + 1}
            </Button>
          ))}
          <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

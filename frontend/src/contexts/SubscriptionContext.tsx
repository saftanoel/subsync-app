import React, { createContext, useContext, useState, useCallback } from "react";
import Cookies from "js-cookie";
import type { Subscription } from "@/types/subscription";

interface SubscriptionContextType {
  subscriptions: Subscription[];
  addSubscription: (sub: Omit<Subscription, "id">) => void;
  updateSubscription: (id: string, sub: Partial<Omit<Subscription, "id">>) => void;
  deleteSubscription: (id: string) => void;
  getSubscription: (id: string) => Subscription | undefined;
  sortColumn: string;
  setSortColumn: (col: string) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

const initialSubs: Subscription[] = [
  { id: "1", serviceName: "Netflix", category: "Entertainment", monthlyCost: 15.99, billingCycle: "Monthly", nextPayment: "2024-11-15", valueRating: 4 },
  { id: "2", serviceName: "Adobe Cloud", category: "Software", monthlyCost: 54.99, billingCycle: "Monthly", nextPayment: "2024-11-22", valueRating: 3 },
  { id: "3", serviceName: "Amazon Prime", category: "Entertainment", monthlyCost: 11.58, billingCycle: "Annual", nextPayment: "2024-12-12", valueRating: 5 },
  { id: "4", serviceName: "Spotify Family", category: "Music", monthlyCost: 16.99, billingCycle: "Monthly", nextPayment: "2024-11-28", valueRating: 4 },
  { id: "5", serviceName: "ChatGPT Plus", category: "Productivity", monthlyCost: 20.00, billingCycle: "Monthly", nextPayment: "2024-11-05", valueRating: 5 },
  { id: "6", serviceName: "iCloud+", category: "Cloud Storage", monthlyCost: 2.99, billingCycle: "Monthly", nextPayment: "2024-11-18", valueRating: 3 },
  { id: "7", serviceName: "Gym Membership", category: "Fitness", monthlyCost: 35.00, billingCycle: "Monthly", nextPayment: "2024-11-01", valueRating: 2 },
  { id: "8", serviceName: "NYT Digital", category: "News", monthlyCost: 4.25, billingCycle: "Monthly", nextPayment: "2024-11-10", valueRating: 3 },
];

let nextId = 9;

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubs);
  const [sortColumn, setSortColumnState] = useState<string>(() => {
    return Cookies.get("subsync_sort") || "serviceName";
  });

  const setSortColumn = useCallback((col: string) => {
    setSortColumnState(col);
    Cookies.set("subsync_sort", col, { expires: 365 });
  }, []);

  const addSubscription = useCallback((sub: Omit<Subscription, "id">) => {
    setSubscriptions(prev => [...prev, { ...sub, id: String(nextId++) }]);
  }, []);

  const updateSubscription = useCallback((id: string, updates: Partial<Omit<Subscription, "id">>) => {
    setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const deleteSubscription = useCallback((id: string) => {
    setSubscriptions(prev => prev.filter(s => s.id !== id));
  }, []);

  const getSubscription = useCallback((id: string) => {
    return subscriptions.find(s => s.id === id);
  }, [subscriptions]);

  return (
    <SubscriptionContext.Provider value={{ subscriptions, addSubscription, updateSubscription, deleteSubscription, getSubscription, sortColumn, setSortColumn }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export const useSubscriptions = () => {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error("useSubscriptions must be used within SubscriptionProvider");
  return ctx;
};

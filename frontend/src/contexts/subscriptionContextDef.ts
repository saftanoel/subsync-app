import { createContext } from "react";
import type { Subscription } from "@/types/subscription";

export interface SubscriptionContextType {
  subscriptions: Subscription[];
  isOnline: boolean;
  addSubscription: (sub: Omit<Subscription, "id">) => void;
  updateSubscription: (id: string, sub: Partial<Omit<Subscription, "id">>) => void;
  deleteSubscription: (id: string) => void;
  getSubscription: (id: string) => Subscription | undefined;
  sortColumn: string;
  setSortColumn: (col: string) => void;
  hasMore: boolean;
  loadMore: () => void;
  isLoading: boolean;
}

export const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

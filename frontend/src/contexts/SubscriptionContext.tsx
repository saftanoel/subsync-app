import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
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

/* const initialSubs: Subscription[] = [

{ id: "1", serviceName: "Netflix", category: "Entertainment", monthlyCost: 15.99, billingCycle: "Monthly", nextPayment: "2024-11-15", valueRating: 4 },

{ id: "2", serviceName: "Adobe Cloud", category: "Software", monthlyCost: 54.99, billingCycle: "Monthly", nextPayment: "2024-11-22", valueRating: 3 },

{ id: "3", serviceName: "Amazon Prime", category: "Entertainment", monthlyCost: 11.58, billingCycle: "Annual", nextPayment: "2024-12-12", valueRating: 5 },

{ id: "4", serviceName: "Spotify Family", category: "Music", monthlyCost: 16.99, billingCycle: "Monthly", nextPayment: "2024-11-28", valueRating: 4 },

{ id: "5", serviceName: "ChatGPT Plus", category: "Productivity", monthlyCost: 20.00, billingCycle: "Monthly", nextPayment: "2024-11-05", valueRating: 5 },

{ id: "6", serviceName: "iCloud+", category: "Cloud Storage", monthlyCost: 2.99, billingCycle: "Monthly", nextPayment: "2024-11-18", valueRating: 3 },

{ id: "7", serviceName: "Gym Membership", category: "Fitness", monthlyCost: 35.00, billingCycle: "Monthly", nextPayment: "2024-11-01", valueRating: 2 },

{ id: "8", serviceName: "NYT Digital", category: "News", monthlyCost: 4.25, billingCycle: "Monthly", nextPayment: "2024-11-10", valueRating: 3 },

];
 */


const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  // Pornim cu o listă goală, datele vor veni de la backend-ul de Python
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  
  const [sortColumn, setSortColumnState] = useState<string>(() => {
    return Cookies.get("subsync_sort") || "serviceName";
  });

  const setSortColumn = useCallback((col: string) => {
    setSortColumnState(col);
    Cookies.set("subsync_sort", col, { expires: 365 });
  }, []);

  // get si websocket logic - backend integration with Python server
useEffect(() => {
    // Luăm lista inițială
    fetch("http://localhost:8000/subscriptions?limit=100")
      .then((res) => res.json())
      .then((data) => setSubscriptions(data))
      .catch((err) => console.error("Eroare la fetch:", err));

    const ws = new WebSocket("ws://localhost:8000/ws");

    ws.onopen = () => {
      console.log("🟢 Conexiune WebSocket DESCHISĂ!");
    };

    ws.onmessage = (event) => {
      console.log("🔵 A venit un abonament nou prin WebSocket:", event.data);
      const noulAbonament = JSON.parse(event.data);
      setSubscriptions((prev) => [...prev, noulAbonament]);
    };

    ws.onerror = (error) => {
      console.error("🔴 Eroare WebSocket. Serverul a refuzat conexiunea.");
    };

    // Curățare curată ca să nu crăpăm backend-ul
    return () => {
      if (ws.readyState === 1) { 
        ws.close();
      }
    };
  }, []);
 
  const addSubscription = useCallback((sub: Omit<Subscription, "id">) => {
    const fakeId = String(Date.now());
    setSubscriptions(prev => [...prev, { ...sub, id: fakeId }]);
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
  if (!ctx) throw new Error("useSubscuvicorn main:app --reloadriptions must be used within SubscriptionProvider");
  return ctx;
};
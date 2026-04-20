import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import Cookies from "js-cookie";
import type { Subscription } from "@/types/subscription";
import { toast } from "sonner"; // Presupunând că folosești Sonner din proiectul tău

interface SubscriptionContextType {
  subscriptions: Subscription[];
  isOnline: boolean;
  addSubscription: (sub: Omit<Subscription, "id">) => void;
  updateSubscription: (id: string, sub: Partial<Omit<Subscription, "id">>) => void;
  deleteSubscription: (id: string) => void;
  getSubscription: (id: string) => Subscription | undefined;
  sortColumn: string;
  setSortColumn: (col: string) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  // 1. Încărcăm datele din LocalStorage la început (dacă există)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem("subsync_data");
    return saved ? JSON.parse(saved) : [];
  });

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [sortColumn, setSortColumnState] = useState<string>(() => Cookies.get("subsync_sort") || "serviceName");

  // Salvare automată în LocalStorage ori de câte ori se schimbă lista
  useEffect(() => {
    localStorage.setItem("subsync_data", JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    // Detectăm starea internetului browser-ului
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Fetch inițial
    fetch("http://127.0.0.1:8000/subscriptions?limit=100")
      .then((res) => res.json())
      .then((data) => setSubscriptions(data))
      .catch((err) => {
        console.log("Serverul este offline, folosim datele locale cache-uite.");
        setIsOnline(false);
      });

    // WebSocket Logic
    const ws = new WebSocket("ws://127.0.0.1:8000/ws");

    ws.onopen = () => {
      setIsOnline(true);
      console.log("🟢 Conexiune live activă");
    };

    ws.onmessage = (event) => {
      const noulAbonament = JSON.parse(event.data);
      setSubscriptions((prev) => [...prev, noulAbonament]);
    };

    ws.onclose = () => {
      setIsOnline(false);
      console.log("🔴 Conexiune pierdută cu serverul");
    };

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      ws.close();
    };
  }, []);

  // Funcțiile de CRUD rămân la fel, dar acum ele modifică starea care se salvează automat în LocalStorage
  const addSubscription = useCallback((sub: Omit<Subscription, "id">) => {
    const newSub = { ...sub, id: String(Date.now()) };
    setSubscriptions(prev => [...prev, newSub]);
    if (!isOnline) toast.info("Salvat local (offline)");
  }, [isOnline]);

  const updateSubscription = useCallback((id: string, updates: Partial<Omit<Subscription, "id">>) => {
    setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const deleteSubscription = useCallback((id: string) => {
    setSubscriptions(prev => prev.filter(s => s.id !== id));
  }, []);

  const getSubscription = useCallback((id: string) => subscriptions.find(s => s.id === id), [subscriptions]);

  const setSortColumn = useCallback((col: string) => {
    setSortColumnState(col);
    Cookies.set("subsync_sort", col, { expires: 365 });
  }, []);

  return (
    <SubscriptionContext.Provider value={{ subscriptions, isOnline, addSubscription, updateSubscription, deleteSubscription, getSubscription, sortColumn, setSortColumn }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export const useSubscriptions = () => {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error("useSubscriptions must be used within SubscriptionProvider");
  return ctx;
};
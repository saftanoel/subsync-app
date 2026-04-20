import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import Cookies from "js-cookie";
import type { Subscription } from "@/types/subscription";
import { toast } from "sonner"; 

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
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem("subsync_data");
    return saved ? JSON.parse(saved) : [];
  });

  const [isOnline, setIsOnline] = useState(true);
  const [sortColumn, setSortColumnState] = useState<string>(() => Cookies.get("subsync_sort") || "serviceName");

  // Salvare permanentă în LocalStorage
  useEffect(() => {
    localStorage.setItem("subsync_data", JSON.stringify(subscriptions));
  }, [subscriptions]);

  // Data sync function - aduce datele de pe sv si le combina cu ce avem local (daca e cazul)
  const syncWithServer = useCallback(async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/subscriptions?limit=100");
      if (!res.ok) throw new Error("Server unreachable");
      
      const serverData: Subscription[] = await res.json();
      const savedData = localStorage.getItem("subsync_data");
      
      let finalData = [...serverData];

      if (savedData) {
        const localData: Subscription[] = JSON.parse(savedData);
        
        // Căutăm elementele care există în LocalStorage dar NU există pe server
        const missingOnServer = localData.filter(
          (localSub) => !serverData.some((serverSub) => serverSub.id === localSub.id)
        );

        // Dacă am creat chestii offline, le combinam cu ce a venit de la server
        if (missingOnServer.length > 0) {
          console.log("🔄 Sincronizăm elementele offline...", missingOnServer);
          finalData = [...finalData, ...missingOnServer];
          toast.success(`Sincronizare completă! ${missingOnServer.length} abonamente salvate.`);
        }
      }

      setSubscriptions(finalData);
      setIsOnline(true);
      return true; // Succes
    } catch (error) {
      setIsOnline(false);
      return false; 
    }
  }, []);

  // SISTEMUL DE AUTO-RECONNECT & WEBSOCKET
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimer: NodeJS.Timeout;

    const connectAndSync = async () => {
      const serverIsUp = await syncWithServer();

      if (!serverIsUp) {
        // Dacă serverul e oprit, încercăm din nou peste 5 secunde, la nesfârșit
        console.log("Server offline. Încercăm reconectarea în 5 secunde...");
        reconnectTimer = setTimeout(connectAndSync, 5000);
        return;
      }

      ws = new WebSocket("ws://127.0.0.1:8000/ws");

      ws.onopen = () => {
        console.log("🟢 Conexiune live activă!");
        setIsOnline(true);
      };

      ws.onmessage = (event) => {
        const noulAbonament = JSON.parse(event.data);
        setSubscriptions((prev) => {
          // Prevenim duplicatele (dacă vine pe țeavă ceva ce avem deja)
          if (prev.some(s => s.id === noulAbonament.id)) return prev;
          return [...prev, noulAbonament];
        });
      };

      ws.onclose = () => {
        console.log("🔴 Conexiune pierdută. Trecem pe Offline.");
        setIsOnline(false);
        // Dacă a crăpat țeava, pornim bucla de reconectare
        reconnectTimer = setTimeout(connectAndSync, 5000);
      };

      ws.onerror = () => {
        // Error forțează închiderea, care declanșează onclose-ul de mai sus
        if (ws?.readyState === WebSocket.OPEN) ws.close();
      };
    };

    connectAndSync();

    return () => {
      clearTimeout(reconnectTimer);
      if (ws) ws.close();
    };
  }, [syncWithServer]);

  const addSubscription = useCallback((sub: Omit<Subscription, "id">) => {
    const newSub = { ...sub, id: String(Date.now()) };
    setSubscriptions(prev => [...prev, newSub]);
    if (!isOnline) toast.info("Salvat local (offline). Se va trimite automat când revine conexiunea.");
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
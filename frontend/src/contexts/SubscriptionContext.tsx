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
  hasMore: boolean;
  loadMore: () => void;
  isLoading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

const LIMIT = 10; 

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem("subsync_data");
    return saved ? JSON.parse(saved) : [];
  });

  const [isOnline, setIsOnline] = useState(true);
  const [sortColumn, setSortColumnState] = useState<string>(() => Cookies.get("subsync_sort") || "serviceName");
  
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // "Sertarul" pentru Prefetching
  const [prefetchedData, setPrefetchedData] = useState<Subscription[]>([]);

  useEffect(() => {
    localStorage.setItem("subsync_data", JSON.stringify(subscriptions));
  }, [subscriptions]);

  const fetchFromGraphQL = async (currentSkip: number) => {
    const query = `
      query {
        allSubscriptions(skip: ${currentSkip}, limit: ${LIMIT}) {
          id
          serviceName
          category
          monthlyCost
          billingCycle
          nextPayment
          valueRating
          payments { id amount date }
        }
      }
    `;

    const res = await fetch("http://127.0.0.1:8000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });

    if (!res.ok) throw new Error("Eroare de conexiune GraphQL");
    const json = await res.json();
    return json.data.allSubscriptions;
  };

  // AM MODIFICAT AICI: Am adăugat isPrefetch = false
  const syncWithServer = useCallback(async (isLoadMore = false, currentSkip = 0, isPrefetch = false) => {
    try {
      if (!isPrefetch) setIsLoading(true); // Nu arătăm loading spinner dacă tragem pe furiș
      
      const serverData = await fetchFromGraphQL(currentSkip);
      
      // Dacă este prefetch, doar punem datele în sertar și oprim funcția aici
      if (isPrefetch) {
        setPrefetchedData(serverData);
        return true;
      }

      if (serverData.length < LIMIT) {
        setHasMore(false);
        if (isLoadMore) toast.info(`S-a atins finalul! Serverul a trimis doar ${serverData.length} elemente.`);
      } else {
        setHasMore(true);
      }

      setSubscriptions(prev => {
        let newData = isLoadMore ? [...prev, ...serverData] : [...serverData];

        if (!isLoadMore) {
          const savedData = localStorage.getItem("subsync_data");
          if (savedData) {
            const localData: Subscription[] = JSON.parse(savedData);
            const missingOnServer = localData.filter(
              (localSub) => !serverData.some((serverSub: Subscription) => serverSub.id === localSub.id)
            );
            if (missingOnServer.length > 0) {
              newData = [...newData, ...missingOnServer];
            }
          }
        }
        
        // Eliminăm duplicatele
        const uniqueData = Array.from(new Map(newData.map(item => [item.id, item])).values());
        
        if (isLoadMore) {
           const addedCount = uniqueData.length - prev.length;
           if (addedCount > 0) {
               // Opțional: Poți scoate toast-ul de succes dacă e prea zgomotos vizual
               // toast.success(`Succes: Am adăugat ${addedCount} abonamente noi la listă!`);
           }
        }

        return uniqueData as Subscription[];
      });

      setIsOnline(true);
      return true;
    } catch (error) {
      if (!isPrefetch) toast.error("Eroare la contactarea serverului!");
      setIsOnline(false);
      return false;
    } finally {
      if (!isPrefetch) setIsLoading(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore && isOnline) {
      const nextSkip = skip + LIMIT;
      //daca avem deja date prefetchuite, le folosim si pregatim urmatorul prefetch
      if (prefetchedData.length > 0) {
        setSubscriptions(prev => {
          const newData = [...prev, ...prefetchedData];
          const uniqueData = Array.from(new Map(newData.map(item => [item.id, item])).values());
          return uniqueData as Subscription[];
        });
        setSkip(nextSkip);
        setPrefetchedData([]); 

        // Declanșăm prefetching pentru URMĂTOAREA pagină în background
        syncWithServer(false, nextSkip + LIMIT, true); 
      } else {
        // Fallback normal dacă prefetch-ul nu a apucat să se termine (sau a eșuat)
        setSkip(nextSkip);
        syncWithServer(true, nextSkip, false);
      }
    }
  }, [skip, isLoading, hasMore, isOnline, prefetchedData, syncWithServer]);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimer: NodeJS.Timeout;

    const connectAndSync = async () => {
      setSkip(0);
      
      // 1. Aducem prima pagină (vizibilă)
      const serverIsUp = await syncWithServer(false, 0);

      if (!serverIsUp) {
        reconnectTimer = setTimeout(connectAndSync, 5000);
        return;
      }

      // 2. Imediat ce a venit prima pagină, aducem pagina 2 în fundal (Prefetching inițial)
      syncWithServer(false, LIMIT, true);

      ws = new WebSocket("ws://127.0.0.1:8000/ws");

      ws.onopen = () => setIsOnline(true);

      ws.onmessage = (event) => {
        const noulAbonament = JSON.parse(event.data);
        if (!noulAbonament.payments) noulAbonament.payments = [];
        setSubscriptions((prev) => {
          if (prev.some(s => s.id === noulAbonament.id)) return prev;
          return [noulAbonament, ...prev]; 
        });
      };

      ws.onclose = () => {
        setIsOnline(false);
        reconnectTimer = setTimeout(connectAndSync, 5000);
      };
      
      ws.onerror = () => { if (ws?.readyState === WebSocket.OPEN) ws.close(); };
    };

    connectAndSync();

    return () => {
      clearTimeout(reconnectTimer);
      if (ws) ws.close();
    };
  }, [syncWithServer]);

  
  const addSubscription = useCallback((sub: Omit<Subscription, "id">) => {
    const newSub = { ...sub, id: String(Date.now()), payments: [] };
    setSubscriptions(prev => [newSub, ...prev]);
    if (!isOnline) toast.info("Salvat local. Se va sincroniza automat.");
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
    <SubscriptionContext.Provider value={{ 
      subscriptions, isOnline, addSubscription, updateSubscription, deleteSubscription, 
      getSubscription, sortColumn, setSortColumn, hasMore, loadMore, isLoading 
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export const useSubscriptions = () => {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error("useSubscriptions must be used within SubscriptionProvider");
  return ctx;
};
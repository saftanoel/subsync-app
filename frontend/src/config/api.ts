// Verificăm dacă aplicația a fost construită pentru producție
const isProduction = import.meta.env.PROD;

// 1. Link-urile pentru CLOUD (Pentru biletul de intrare la examen)
const CLOUD_API = "https://subsync-app.onrender.com";
const CLOUD_WS = "wss://subsync-app.onrender.com";

// 2. Link-urile pentru LOCAL / LAN (Pentru Laborator / Hacking)

const LOCAL_API = "https://192.168.1.151:8000";
const LOCAL_WS = "wss://192.168.1.151:8000";

// Exportăm dinamic în funcție de mediul în care ne aflăm
export const API_BASE = isProduction ? CLOUD_API : LOCAL_API;
export const WS_BASE = isProduction ? CLOUD_WS : LOCAL_WS;

const isLocalhost = 
  window.location.hostname === "localhost" || 
  window.location.hostname === "127.0.0.1" || 
  window.location.hostname.startsWith("192.168.");

const isProduction = import.meta.env.PROD || !isLocalhost;

const CLOUD_API = import.meta.env.VITE_API_URL || "https://subsync-app.onrender.com";
const LOCAL_API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const API_BASE = isProduction ? CLOUD_API : LOCAL_API;

export const WS_BASE = import.meta.env.VITE_WS_URL || (
  API_BASE.startsWith("https") 
    ? API_BASE.replace("https://", "wss://") 
    : API_BASE.replace("http://", "ws://")
);

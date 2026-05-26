/**
 * api.ts — Central API base URL configuration.
 *
 * For local development:
 *   API_BASE  = "http://127.0.0.1:8000"
 *   WS_BASE   = "ws://127.0.0.1:8000"
 *
 * For Vercel / ngrok deployment, update the two constants below.
 */

export const API_BASE = "https://192.168.1.151:8000";
export const WS_BASE  = "wss://192.168.1.151:8000";

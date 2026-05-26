import { API_BASE } from "@/config/api";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("subsync_token");
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const fullUrl = url.startsWith("http") ? url : `${API_BASE}${url}`;
  
  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Triggers global logout in AuthContext
    window.dispatchEvent(new Event("unauthorized"));
  }

  return response;
}

export function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

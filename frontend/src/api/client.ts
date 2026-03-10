// src/api/client.ts
// Axios instance with:
//   • Auto-attach JWT from persisted store on every request
//   • 401 → attempt silent refresh → retry original request
//   • On refresh fail → logout cleanly (no sign-in loop)

import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: attach current token ────────────────────────────────
client.interceptors.request.use(
  (config) => {
    // Read directly from persisted store (works even before React mounts)
    const token =
      useAuthStore.getState().token ??
      (() => {
        try {
          const raw = localStorage.getItem("cropchain-auth");
          return raw ? JSON.parse(raw)?.state?.token : null;
        } catch {
          return null;
        }
      })();

    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: silent token refresh on 401 ───────────────────────
let isRefreshing = false;
let failedQueue: { resolve: (v: any) => void; reject: (e: any) => void }[] = [];

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
}

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Only attempt refresh on 401, and only once per request
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    const { refreshToken, logout, updateToken } = useAuthStore.getState();

    // No refresh token → logout immediately, no redirect loop
    if (!refreshToken) {
      logout();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue concurrent requests until refresh completes
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return client(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
        refresh_token: refreshToken,
      });
      const newToken: string = data.access_token;
      updateToken(newToken);
      processQueue(null, newToken);
      original.headers.Authorization = `Bearer ${newToken}`;
      return client(original);
    } catch (refreshError) {
      processQueue(refreshError, null);
      logout(); // Clear store — user sees login page naturally
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default client;
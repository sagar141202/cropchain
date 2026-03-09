import { apiClient } from "./client";

export const authAPI = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    role: string;
    language?: string;
    phone?: string;
    state?: string;
  }) => {
    const res = await apiClient.post("/auth/register", data);
    return res.data;
  },

  login: async (email: string, password: string) => {
    const res = await apiClient.post("/auth/login", { email, password });
    return res.data;
  },

  refresh: async (refreshToken: string) => {
    const res = await apiClient.post("/auth/refresh", { refresh_token: refreshToken });
    return res.data;
  },
};

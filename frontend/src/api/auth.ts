import client from "./client";

export const authAPI = {
  login: (email: string, password: string) =>
    client.post("/auth/login", { email, password }).then(r => r.data),

  register: (data: {
    name: string;
    email: string;
    password: string;
    role: string;
    phone?: string;
    state?: string;
    language?: string;
  }) => client.post("/auth/register", data).then(r => r.data),

  refresh: (refresh_token: string) =>
    client.post("/auth/refresh", { refresh_token }).then(r => r.data),
};

import { api } from "./config/axios";
import { AuthResponse, LoginRequest, RegisterRequest } from "@/types/auth";

export const authApi = {
  login: (data: LoginRequest) => api.post<AuthResponse>("/auth/login", data),

  register: (data: RegisterRequest) => api.post("/auth/register", data),

  logout: () => api.post("/auth/logout"),

  refresh: () => api.post<{ access_token: string }>("/auth/refresh"),
};

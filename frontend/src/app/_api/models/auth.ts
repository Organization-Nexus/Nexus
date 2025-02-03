import {
  AuthResponse,
  LoginRequest,
  PasswordResetRequest,
  RegisterRequest,
  ResetPasswordRequest,
  VerifyCodeRequest,
} from "@/types/auth";
import api from "../axios";

export const authApi = {
  login: (data: LoginRequest) => api.post<AuthResponse>("/auth/login", data),

  register: (data: RegisterRequest) => api.post("/auth/register", data),

  logout: () => api.post("/auth/logout"),

  refresh: () => api.post<{ access_token: string }>("/auth/refresh"),

  sendResetCode: (data: PasswordResetRequest) =>
    api.post("/auth/password-reset/send-code", data),

  verifyResetCode: (data: VerifyCodeRequest) =>
    api.post("/auth/password-reset/verify-code", data),

  resetPassword: (data: ResetPasswordRequest) =>
    api.post("/auth/password-reset", data),
};

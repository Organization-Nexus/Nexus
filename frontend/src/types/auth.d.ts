export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  githubUrl?: string;
  mainPosition: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export interface ApiResponse {
  data?: any;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

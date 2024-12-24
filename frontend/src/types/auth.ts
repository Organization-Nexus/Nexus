export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  githubUrl?: string;
  mainPosition: string;
}

export interface ApiResponse {
  data?: any;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

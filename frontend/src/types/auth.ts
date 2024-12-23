export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  githubUrl?: string;
  mainPosition: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

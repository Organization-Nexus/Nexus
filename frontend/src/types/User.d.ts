export interface User {
  id: number;
  email: string;
  name: string;
  phoneNumber: string;
  mainPosition: string;
  githubUrl: string | null;
  role: string;
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  githubUrl?: string;
  mainPosition?: string;
}

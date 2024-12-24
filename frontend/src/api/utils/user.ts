import api from "../axios";
import {
  RegisterForm,
  ApiResponse,
  LoginForm,
  AuthResponse,
} from "@/types/auth";

export const userAPI = {
  // 회원가입
  register: async (userData: RegisterForm): Promise<ApiResponse> => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error: any) {
      console.error("회원가입 에러:", error.response?.data); // 에러 상세 확인을 위해 로그 추가
      throw new Error(error.response?.data || "회원가입에 실패했습니다.");
    }
  },

  // 로그인
  login: async (loginData: LoginForm): Promise<AuthResponse> => {
    try {
      const response = await api.post("/auth/login", loginData);
      localStorage.setItem("accessToken", response.data.access_token);
      localStorage.setItem("refreshToken", response.data.refresh_token);
      return response.data;
    } catch (error: any) {
      console.error("로그인 에러:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "로그인에 실패했습니다."
      );
    }
  },

  // 로그아웃
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("로그아웃 에러:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  },

  // 본인 프로필 조회
  myProfile: async () => {
    try {
      const response = await api.get("/user");
      return response.data;
    } catch (error) {
      console.error("본인 프로필 조회 에러:", error);
      throw error;
    }
  },
};

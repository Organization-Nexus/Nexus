import api from "../axios";
import { RegisterForm, ApiResponse } from "@/types/auth";

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
};

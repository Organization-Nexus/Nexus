// components/LogoutButton.tsx
"use client";
import { userAPI } from "@/api/utils/user";
import { useRouter } from "next/navigation";
export const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await userAPI.logout();
      // 로그아웃 후 로그인 페이지로 리다이렉트
      router.push("/login");
    } catch (error: any) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      로그아웃
    </button>
  );
};

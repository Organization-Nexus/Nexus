"use client";
import Cookies from "js-cookie";
import { authApi } from "@/api/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import LogoutModal from "../user/LogoutModal";
export const LogoutButton = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      // 쿠키에서 토큰 제거
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");

      // 로그아웃 후 로그인 페이지로 리다이렉트
      router.push("/login");
    } catch (error: any) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <>
        <Button onClick={() => setIsOpen(true)}>로그아웃</Button>
        <LogoutModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </>
    </>
  );
};

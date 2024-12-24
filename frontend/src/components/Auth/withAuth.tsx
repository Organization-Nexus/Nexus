"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function withAuth(WrappedComponent: React.ComponentType) {
  return function WithAuthComponent(props: any) {
    const router = useRouter();

    useEffect(() => {
      // 로컬 스토리지에서 토큰 확인
      const token = localStorage.getItem("accessToken");

      if (!token) {
        // 토큰이 없으면 로그인 페이지로 리다이렉트
        router.push("/login");
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
}

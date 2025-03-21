"use client";

import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import TopNavBar from "./navbar/TopNavBar";
import { useUserInfo } from "@/query/queries/user";

export default function NavigationWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const hideNavBarPaths = ["/login", "/register", "/forgot-password"];

  const { data: user, isLoading } = useUserInfo({
    enabled: !hideNavBarPaths.includes(pathname),
  });

  // 인증이 필요한 페이지에서 유저 정보가 없는 경우
  if (!hideNavBarPaths.includes(pathname) && !isLoading && !user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="relative">
      {!hideNavBarPaths.includes(pathname) && user && <TopNavBar user={user} />}
      <main>{children}</main>
    </div>
  );
}

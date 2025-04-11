"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import NavigationWrapper from "./NavigationWrapper";
import { ChatProvider } from "@/provider/socketProvider";
import ChatSidebar from "@/components/chat/ChatSidebar";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideNavBarPaths = ["/login", "/register", "/forgot-password"];
  const isAuthPage = hideNavBarPaths.includes(pathname);

  return (
    <>
      {isAuthPage ? (
        // 인증 페이지에서는 ChatProvider와 ChatSidebar를 렌더링하지 않음
        <NavigationWrapper>{children}</NavigationWrapper>
      ) : (
        // 인증된 페이지에서만 ChatProvider와 ChatSidebar 렌더링
        <ChatProvider>
          <NavigationWrapper>{children}</NavigationWrapper>
          <ChatSidebar />
        </ChatProvider>
      )}
    </>
  );
}

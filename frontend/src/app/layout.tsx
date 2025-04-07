import { ReactNode } from "react";
import "../styles/globals.css";
import QueryProvider from "@/provider/queryClient";
import NavigationWrapper from "@/components/NavigationWrapper";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko-KR">
      <head />
      <body className="bg-gray-100 hide-scrollbar">
        <QueryProvider>
          {/* <SocketProvider> */}
          <NavigationWrapper>{children}</NavigationWrapper>
          {/* </SocketProvider> */}
        </QueryProvider>
      </body>
    </html>
  );
}

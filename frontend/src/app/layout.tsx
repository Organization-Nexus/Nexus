import { ReactNode } from "react";
import "../styles/globals.css";
import NavigationWrapper from "@/components/NavigationWrapper";
import QueryProvider from "@/provider/queryClient";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko-KR">
      <head />
      <body className="bg-[#EDF2FB] hide-scrollbar">
        <QueryProvider>
          <NavigationWrapper>{children}</NavigationWrapper>
        </QueryProvider>
      </body>
    </html>
  );
}

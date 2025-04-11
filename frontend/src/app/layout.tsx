import { ReactNode } from "react";
import "../styles/globals.css";
import QueryProvider from "@/provider/queryClient";
import ClientLayout from "@/components/ClientLayout";
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko-KR">
      <head />
      <body className="bg-gray-100 hide-scrollbar">
        <QueryProvider>
          <ClientLayout>{children}</ClientLayout>
        </QueryProvider>
      </body>
    </html>
  );
}

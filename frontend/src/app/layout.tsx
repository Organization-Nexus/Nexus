import { ReactNode } from "react";
import "../styles/globals.css";
import QueryProvider from "@/provider/queryClient";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="ko-KR">
      <head />
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
};

export default Layout;

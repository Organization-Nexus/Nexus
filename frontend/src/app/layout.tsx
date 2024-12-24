import { ReactNode } from "react";
import "../styles/globals.css";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="ko">
      <head />
      <body>{children}</body>
    </html>
  );
};

export default Layout;

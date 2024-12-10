import { ReactNode } from "react";
import "../styles/globals.css";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className="bg-[#E2EAFC]">{children}</body>
    </html>
  );
}

import LeftNavBar from "@/components/navbar/LeftNavBar";
import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export default function ProjectLayout({ children }: LayoutProps) {
  return (
    <div className="flex">
      {/* Left Navigation Bar */}
      <div className="w-64 fixed top-4 left-4 bottom-4 border border-gray-300 shadow-lg rounded-xl">
        <LeftNavBar />
      </div>

      {/* Main Content Area */}
      <div className="ml-72 p-4 min-h-screen w-full">{children}</div>
    </div>
  );
}

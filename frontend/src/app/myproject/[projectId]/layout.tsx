import LeftNavBar from "@/components/navbar/LeftNavBar";
import { ProjectIdProps } from "@/types/project";
import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export default function ProjectLayout({
  children,
  params,
}: LayoutProps & ProjectIdProps) {
  return (
    <div className="flex">
      {/* Left Navigation Bar */}
      <div className="w-64 fixed top-4 left-4 bottom-4 border border-gray-300 shadow-lg rounded-xl">
        <LeftNavBar projectId={params.projectId} />
      </div>

      {/* Main Content Area */}
      <div className="ml-72 min-h-screen w-full">{children}</div>
    </div>
  );
}

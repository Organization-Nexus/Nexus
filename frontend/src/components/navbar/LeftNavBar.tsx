"use client";

import { usePathname, useRouter } from "next/navigation";
import { LeftNavBarProps } from "@/types/navbar";
import NavBarBtn from "./NavBarBtn";
import {
  ClipboardList,
  House,
  LayoutDashboard,
  MessageSquareText,
  Milestone,
} from "lucide-react";
import { PiUsersThreeBold } from "react-icons/pi";
import { useProjectUserInfo } from "@/query/queries/project-user";
import { Lock } from "lucide-react";

export default function LeftNavBar({ projectId }: LeftNavBarProps) {
  const { data: me } = useProjectUserInfo(projectId);
  const router = useRouter();
  const pathname = usePathname();
  const isActive = (path: string) => pathname.startsWith(path);
  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div className="bg-white text-gray-800 flex flex-col h-full rounded-xl">
      {/* Header */}
      <div className="p-4 text-xl font-semibold">Nexus</div>

      {/* Navigation Links */}
      <nav className="flex-1 mx-auto w-[90%]">
        <hr className="my-4" />
        <ul>
          {/* Project Home */}
          <NavBarBtn
            onClick={() => navigateTo(`/myproject`)}
            icon={<House className="mr-3 w-[1.125rem] h-[1.125rem]" />}
            label="내 프로젝트"
            padding="p-4"
          />

          {/* Dashboard */}
          <NavBarBtn
            onClick={() => navigateTo(`/myproject/${projectId}/dashboard`)}
            icon={
              <LayoutDashboard className="mr-3 w-[1.125rem] h-[1.125rem]" />
            }
            label="대시보드"
            padding="p-4"
            isActive={isActive(`/myproject/${projectId}/dashboard`)}
          />

          <hr className="my-4" />

          {/* Community */}
          <NavBarBtn
            onClick={() => navigateTo(`/myproject/${projectId}/community`)}
            icon={
              <PiUsersThreeBold className="mr-3 w-[1.125rem] h-[1.125rem]" />
            }
            label="커뮤니티"
            padding="p-4"
            isActive={isActive(`/myproject/${projectId}/community`)}
          />

          {/* Milestones */}
          <NavBarBtn
            onClick={() => navigateTo(`/myproject/${projectId}/milestones`)}
            icon={<Milestone className="mr-3 w-[1.125rem] h-[1.125rem]" />}
            label="마일스톤 • 이슈"
            padding="p-4"
            isActive={isActive(`/myproject/${projectId}/milestones`)}
          />

          {/* Minutes */}
          <NavBarBtn
            onClick={() => navigateTo(`/myproject/${projectId}/minutes`)}
            icon={<ClipboardList className="mr-3 w-[1.125rem] h-[1.125rem]" />}
            label="회의록"
            padding="p-4"
            isActive={isActive(`/myproject/${projectId}/minutes`)}
          />
          <hr className="my-4" />

          {/* myPostedList */}
          <NavBarBtn
            onClick={() => navigateTo(`/myproject/${projectId}/myPostedList`)}
            icon={
              <MessageSquareText className="mr-3 w-[1.125rem] h-[1.125rem]" />
            }
            label="내가 쓴 글"
            padding="p-4"
            isActive={isActive(`/myproject/${projectId}/myPostedList`)}
          />
          {me?.is_sub_admin && (
            <>
              <hr className="my-4" />
              <NavBarBtn
                onClick={() => navigateTo(`/myproject/${projectId}/admin`)}
                icon={<Lock className="mr-3 w-[1.125rem] h-[1.125rem]" />}
                label="관리자 페이지"
                padding="p-4"
                isActive={isActive(`/myproject/${projectId}/admin`)}
              />
            </>
          )}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 text-xs text-center">
        © 2025 Nexus Inc. [v1.0.0] by SUJONG, BOKYUNG developers
      </div>
    </div>
  );
}

"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { LeftNavBarProps } from "@/types/navbar";
import NavBarBtn from "./NavBarBtn";
import {
  ClipboardList,
  House,
  LayoutDashboard,
  MessageSquareText,
  Milestone,
  Lock,
  Presentation,
  UserRoundCog,
} from "lucide-react";
import { PiUsersThreeBold } from "react-icons/pi";
import { useProjectUserInfo } from "@/query/queries/project-user";

export default function LeftNavBar({ projectId }: LeftNavBarProps) {
  const { data: me } = useProjectUserInfo(projectId);
  const router = useRouter();
  const pathname = usePathname();
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  const isActive = (path: string) => pathname.startsWith(path);
  const navigateTo = (path: string) => {
    router.push(path);
  };

  // 관리자 메뉴 경로에 있을 때 자동으로 열리도록 설정
  useEffect(() => {
    if (pathname.includes(`/myproject/${projectId}/admin`)) {
      setIsAdminMenuOpen(true);
    }
  }, [pathname, projectId]);

  return (
    <div className="bg-white text-gray-800 flex flex-col h-full rounded-xl">
      <div className="p-4 text-xl font-semibold">Nexus</div>

      <nav className="flex-1 mx-auto w-[90%]">
        <hr className="my-4" />
        <ul>
          <NavBarBtn
            onClick={() => navigateTo(`/myproject`)}
            icon={<House className="mr-3 w-[1.125rem] h-[1.125rem]" />}
            label="내 프로젝트"
            padding="p-4"
          />

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

          <NavBarBtn
            onClick={() => navigateTo(`/myproject/${projectId}/community`)}
            icon={
              <PiUsersThreeBold className="mr-3 w-[1.125rem] h-[1.125rem]" />
            }
            label="커뮤니티"
            padding="p-4"
            isActive={isActive(`/myproject/${projectId}/community`)}
          />

          <NavBarBtn
            onClick={() => navigateTo(`/myproject/${projectId}/milestones`)}
            icon={<Milestone className="mr-3 w-[1.125rem] h-[1.125rem]" />}
            label="마일스톤 • 이슈"
            padding="p-4"
            isActive={isActive(`/myproject/${projectId}/milestones`)}
          />

          <NavBarBtn
            onClick={() => navigateTo(`/myproject/${projectId}/minutes`)}
            icon={<ClipboardList className="mr-3 w-[1.125rem] h-[1.125rem]" />}
            label="회의록"
            padding="p-4"
            isActive={isActive(`/myproject/${projectId}/minutes`)}
          />

          <hr className="my-4" />

          <NavBarBtn
            onClick={() => navigateTo(`/myproject/${projectId}/myPostedList`)}
            icon={
              <MessageSquareText className="mr-3 w-[1.125rem] h-[1.125rem]" />
            }
            label="내가 쓴 글"
            padding="p-4"
            isActive={isActive(`/myproject/${projectId}/myPostedList`)}
          />

          {/* 관리자 메뉴 */}
          {me?.is_sub_admin && (
            <>
              <hr className="my-4" />
              <button
                onClick={() => setIsAdminMenuOpen((prev) => !prev)}
                className={`flex items-center w-full p-4 text-left rounded transition-colors hover:bg-gray-100 mb-2
                `}
              >
                <Lock className="mr-3 w-[1.125rem] h-[1.125rem]" />
                관리자 페이지
              </button>
              <div
                className={`space-y-2 ml-4 overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                  isAdminMenuOpen ? "max-h-32" : "max-h-0"
                }`}
              >
                <button
                  className={`text-left text-sm px-2 py-1 rounded hover:bg-gray-100 w-full flex items-center ${
                    isActive(`/myproject/${projectId}/admin/project`)
                      ? "bg-gray-100 font-semibold"
                      : ""
                  }`}
                  onClick={() =>
                    navigateTo(`/myproject/${projectId}/admin/project`)
                  }
                >
                  - <Presentation className="mx-2 w-4 h-4" /> 프로젝트 관리
                </button>
                <button
                  className={`text-left text-sm px-2 py-1 rounded hover:bg-gray-100 w-full flex items-center ${
                    isActive(`/myproject/${projectId}/admin/members`)
                      ? "bg-gray-100 font-semibold"
                      : ""
                  }`}
                  onClick={() =>
                    navigateTo(`/myproject/${projectId}/admin/members`)
                  }
                >
                  - <UserRoundCog className="mx-2 w-4 h-4" /> 멤버 관리
                </button>
              </div>
            </>
          )}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200 text-xs text-center">
        © 2025 Nexus Inc. [v1.0.0] by SUJONG, BOKYUNG developers
      </div>
    </div>
  );
}

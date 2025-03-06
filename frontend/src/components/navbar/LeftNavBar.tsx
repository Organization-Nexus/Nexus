"use client";

import { usePathname, useRouter } from "next/navigation";
import { LeftNavBarProps } from "@/types/navbar";
import NavBarBtn from "./NavBarBtn";
import {
  Bookmark,
  CalendarDays,
  ClipboardList,
  House,
  LayoutDashboard,
  MessageSquareText,
  Milestone,
} from "lucide-react";
import { PiUsersThreeBold } from "react-icons/pi";
export default function LeftNavBar({ projectId }: LeftNavBarProps) {
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

          {/* Issues */}
          {/* <NavBarBtn
            onClick={() => navigateTo(`/myproject/${projectId}/issues`)}
            icon={<Waypoints className="mr-3 w-[1.125rem] h-[1.125rem]" />}
            label="이슈"
            padding="p-4"
            isActive={isActive(`/myproject/${projectId}/issues`)}
          /> */}

          {/* Minutes */}
          <NavBarBtn
            onClick={() => navigateTo(`/myproject/${projectId}/minutes`)}
            icon={<ClipboardList className="mr-3 w-[1.125rem] h-[1.125rem]" />}
            label="회의록"
            padding="p-4"
            isActive={isActive(`/myproject/${projectId}/minutes`)}
          />

          {/* Calendar */}
          <NavBarBtn
            onClick={() => navigateTo(`/myproject/${projectId}/calendar`)}
            icon={<CalendarDays className="mr-3 w-[1.125rem] h-[1.125rem]" />}
            label="달력"
            padding="p-4"
            isActive={isActive(`/myproject/${projectId}/calendar`)}
          />

          <hr className="my-4" />

          {/* My Posts/Comments */}
          <NavBarBtn
            onClick={() =>
              navigateTo(`/myproject/${projectId}/my-posts-comments`)
            }
            icon={
              <MessageSquareText className="mr-3 w-[1.125rem] h-[1.125rem]" />
            }
            label="내가 쓴 글/댓글"
            padding="p-4"
            isActive={isActive(`/myproject/${projectId}/my-posts-comments`)}
          />

          {/* Bookmarks */}
          <NavBarBtn
            onClick={() => navigateTo(`/myproject/${projectId}/bookmarks`)}
            icon={<Bookmark className="mr-3 w-[1.125rem] h-[1.125rem]" />}
            label="나의 북마크"
            padding="p-4"
            isActive={isActive(`/myproject/${projectId}/bookmarks`)}
          />
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 text-xs text-center">
        © 2025 Nexus Inc. [v1.0.0] by SUJONG, BOKYUNG developers
      </div>
    </div>
  );
}

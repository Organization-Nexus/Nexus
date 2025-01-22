"use client";

import {
  FaHome,
  FaTasks,
  FaUsers,
  FaCalendarAlt,
  FaCommentDots,
  FaClipboardList,
  FaBookmark,
  FaCodeBranch,
} from "react-icons/fa";
import { LogoutButton } from "../button/LogoutButton";
import { usePathname, useRouter } from "next/navigation";
import { LeftNavBarProps } from "@/types/navbar";
import NavBarBtn from "./NavBarBtn";

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
            icon={<FaHome className="mr-3" />}
            label="내 프로젝트"
            padding="p-4"
          />

          {/* Dashboard */}
          <NavBarBtn
            onClick={() => navigateTo(`/myproject/${projectId}/dashboard`)}
            icon={<FaTasks className="mr-3" />}
            label="대시보드"
            padding="p-4"
            isActive={isActive(`/myproject/${projectId}/dashboard`)}
          />

          <hr className="my-4" />

          {/* Community */}
          <NavBarBtn
            onClick={() => navigateTo(`/myproject/${projectId}/community`)}
            icon={<FaUsers className="mr-3" />}
            label="커뮤니티"
            padding="p-4"
            isActive={isActive(`/myproject/${projectId}/community`)}
          />

          {/* Calendar */}
          <NavBarBtn
            onClick={() => navigateTo(`/myproject/${projectId}/calendar`)}
            icon={<FaCalendarAlt className="mr-3" />}
            label="달력"
            padding="p-4"
            isActive={isActive(`/myproject/${projectId}/calendar`)}
          />

          {/* Milestones */}
          <NavBarBtn
            onClick={() => navigateTo(`/myproject/${projectId}/milestones`)}
            icon={<FaClipboardList className="mr-3" />}
            label="마일스톤"
            padding="p-4"
            isActive={isActive(`/myproject/${projectId}/milestones`)}
          />

          {/* Issues */}
          <NavBarBtn
            onClick={() => navigateTo(`/myproject/${projectId}/issues`)}
            icon={<FaCodeBranch className="mr-3" />}
            label="이슈"
            padding="p-4"
            isActive={isActive(`/myproject/${projectId}/issues`)}
          />

          <hr className="my-4" />

          {/* My Posts/Comments */}
          <NavBarBtn
            onClick={() =>
              navigateTo(`/myproject/${projectId}/my-posts-comments`)
            }
            icon={<FaCommentDots className="mr-3" />}
            label="내가 쓴 글/댓글"
            padding="p-4"
            isActive={isActive(`/myproject/${projectId}/my-posts-comments`)}
          />

          {/* Bookmarks */}
          <NavBarBtn
            onClick={() => navigateTo(`/myproject/${projectId}/bookmarks`)}
            icon={<FaBookmark className="mr-3" />}
            label="나의 북마크"
            padding="p-4"
            isActive={isActive(`/myproject/${projectId}/bookmarks`)}
          />

          {/* Logout */}
          <li className="mt-1">
            <div className="flex items-center p-4 hover:bg-secondary hover:text-white transition-colors">
              <LogoutButton />
            </div>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 text-xs text-center">
        © 2025 Nexus Inc. [v1.0.0] by SUJONG, BOKYUNG developers
      </div>
    </div>
  );
}

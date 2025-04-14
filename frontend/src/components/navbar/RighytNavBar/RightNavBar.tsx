"use client";

import Image from "next/image";
import { useUserInfo } from "@/query/queries/user";
import { useState, useEffect } from "react";
import { useProjectDetail, useProjectList } from "@/query/queries/project";
import MyProfile from "@/components/modal/MyProfile";
import MyPageModal from "@/components/modal/Mypage";
import ProjectMilestones from "./ProjectMilestones";

interface RightNavBarProps {
  projectId?: string;
}

export default function RightNavBar({ projectId }: RightNavBarProps) {
  const { data: user, isLoading } = useUserInfo();
  const { data: project } = useProjectDetail(projectId ?? "", !!projectId);
  const { data: projects } = useProjectList([], !projectId);
  const [isMyProfileOpen, setIsMyProfileOpen] = useState(false);
  const [isMyPageOpen, setIsMyPageOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const projectData = projectId && project ? [project] : projects || [];

  if (!isMounted) return null;
  if (isLoading) return <div className="p-6 text-gray-500">로딩중...</div>;
  if (!user)
    return (
      <div className="p-6 text-red-500">사용자 정보를 불러올 수 없습니다.</div>
    );

  return (
    <div className="w-[400px] bg-white px-6 py-3 rounded-2xl shadow-xl overflow-y-auto">
      {/* 유저 정보 */}
      <div className="p-4 bg-white rounded-lg">
        <div className="flex mb-4">
          <div className="flex gap-4 w-full items-center">
            <div className="w-12 h-12 rounded-2xl">
              <Image
                src={user.log.profileImage}
                alt="Profile"
                width={48}
                height={48}
                className="object-cover rounded-2xl"
                priority
                onClick={() => setIsMyProfileOpen(true)}
              />
            </div>
            <div className="w-full">
              <h1 className="text-lg font-semibold">{user.name}</h1>
              <div className="flex justify-between">
                <p className="text-md text-custom-smallText font-semibold">
                  {user.mainPosition}
                </p>
                <p className="text-sm text-custom-smallText">
                  {new Date().toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    weekday: "short",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-2" />

        {/* 프로젝트 정보 */}
        <div>
          <ProjectMilestones projects={projectData} />
        </div>
      </div>

      <MyProfile
        isOpen={isMyProfileOpen}
        onClose={() => setIsMyProfileOpen(false)}
        user={user}
        onEditClick={() => setIsMyPageOpen(true)}
      />
      <MyPageModal
        isOpen={isMyPageOpen}
        onClose={() => setIsMyPageOpen(false)}
        user={user}
      />
    </div>
  );
}

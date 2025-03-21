"use client";

import { useUserInfo } from "@/query/queries/user";
import { useEffect, useState } from "react";
import Image from "next/image";
import MyProfile from "../modal/MyProfile";
import MyPageModal from "../modal/Mypage";
import { TaskItemProps } from "@/types/milestone";

const contents = ["일정 목록1", "일정 목록2", "일정 목록3"];

export default function TodayTasksSidebar() {
  const { data: user, isLoading } = useUserInfo();
  const [isMyProfileOpen, setIsMyProfileOpen] = useState(false);
  const [isMyPageOpen, setIsMyPageOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (isLoading) {
    return <div>로딩중...</div>;
  }

  if (!user) {
    return <div>사용자 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="w-[400px] bg-white px-6 py-3 rounded-2xl shadow-xl h-[400px] overflow-y-auto">
      <div className="p-4 bg-white rounded-lg">
        <div className="flex mb-4">
          <div className="flex gap-4 w-full h-full items-center">
            <div className="w-12 h-12 rounded-2xl">
              <div className="relative w-[48px] h-[48px] rounded-2xl">
                <Image
                  src={user.log.profileImage as string}
                  alt="Profile Image"
                  width={48}
                  height={48}
                  className="object-cover rounded-2xl max-w-[48px] max-h-[48px] min-w-[48px] min-h-[48px]"
                  priority
                  onClick={() => setIsMyProfileOpen(true)}
                />
              </div>
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
        <div className="space-y-2">
          {contents.map((content, index) => (
            <h1 key={index}>{content}</h1>
          ))}
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

function TaskList() {
  return (
    <div className="space-y-3">
      <TaskItem
        user="김보경"
        date="2024.11.08 (목)"
        task="[일정] 플로우 기능 영상 시청하기"
      />
    </div>
  );
}

function TaskItem({ user, date, task }: TaskItemProps) {
  return (
    <div className="text-sm">
      <div className="flex items-center justify-between">
        <span>{user}</span>
        <span className="text-gray-500">{date}</span>
      </div>
      <p className="mt-1 text-gray-600">{task}</p>
    </div>
  );
}

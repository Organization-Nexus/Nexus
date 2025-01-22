"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/api/user";
import { NavBarUserInfo, RightNavBarProps } from "@/types/navbar";

export default function RightNavBar({ contents }: RightNavBarProps) {
  const { data: user, isLoading } = useQuery<NavBarUserInfo>({
    queryKey: ["user"],
    queryFn: userApi.getUser,
  });

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (!user) {
    return <div>사용자 정보를 불러올 수 없습니다.</div>;
  }
  return (
    <div className="p-4 bg-white rounded-lg">
      <div className="flex mb-4">
        <div className="flex gap-4 w-full h-full items-center">
          <div className="w-12 h-12 rounded-2xl">
            <div className="relative w-[48px] h-[48px] rounded-2xl">
              <Image
                src={user.log.profileImage}
                alt="Profile Image"
                width={48}
                height={48}
                className="object-cover rounded-2xl"
                priority
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
  );
}

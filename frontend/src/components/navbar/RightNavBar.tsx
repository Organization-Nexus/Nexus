"use client";

import React from "react";
import Image from "next/image";

interface RightNavBarProps {
  contents: string[];
  user: {
    name: string;
    mainPosition: string;
    log: {
      profileImage: string;
    };
  };
}

const RightNavBar = ({ contents, user }: RightNavBarProps) => {
  return (
    <div className="p-4 bg-white rounded-lg">
      <div className="flex mb-4">
        <div className="flex gap-4 w-full h-full items-center">
          <div className="w-12 h-12 border-2 rounded-2xl bg-border">
            <div className="relative w-[44px] h-[44px]">
              <Image
                src={user.log.profileImage}
                alt="Profile Image"
                fill
                className="object-cover"
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
              <p className="text-sm text-custom-smallText font-semibold">
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
};

export default RightNavBar;

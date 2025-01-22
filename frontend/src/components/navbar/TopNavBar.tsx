"use client";

import { useState } from "react";
import Image from "next/image";
import { BellRing, Headphones, MessageCircleMore } from "lucide-react";
import ProfileImage from "../modal/ProfileImage";
import { TopNavBarProps } from "@/types/navbar";

export default function TopNavBar({ user }: TopNavBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-0 right-0 border-2 bg-white shadow-sm my-4 mx-4 rounded-3xl">
      <div className="px-4 h-10 flex items-center">
        <div className="flex items-center gap-4">
          <button className="rounded-full">
            <Headphones className="h-5 w-5 text-gray-500 hover:text-black" />
          </button>
          <button className=" rounded-full">
            <MessageCircleMore className="h-5 w-5 text-gray-500 hover:text-black" />
          </button>
          <button className="rounded-full">
            <BellRing className="h-5 w-5 text-gray-500 hover:text-black" />
          </button>
          <button className="rounded-full">
            <Image
              src={user.log.profileImage}
              alt="Profile"
              width={20}
              height={20}
              className="rounded-full object-cover"
              onClick={() => setIsOpen(true)}
            />
            {isOpen && (
              <ProfileImage
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                user={user}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

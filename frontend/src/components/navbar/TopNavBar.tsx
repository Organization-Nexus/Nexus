"use client";

import { BellRing, Headphones, MessageCircleMore } from "lucide-react";
import { TopNavBarProps } from "@/types/navbar";
import ProfileDropdown from "../user/ProfileDropdown";
import { useChat } from "@/provider/socketProvider";

export default function TopNavBar({ user }: TopNavBarProps) {
  const { openChat } = useChat();

  return (
    <div className="fixed top-0 right-0 border-2 bg-white shadow-sm my-4 mx-4 rounded-3xl">
      <div className="px-4 h-10 flex items-center">
        <div className="flex items-center gap-4">
          <button className="rounded-full">
            <Headphones className="h-5 w-5 text-gray-500 hover:text-black" />
          </button>
          <button className="rounded-full" onClick={openChat}>
            <MessageCircleMore className="h-5 w-5 text-gray-500 hover:text-black" />
          </button>
          <button className="rounded-full">
            <BellRing className="h-5 w-5 text-gray-500 hover:text-black" />
          </button>
          <ProfileDropdown user={user} />
        </div>
      </div>
    </div>
  );
}

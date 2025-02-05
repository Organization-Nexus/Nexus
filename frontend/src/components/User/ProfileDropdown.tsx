import { useState } from "react";
import Image from "next/image";
import { IdCard, LogOut, UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import LogoutModal from "../modal/LogoutModal";
import MyPageModal from "../modal/Mypage";
import { User } from "@/types/user";

interface ProfileDropdownProps {
  user: User;
}

export default function ProfileDropdown({ user }: ProfileDropdownProps) {
  const [isMyPageOpen, setIsMyPageOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          <Image
            src={user.log.profileImage as string}
            alt="Profile"
            width={20}
            height={20}
            className="rounded-full object-cover max-w-[20px] max-h-[20px]"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="absolute rounded-2xl px-4 py-4 top-4 -right-4 flex-col items-center justify-center w-[150px]"
          align="end"
        >
          <div className="flex items-center gap-2">
            <Image
              src={user.log.profileImage as string}
              alt="Profile Image"
              width={40}
              height={40}
              className="object-cover rounded-2xl mr-2 mb-2"
              priority
            />
            <span className="text-xl font-bold mb-2">{user.name}</span>
          </div>
          <div className="pl-2">
            <DropdownMenuItem className="cursor-pointer ">
              <UserRound className=" h-4 w-4" />내 프로필
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setIsMyPageOpen(true)}
            >
              <IdCard className=" h-4 w-4" />
              마이페이지
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setIsLogoutOpen(true)}
            >
              <LogOut className=" h-4 w-4" />
              로그아웃
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <MyPageModal
        isOpen={isMyPageOpen}
        onClose={() => setIsMyPageOpen(false)}
        user={user}
      />
      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
      />
    </>
  );
}

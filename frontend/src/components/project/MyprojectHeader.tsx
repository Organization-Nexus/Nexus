"use client";

import ModalMain from "../modal/config/ModalMain";
import { useUserInfo } from "@/query/queries/user";

export default function MyProjectHeader() {
  const { data: user, isLoading } = useUserInfo();

  if (!user) return null;
  return (
    <div className="flex justify-between items-center">
      <div className="text-2xl font-bold">
        반갑습니다! <span className="text-blue-400">"{user.name}"</span> 님 👋
      </div>
      <ModalMain label="프로젝트 생성" />
    </div>
  );
}

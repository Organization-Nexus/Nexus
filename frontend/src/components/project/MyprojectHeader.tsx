import { User } from "@/types/user";
import React from "react";

function MyprojectHeader({ user }: { user: User }) {
  return (
    <div className="text-2xl font-bold">
      반갑습니다! <span className="text-[#ABC4FF]">"{user.name}"</span> 님 👋
    </div>
  );
}

export default MyprojectHeader;

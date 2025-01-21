"use client";
import { userApi } from "@/api/user";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import React from "react";

function MyprojectHeader() {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: userApi.getUser,
  });

  if (!user) return null;
  return (
    <div className="text-2xl font-bold">
      반갑습니다! <span className="text-blue-400">"{user.name}"</span> 님 👋
    </div>
  );
}

export default MyprojectHeader;

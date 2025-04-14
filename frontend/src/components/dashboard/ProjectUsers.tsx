"use client";

import { useState } from "react";
import { ProjectUserListProps } from "@/types/project-user";
import { Plus } from "lucide-react";
import InviteUser from "../modal/InviteUser";
import {
  useProjectUserInfo,
  useProjectUsersInfo,
} from "@/query/queries/project-user";

export default function ProjectUsers({ projectId }: ProjectUserListProps) {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const { data: projectUsers } = useProjectUsersInfo(projectId);
  const { data: Me } = useProjectUserInfo(projectId);

  const openInviteModal = () => setIsInviteOpen(true);
  const closeInviteModal = () => setIsInviteOpen(false);

  return (
    <>
      <div className="flex flex-wrap items-center">
        {projectUsers?.map((projectUser) => {
          const isMe = Me?.id === projectUser.id;

          return (
            <div
              key={projectUser.id}
              className="flex flex-col items-center justify-center p-3"
            >
              {/* 유저 프로필 이미지 */}
              <div
                className={`w-14 h-14 rounded-3xl mb-1 ${
                  isMe ? "border-2 border-primary" : ""
                }`}
              >
                <img
                  src={projectUser.user?.log.profileImage}
                  alt={`${projectUser.user?.name}'s profile`}
                  className="w-full h-full object-cover rounded-3xl"
                />
              </div>
              {/* 유저 이름 */}
              <p className="font-bold text-sm text-gray-700">
                {projectUser.user?.name}
              </p>
              {/* 포지션 */}
              <p className="text-xs text-gray-400">{projectUser.position}</p>
            </div>
          );
        })}

        {/* 서브 관리자만 초대 버튼 노출 */}
        {Me?.is_sub_admin && (
          <button
            onClick={openInviteModal}
            className="flex flex-col items-center justify-center p-3 hover:text-black text-gray-600"
          >
            <div className="w-14 h-14 rounded-3xl border border-dashed border-gray-400 flex items-center justify-center mb-1 hover:border-black transition">
              <Plus className="w-4 h-4" />
            </div>
            <p className="text-sm">팀원추가</p>
            <p className="text-xs">add user</p>
          </button>
        )}
      </div>

      <InviteUser
        isOpen={isInviteOpen}
        onClose={closeInviteModal}
        projectId={projectId}
      />
    </>
  );
}

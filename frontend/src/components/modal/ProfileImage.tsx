import { useState } from "react";
import { Modal } from "./config/ModalMaps";
import { ModalRootProps } from "@/types/modal";
import { ProjectBase } from "@/types/project";
import { project_image } from "@/data/project_image";
import { projectApi } from "@/api/project";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { UserRound } from "lucide-react";

interface ProfileImageProps extends ModalRootProps {
  user: {
    name: string;
    log: {
      profileImage: string;
    };
  };
}

export default function ProfileImage({
  isOpen,
  onClose,
  user,
}: ProfileImageProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hasOverlay={false}
      className="absolute top-16 right-4 flex-col items-center justify-center w-[200px]"
    >
      <div className="flex ">
        <div className="w-12 h-12 rounded-2xl">
          <Image
            src={user.log.profileImage}
            alt="Profile Image"
            width={48}
            height={48}
            className="object-cover rounded-2xl"
            priority
          />
        </div>

        <Modal.Title>{user.name}</Modal.Title>
      </div>

      <div className="flex items-center">
        <UserRound />
        <Modal.LabelButton onClick={() => {}} label="내 프로필" className="" />
      </div>
      <div className="">
        <Modal.LabelButton onClick={() => {}} label="마이페이지" />
      </div>
      <div className="">
        <Modal.LabelButton onClick={() => {}} label="로그아웃" />
      </div>
    </Modal>
  );
}

import { Modal } from "./config/ModalMaps";
import { User } from "@/types/user";

import Image from "next/image";
import { Github, Mail, Phone, Pickaxe, X } from "lucide-react";

export interface MyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onEditClick: () => void;
}

export default function MyProfile({
  isOpen,
  onClose,
  user,
  onEditClick,
}: MyProfileModalProps) {
  const handleEditClick = () => {
    onClose();
    onEditClick(); // 마이페이지 모달 열기
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="p-0 px-0 py-0 w-[350px] overflow-hidden"
    >
      {/* 상단 배경 이미지 영역 */}
      <div className="relative bg-black h-[350px]">
        <Image
          src={user.log.profileImage as string}
          alt="Profile"
          width={350}
          height={350}
          className="rounded-2xl bg-custom-main rounded-b-none object-cover max-w-[350px] max-h-[350px] min-w-[350px] min-h-[350px]"
        />
        <X
          onClick={onClose}
          className="absolute right-4 top-4 z-10 cursor-pointer"
        />
        <div className="absolute bottom-8 left-8 text-white text-2xl font-bold">
          {user.name}
        </div>
      </div>

      {/* 하단 정보 영역 */}
      <div className="bg-white p-8 space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-600">
            <Mail className="h-5 w-5 text-gray-500 mr-2" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Phone className="h-5 w-5 text-gray-500 mr-2" />
            <span>{user.phoneNumber}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Github className="h-5 w-5 text-gray-500 mr-2" />
            <a
              href={user.githubUrl ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {user.githubUrl}
            </a>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Pickaxe className="h-5 w-5 text-gray-500 mr-2" />
            <span>{user.mainPosition}</span>
          </div>
        </div>
        <Modal.Button
          variant="secondary"
          onClick={handleEditClick}
          className="w-full py-3 text-gray-600 rounded-lg"
        >
          정보 수정
        </Modal.Button>
      </div>
    </Modal>
  );
}

import { use, useState } from "react";
import { Modal } from "./config/ModalMaps";
import { ModalRootProps } from "@/types/modal";
import { ProjectBase } from "@/types/project";
import { project_image } from "@/data/project_image";
import { projectApi } from "@/api/project";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { IdCard, LogOut, UserRound } from "lucide-react";
import { Button } from "../ui/button";
import LogoutModal from "../user/LogoutModal";

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
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const handleLogoutClick = () => {
    onClose(); // 프로필 모달을 먼저 닫고
    setTimeout(() => {
      // 약간의 지연 후 로그아웃 모달 열기
      setIsLogoutOpen(true);
    }, 100);
  };
  // 로그아웃 모달 상태 확인용 콘솔
  console.log("isLogoutOpen:", isLogoutOpen);
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        hasOverlay={false}
        className="absolute px-4 py-4 top-16 right-4 flex-col items-center justify-center w-[150px]"
      >
        <div className="grid grid-cols-3 place-items-center mb-4">
          <div className="rounded-2xl">
            <Image
              src={user.log.profileImage}
              alt="Profile Image"
              width={40}
              height={40}
              className="object-cover rounded-2xl"
              priority
            />
          </div>
          <div className="col-span-2">
            <Modal.Title className="text-xl mb-0">{user.name}</Modal.Title>
          </div>
        </div>

        <Button variant="nothing" className="h-7 hover:font-semibold">
          <UserRound />내 프로필
        </Button>
        <Button variant="nothing" className="h-7 hover:font-semibold">
          <IdCard />
          마이페이지
        </Button>
        <Button
          onClick={() => setIsLogoutOpen(true)}
          variant="nothing"
          className="h-7 hover:font-semibold"
        >
          <LogOut />
          로그아웃
        </Button>
      </Modal>
      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
      />
    </>
  );
}

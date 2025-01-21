"use client";
import Cookies from "js-cookie";
import { useState } from "react";
import { Modal } from "../modal/config/ModalMaps";
import { authApi } from "@/api/auth";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API 호출 로직
    onClose();
  };

  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      await authApi.logout();
      // 쿠키에서 토큰 제거
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");

      queryClient.invalidateQueries({ queryKey: ["user"] });
      onClose();
      // router.refresh();
      router.push("/login");
    } catch (error: any) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-[450px] rounded-xl">
      <Modal.Title className="text-base font-normal place-self-center mb-0 mt-4">
        로그아웃 하시겠습니까?
      </Modal.Title>

      <div className="grid grid-cols-2 justify-items-stretch p-4 pb-0">
        <Modal.Button
          variant="secondary"
          onClick={onClose}
          className="text-sm w-full m-1"
        >
          취소
        </Modal.Button>

        <Modal.Button
          variant="primary"
          onClick={handleLogout}
          className="text-sm w-full m-1"
        >
          확인
        </Modal.Button>
      </div>
    </Modal>
  );
}

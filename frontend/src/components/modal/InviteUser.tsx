"use client";

import { useState } from "react";
import { Modal } from "./config/ModalMaps";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useInviteProjectUser } from "@/query/mutations/project-user";
import {
  X,
  Code,
  Paintbrush,
  LayoutDashboard,
  UserCog,
  Workflow,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export enum ProjectPosition {
  FE = "FE",
  BE = "BE",
  FULL = "FULL",
  DESIGN = "DESIGN",
  PM = "PM",
}

export interface InviteProjectUserDto {
  email: string;
  position: ProjectPosition | "";
  is_sub_admin: boolean;
}

export interface InviteUserProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

const positionIcons: Record<ProjectPosition, JSX.Element> = {
  FE: <Code size={16} />,
  BE: <Workflow size={16} />,
  FULL: <LayoutDashboard size={16} />,
  DESIGN: <Paintbrush size={16} />,
  PM: <UserCog size={16} />,
};

export default function InviteUser({
  isOpen,
  onClose,
  projectId,
}: InviteUserProps) {
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState<ProjectPosition | "">("");
  const [isSubAdmin, setIsSubAdmin] = useState(false);

  const { mutate: inviteUser } = useInviteProjectUser(projectId);

  const handleInvite = () => {
    const payload: InviteProjectUserDto = {
      email,
      position,
      is_sub_admin: isSubAdmin,
    };

    inviteUser(payload, {
      onSuccess: () => {
        onClose();
        setEmail("");
        setPosition("");
        setIsSubAdmin(false);
      },
      onError: (err: any) => {
        console.error("초대 실패:", err);
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOutsideClick={false}
      className="w-1/4"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">팀원 초대</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-600 hover:text-black" />
          </button>
        </div>
        <div className="flex gap-2">
          {/* 이메일 입력 */}
          <Input
            placeholder="example@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-[3]"
          />

          {/* 포지션 선택 (Dropdown) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full flex-[1.2] justify-between"
              >
                {position ? (
                  <div className="flex items-center gap-2">
                    {positionIcons[position as ProjectPosition]} {position}
                  </div>
                ) : (
                  "포지션"
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Object.values(ProjectPosition).map((pos) => (
                <DropdownMenuItem
                  key={pos}
                  onClick={() => setPosition(pos)}
                  className="flex items-center"
                >
                  {positionIcons[pos]} {pos}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 초대 버튼 */}
        <Button onClick={handleInvite} className="w-full mt-2">
          초대하기
        </Button>
      </div>
    </Modal>
  );
}

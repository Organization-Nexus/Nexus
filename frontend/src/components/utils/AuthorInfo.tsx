import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import { Button } from "../ui/button";
import { Ellipsis, PenLine, Trash2 } from "lucide-react";

interface AuthorInfoProps {
  profileImage: string;
  name: string;
  position?: string;
  isAuthor?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  type: string;
}

export default function AuthorInfo({
  profileImage,
  name,
  position,
  isAuthor = false,
  onEdit,
  onDelete,
  type,
}: AuthorInfoProps) {
  return (
    <div className="flex items-start space-x-4">
      {/* 프로필 이미지 */}
      <Image
        src={profileImage}
        alt={name}
        width={50}
        height={50}
        className="rounded-lg"
      />

      {/* 이름 및 직책 */}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xl font-semibold">{name}</p>
            {position && <p className="text-sm text-gray-500">{position}</p>}
          </div>

          {/* 수정 및 삭제 버튼 */}
          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="nothing">
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-[70px]">
                <DropdownMenuItem onClick={onEdit}>
                  <PenLine className="mr-2" /> 수정
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={onDelete}>
                  <Trash2 className="mr-2" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}

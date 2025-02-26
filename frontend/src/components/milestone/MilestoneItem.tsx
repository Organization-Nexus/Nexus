import { Milestone } from "@/types/milestone";
import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Ellipsis, PenLine, Trash2 } from "lucide-react";
import { CustomAlertDialog } from "../common/CustomAlertDialog";

interface MilestoneItemProps {
  milestone: Milestone;
  projectId: number;
}

export default function MilestoneItem({
  milestone,
  projectId,
}: MilestoneItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  console.log("milestone", milestone);
  return (
    <div className="w-full p-5 bg-white rounded-xl shadow hover:bg-gray-50 cursor-pointer">
      <div className="flex items-center justify-between mx-2">
        <div className="flex items-center gap-3">
          <div className="relative w-[30px] h-[30px] rounded-2xl">
            <Image
              src={milestone.author.user.log?.profileImage}
              alt="Profile Image"
              width={30}
              height={30}
              className="object-cover rounded-2xl max-w-[30px] max-h-[30px] min-w-[30px] min-h-[30px]"
              priority
            />
          </div>
          <div className="flex flex-col w-[72px]">
            <span className="font-bold">{milestone.author.user.name}</span>
            <span className="font-semibold text-[10px] leading-none text-custom-smallText">
              {milestone.author.position}{" "}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold">
                ({milestone.category === "FE" ? "Frontend" : "Backend"})
              </span>
              <span className="font-bold">{milestone.title}</span>
            </div>
            <div className="text-xs text-gray-500">
              <span>
                시작일: {format(new Date(milestone.start_date), "yyyy-MM-dd")}
              </span>
              <span className="mx-4">
                마감일: {format(new Date(milestone.end_date), "yyyy-MM-dd")}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="nothing" className="hover:bg-gray-100">
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[70px]">
              <DropdownMenuItem
              // onClick={() => {
              //   onUpdate(minute);
              // }}
              >
                <PenLine className="mr-2" /> 수정
              </DropdownMenuItem>
              <CustomAlertDialog
                onConfirm={() => {}}
                title="정말 삭제하시겠습니까?"
                confirmText={
                  //   deleteMutation.isPending ? "삭제 중..." :
                  "삭제"
                }
                cancelText="취소"
              >
                <DropdownMenuItem
                  className="text-red-600"
                  //   disabled={deleteMutation.isPending}
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  <Trash2 className="mr-2" />
                  {
                    //   deleteMutation.isPending ? "삭제 중..." :
                    "삭제"
                  }
                </DropdownMenuItem>
              </CustomAlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setIsEditing(true)}
          >
            수정
          </button>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={handleDelete}
          >
            삭제
          </button> */}
        </div>
      </div>
    </div>
  );
}

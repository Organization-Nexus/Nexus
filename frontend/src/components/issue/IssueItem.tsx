import { Issue } from "@/types/issue";
import Image from "next/image";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Ellipsis, PenLine, Trash2 } from "lucide-react";
import { CustomAlertDialog } from "../common/CustomAlertDialog";

interface IssueItemProps {
  issue: Issue;
  isAuthor: boolean;
  onSelect: () => void;
  //   onUpdate: (issueId: number) => void;
  //   onDelete: (issueId: number) => void;
}

export function IssueItem({
  issue,
  isAuthor,
  onSelect,
}: //   onUpdate,
//   onDelete,
IssueItemProps) {
  // const deleteMutation = useDeleteIssue(issue.projectId);

  return (
    <div
      className="p-3 bg-gray-50 rounded-lg transition-all duration-300 ease-in-out hover:bg-gray-100 cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex items-center justify-between mx-2">
        <div className="flex items-center gap-3">
          <div className="relative w-[30px] h-[30px] rounded-2xl">
            <Image
              src={issue.author.user.log.profileImage}
              alt="Profile Image"
              width={30}
              height={30}
              className="object-cover rounded-2xl max-w-[30px] max-h-[30px] min-w-[30px] min-h-[30px]"
              priority
            />
          </div>
          <div className="flex flex-col w-[72px]">
            <span className="font-bold">{issue.author.user.name}</span>
            <span className="font-semibold text-[10px] leading-none text-custom-smallText">
              {issue.author.position}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold">#{issue.id}</span>
              <span className="font-bold">{issue.title}</span>
            </div>
            <div className="text-xs text-gray-500">
              <span>
                시작일: {format(new Date(issue.start_date), "yyyy-MM-dd")}
              </span>
              <span className="mx-4">
                마감일: {format(new Date(issue.end_date), "yyyy-MM-dd")}
              </span>
            </div>
          </div>
        </div>

        {isAuthor && (
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-custom-smallText hover:bg-gray-100 rounded-lg p-1">
                  <Ellipsis size={18} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-[70px]">
                <DropdownMenuItem onClick={() => {}}>
                  <PenLine className="mr-2" /> 수정
                </DropdownMenuItem>
                <CustomAlertDialog
                  onConfirm={() => {}}
                  title="정말 삭제하시겠습니까?"
                  // confirmText={deleteMutation.isPending ? "삭제 중..." : "삭제"}
                  cancelText="취소"
                >
                  <DropdownMenuItem
                    className="text-red-600"
                    //   disabled={deleteMutation.isPending}
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Trash2 className="mr-2" />
                    삭제
                    {/* {deleteMutation.isPending ? "삭제 중..." : "삭제"} */}
                  </DropdownMenuItem>
                </CustomAlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
}

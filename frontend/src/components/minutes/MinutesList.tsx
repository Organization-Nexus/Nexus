"use client";

import { Ellipsis, PenLine, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function MinutesList({ projectId }: { projectId: string }) {
  return (
    <div>
      {/* <Button
        variant="default"
        onClick={() => {}}
        className="mb-5 ml-5 w-[120px]"
      >
        <SquarePlus /> 회의록 생성
      </Button> */}

      <div className="space-y-4  bg-white rounded-xl shadow-md p-6">
        <div className="space-y-2">
          {/* 회의록 목록 아이템 */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div>
              {/* border rounded-lg */}
              <div
                key={i}
                className="flex justify-between p-4  rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div>
                  <h3 className="font-medium">프로젝트 {i}주차 회의</h3>
                  <p className="text-sm text-gray-500">2024-12-11 16:00</p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="nothing" className="">
                      <Ellipsis />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className=" min-w-[70px]">
                    <DropdownMenuItem>
                      <PenLine /> 수정
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Trash2 /> 삭제
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <hr className="mt-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

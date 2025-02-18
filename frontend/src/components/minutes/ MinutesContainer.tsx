"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { SquarePlus } from "lucide-react";
import { MinutesList } from "./MinutesList";
import RightNavBar from "../navbar/RightNavBar";
import { CreateMinutesForm } from "./CreateMinutesForm";
import { Project } from "@/types/project";
import { Minutes } from "@/types/minutes";
const contents = [
  "Project Management",
  "Task Management",
  "Team Management",
  "Calendar",
  "Chat",
];

interface MinutesContainerProps {
  project: Project;
}
export function MinutesContainer({ project }: MinutesContainerProps) {
  const [selectedMinutes, setSelectedMinutes] = useState<Minutes | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateClick = () => {
    setIsCreating(true);
    setSelectedMinutes(null);
  };

  const handleListClick = (minutes: Minutes) => {
    setSelectedMinutes(minutes);
    setIsCreating(false);
  };
  return (
    <div className="flex w-full">
      {/* 왼쪽 영역: 생성 버튼 + 목록 */}
      <div className={isCreating ? "w-2/5 mr-6" : "w-3/5"}>
        <Button
          variant="default"
          onClick={handleCreateClick}
          className="mb-5 ml-5 w-[120px]"
        >
          <SquarePlus className="mr-2" /> 회의록 생성
        </Button>
        <MinutesList projectId={project.id} />
      </div>

      {/* 오른쪽 영역: RightNavBar와 CreateMinutesForm */}
      <div className={`${isCreating ? "w-3/5" : "flex-1"} relative`}>
        <div className={isCreating ? "hidden" : "flex justify-end"}>
          <RightNavBar contents={contents} />
        </div>
        {isCreating && (
          <div className="absolute top-0 left-0 w-full">
            <CreateMinutesForm
              isOpen={isCreating}
              onClose={() => setIsCreating(false)}
              project={project}
            />
          </div>
        )}
      </div>
    </div>
  );
}

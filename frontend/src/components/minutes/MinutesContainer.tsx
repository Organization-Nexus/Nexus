"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { SquarePlus } from "lucide-react";
import { MinutesList } from "./MinutesList";
import RightNavBar from "../navbar/RightNavBar";
import { CreateMinutesForm } from "./CreateMinutesForm";
import { UpdateMinutesForm } from "./UpdateMinutesForm";
import { Project } from "@/types/project";
import { Minutes } from "@/types/minutes";
import { MinutesDetail } from "./MinutesDetail";
import { minutesApi } from "@/app/_api/models/minutes";

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
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMinutesData, setUpdateMinutesData] = useState<Minutes | null>(
    null
  );
  const handleCreateClick = () => {
    setIsCreating(true);
    setIsUpdating(false);
    setSelectedMinutes(null);
  };

  const handleUpdateClick = async (minutes: Minutes) => {
    try {
      // 상세 정보를 가져오는 API 호출
      const detailData = await minutesApi.getMinutesByMinutesId(
        project.id,
        minutes.id
      );
      setUpdateMinutesData(detailData);
      setIsUpdating(true);
      setIsCreating(false);
      setSelectedMinutes(null);
    } catch (error) {
      console.error("회의록 상세 정보 가져오기 실패", error);
      // 에러 처리
    }
  };

  const handleMinutesClick = (minutes: Minutes) => {
    setSelectedMinutes(minutes);
    setIsCreating(false);
    setIsUpdating(false);
    setUpdateMinutesData(null);
  };

  const handleClose = () => {
    setIsCreating(false);
    setIsUpdating(false);
    setUpdateMinutesData(null);
    setSelectedMinutes(null);
  };

  const isRightSectionVisible = isCreating || isUpdating || selectedMinutes;

  return (
    <div className="flex w-full">
      {/* 왼쪽 영역: 목록 */}
      <div className={isRightSectionVisible ? "w-2/5 mr-6" : "w-3/5"}>
        <hr className="mb-4" />
        <Button
          variant="default"
          onClick={handleCreateClick}
          className="mb-5 ml-5 w-[120px]"
        >
          <SquarePlus className="mr-2" /> 회의록 작성
        </Button>
        <MinutesList
          projectId={project.id}
          onUpdate={handleUpdateClick}
          onSelect={handleMinutesClick}
        />
      </div>

      {/* 오른쪽 영역: RightNavBar, CreateMinutesForm, UpdateMinutesForm */}
      <div className={`${isRightSectionVisible ? "w-3/5" : "flex-1"} relative`}>
        <div className={isRightSectionVisible ? "hidden" : "flex justify-end"}>
          <RightNavBar contents={contents} />
        </div>
        {isCreating && (
          <div className="absolute top-0 left-0 w-full">
            <CreateMinutesForm
              isOpen={isCreating}
              onClose={handleClose}
              project={project}
            />
          </div>
        )}
        {isUpdating && updateMinutesData && (
          <div className="absolute top-0 left-0 w-full">
            <UpdateMinutesForm
              project={project}
              minutesId={updateMinutesData.id}
              initialData={updateMinutesData}
              onClose={handleClose}
            />
          </div>
        )}
        {selectedMinutes && (
          <div className="absolute top-0 left-0 w-full">
            <MinutesDetail
              projectId={project.id}
              minutesId={selectedMinutes.id}
              onClose={handleClose}
            />
          </div>
        )}
      </div>
    </div>
  );
}

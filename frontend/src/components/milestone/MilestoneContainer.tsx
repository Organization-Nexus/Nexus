"use client";

import { useState } from "react";
import MilestoneFilter from "./MilestoneFilter";

import MilestoneList from "./MilestoneList";
import { CreateMilestone } from "@/types/milestone";
import { milestoneApi } from "@/app/_api/models/milestone";
import { Button } from "../ui/button";
import { SquarePlus } from "lucide-react";
import { Project } from "@/types/project";
import { CreateMilestoneForm } from "../modal/milestone/CreateMilestone";

interface MilestoneContainerProps {
  project: Project;
}

export default function MilestoneContainer({
  project,
}: MilestoneContainerProps) {
  const [filter, setFilter] = useState<"All" | "FE" | "BE">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const projectId = project.id;
  const handleCreate = async (data: CreateMilestone) => {
    try {
      await milestoneApi.createMilestoneByProjectId(projectId, data);
      setIsModalOpen(false);
      // 필요한 경우 리스트 새로고침 로직
    } catch (error) {
      console.error("마일스톤 생성 실패:", error);
    }
  };

  return (
    <div className="w-3/5 space-y-4">
      <hr />
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center">
          <MilestoneFilter currentFilter={filter} onFilterChange={setFilter} />
        </div>
        <Button variant="default" onClick={() => setIsModalOpen(true)}>
          <SquarePlus /> 마일스톤 생성
        </Button>
      </div>

      <div>
        <MilestoneList
          projectId={projectId}
          filter={filter}
          searchQuery={searchQuery}
        />
      </div>
      {isModalOpen && (
        <CreateMilestoneForm
          project={project}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

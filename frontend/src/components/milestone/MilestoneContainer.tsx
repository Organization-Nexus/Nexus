"use client";

import { useEffect, useState } from "react";
import MilestoneFilter from "./MilestoneFilter";

import MilestoneList from "./MilestoneList";
import { Button } from "../ui/button";
import { SquarePlus } from "lucide-react";
import { Project } from "@/types/project";
import { CreateMilestoneForm } from "../modal/milestone/CreateMilestoneForm";
import { useProjectUserInfo } from "@/query/queries/project-user";

interface MilestoneContainerProps {
  project: Project;
}

export default function MilestoneContainer({
  project,
}: MilestoneContainerProps) {
  const [filter, setFilter] = useState<"All" | "FE" | "BE">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const projectId = project.id;
  const { data: currentUser } = useProjectUserInfo(String(projectId));

  if (!currentUser) {
    return <div>사용자 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="w-3/5 space-y-4">
      <hr />
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center">
          <MilestoneFilter currentFilter={filter} onFilterChange={setFilter} />
        </div>
        {currentUser.is_sub_admin && (
          <Button variant="default" onClick={() => setIsModalOpen(true)}>
            <SquarePlus /> 마일스톤 생성
          </Button>
        )}
      </div>

      <div>
        <MilestoneList
          project={project}
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

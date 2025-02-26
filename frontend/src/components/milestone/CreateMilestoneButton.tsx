import { milestoneApi } from "@/app/_api/models/milestone";
import { CreateMilestone } from "@/types/milestone";
import { SquarePlus } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

interface CreateMilestoneButtonProps {
  projectId: number;
  // onMilestoneCreated: (milestone: Milestone) => void;
}

export default function CreateMilestoneButton({
  projectId,
}: // onMilestoneCreated,
CreateMilestoneButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = async (data: CreateMilestone) => {
    try {
      const response = await milestoneApi.createMilestoneByProjectId(
        projectId,
        data
      );
      // onMilestoneCreated(response.data);
      setIsModalOpen(false);
    } catch (error) {
      console.error("마일스톤 생성 실패:", error);
    }
  };

  return (
    <>
      <Button variant="default" onClick={() => setIsModalOpen(true)}>
        <SquarePlus /> 마일스톤 생성
      </Button>
      {/* 모달 컴포넌트 추가 필요 */}
    </>
  );
}

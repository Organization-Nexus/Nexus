import { useState } from "react";
import { useMilestoneList } from "@/query/queries/milestone";
import { MilestoneDetail } from "./MilestoneDetail";
import MilestoneListView from "./MilestoneListView";
interface MilestoneListProps {
  projectId: number;
  filter: "All" | "FE" | "BE";
  searchQuery: string;
}

export default function MilestoneList({
  projectId,
  filter,
  searchQuery,
}: MilestoneListProps) {
  const { data: milestones, isLoading, isError } = useMilestoneList(projectId);
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(
    null
  );

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>에러가 발생했습니다.</div>;
  if (!milestones) return null;

  const filteredMilestones = milestones
    .filter((milestone) =>
      filter === "All" ? true : milestone.category === filter
    )
    .filter(
      (milestone) =>
        milestone.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        milestone.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (selectedMilestone) {
    return (
      <MilestoneDetail
        projectId={projectId}
        milestoneId={selectedMilestone}
        onClose={() => setSelectedMilestone(null)}
      />
    );
  }

  return (
    <MilestoneListView
      milestones={filteredMilestones}
      projectId={projectId}
      onSelect={setSelectedMilestone}
    />
  );
}

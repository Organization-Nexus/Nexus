import { Milestone } from "@/types/milestone";
import MilestoneItem from "./MilestoneItem";

interface MilestoneListViewProps {
  milestones: Milestone[];
  projectId: number;
  onSelect: (id: number) => void;
}

export default function MilestoneListView({
  milestones,
  projectId,
  onSelect,
}: MilestoneListViewProps) {
  return (
    <div className="space-y-4 h-[68vh] overflow-y-auto">
      {milestones.map((milestone) => (
        <div key={milestone.id} onClick={() => onSelect(milestone.id)}>
          <MilestoneItem milestone={milestone} projectId={projectId} />
        </div>
      ))}
    </div>
  );
}

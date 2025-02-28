import { Milestone } from "@/types/milestone";
import MilestoneItem from "./MilestoneItem";
import { Project } from "@/types/project";

interface MilestoneListViewProps {
  milestones: Milestone[];
  project: Project;
  onSelect: (id: number) => void;
}

export default function MilestoneListView({
  milestones,
  project,
  onSelect,
}: MilestoneListViewProps) {
  return (
    <div className="space-y-4 h-[68vh] overflow-y-auto">
      {milestones.map((milestone) => (
        <div key={milestone.id} onClick={() => onSelect(milestone.id)}>
          <MilestoneItem project={project} milestone={milestone} />
        </div>
      ))}
    </div>
  );
}

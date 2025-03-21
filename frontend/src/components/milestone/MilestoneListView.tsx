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
      {!milestones || milestones.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-4">
          등록된 마일스톤이 없습니다. 마일스톤을 작성해보세요 🚀
        </p>
      ) : (
        milestones.map((milestone) => (
          <div key={milestone.id}>
            <MilestoneItem
              project={project}
              milestone={milestone}
              onSelect={onSelect}
            />
          </div>
        ))
      )}
    </div>
  );
}

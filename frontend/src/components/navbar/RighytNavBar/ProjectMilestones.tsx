"use client";

import { useState } from "react";
import { useMilestonesByProjectIds } from "@/query/queries/project";
import { Milestone } from "@/types/milestone";
import { Project } from "@/types/project";
import {
  Calendar,
  ClipboardList,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import MilestoneIssues from "./MilestoneIssues";
import DetailMilestoneModal from "./DetailMilestoneModal";

export default function ProjectMilestones({
  projects,
}: {
  projects: Project[];
}) {
  const projectIds = projects.map((proj) => proj.id).join(",");
  const { data: milestones, isLoading } = useMilestonesByProjectIds(projectIds);
  const [openStates, setOpenStates] = useState<Record<number, boolean>>(
    Object.fromEntries(projects.map((p) => [p.id, true]))
  );
  const [issueToggleStates, setIssueToggleStates] = useState<
    Record<string, boolean>
  >({});
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(
    null
  );
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const toggleOpen = (projectId: number) => {
    setOpenStates((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  const toggleIssues = (projectId: number, milestoneId: number) => {
    const key = `${projectId}-${milestoneId}`;
    setIssueToggleStates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const openDetailModal = (milestone: Milestone, projectId: number) => {
    setSelectedMilestone(milestone);
    setSelectedProjectId(projectId);
    setIsDetailOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedMilestone(null);
    setSelectedProjectId(null);
    setIsDetailOpen(false);
  };

  if (isLoading) {
    return (
      <div className="text-gray-600 flex items-center gap-2 animate-pulse">
        <ClipboardList className="w-5 h-5 text-gray-400" /> 로딩 중...
      </div>
    );
  }

  return (
    <div>
      <ul className="space-y-6">
        {projects.map((proj) => {
          const projectMilestones: Milestone[] =
            milestones?.find(
              (m: { id: number; milestones: Milestone[] }) => m.id === proj.id
            )?.milestones || [];
          if (projectMilestones.length === 0) return null;
          const isOpen = openStates[proj.id];
          return (
            <li key={proj.id}>
              <button
                onClick={() => toggleOpen(proj.id)}
                className="flex items-center gap-2 mb-2 group"
              >
                {isOpen ? (
                  <ChevronDown className="w-4 h-4 text-gray-600 group-hover:text-black" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-black" />
                )}
                <div className="flex items-center gap-2">
                  <div className="font-bold">{proj.title}</div>
                  <div className="text-xs text-gray-400">
                    ({projectMilestones.length})
                  </div>
                </div>
              </button>

              {isOpen && (
                <ul>
                  {projectMilestones.map((milestone) => {
                    const issueToggleKey = `${proj.id}-${milestone.id}`;
                    const isIssuesOpen =
                      issueToggleStates[issueToggleKey] || false;

                    return (
                      <li key={milestone.id}>
                        <div
                          onClick={() => openDetailModal(milestone, proj.id)}
                          className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <Calendar className="w-10 h-10 bg-green-300 text-white p-2 rounded-lg" />
                            <div>
                              <span className="font-semibold text-gray-800 text-sm">
                                {milestone.title}
                              </span>
                              <p className="text-xs text-gray-600 truncate max-w-md">
                                {milestone.goal.length > 20
                                  ? milestone.goal.slice(0, 20) + "..."
                                  : milestone.goal}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-400">
                            ~ {milestone.end_date}
                          </span>
                        </div>
                        <MilestoneIssues
                          projectId={proj.id}
                          milestoneId={milestone.id}
                          isIssuesOpen={isIssuesOpen}
                          toggleIssues={() =>
                            toggleIssues(proj.id, milestone.id)
                          }
                        />
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      <DetailMilestoneModal
        isOpen={isDetailOpen}
        onClose={closeDetailModal}
        milestone={selectedMilestone}
      />
    </div>
  );
}

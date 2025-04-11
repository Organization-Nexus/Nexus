"use client";

import { useMilestonesByProjectIds } from "@/query/queries/project";
import { Milestone } from "@/types/milestone";
import { Project } from "@/types/project";
import { Calendar, CheckCircle, ClipboardList } from "lucide-react";

export default function ProjectListCard({ projects }: { projects: Project[] }) {
  const projectIds = projects.map((proj) => proj.id).join(",");
  const { data: milestones, isLoading } = useMilestonesByProjectIds(projectIds);

  if (isLoading) {
    return (
      <div className="text-gray-600 flex items-center gap-2 animate-pulse">
        <ClipboardList className="w-5 h-5 text-gray-400" /> 로딩 중...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-xl font-extrabold text-blue-800 mb-6 flex items-center gap-3">
        <ClipboardList className="w-7 h-7 text-blue-800" /> 금일 업무
      </div>
      <ul className="space-y-6">
        {projects.map((proj) => {
          const projectMilestones: Milestone[] =
            milestones?.find(
              (m: { id: number; milestones: Milestone[] }) => m.id === proj.id
            )?.milestones || [];

          return (
            <li
              key={proj.id}
              className="bg-gradient-to-br from-white to-blue-50 p-5 rounded-xl shadow-lg border border-blue-200 hover:shadow-xl transition-shadow"
            >
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-700" /> {proj.title}
              </h3>

              {/* 마일스톤 리스트 */}
              {projectMilestones.length > 0 ? (
                <ul className="space-y-3">
                  {projectMilestones.map((milestone) => (
                    <li
                      key={milestone.id}
                      className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-blue-100 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <div>
                          <span className="font-semibold text-gray-800 text-sm">
                            {milestone.title}
                          </span>
                          <p className="text-xs text-gray-600 mt-1 truncate max-w-md">
                            {milestone.goal}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                        ~ {milestone.end_date}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-gray-400" /> 금일
                  업무가 없습니다.
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

"use client";

import { Project, ProjectListProps } from "@/types/project";
import { useQuery as useReactQuery } from "@tanstack/react-query";
import ProjectCard from "./ProjectCard";
import { projectApi } from "@/api/project";

const ProjectList = ({ projects = [] }: ProjectListProps) => {
  const { data: project } = useReactQuery({
    queryKey: ["project"],
    queryFn: projectApi.getMyProjects,
    initialData: projects,
  });

  const getProjectStatus = (start_date: string, end_date: string) => {
    const now = new Date();
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (startDate > now) {
      return "scheduled";
    } else if (endDate >= now) {
      return "in-progress";
    } else {
      return "completed";
    }
  };

  const inProgressProjects = project?.filter(
    (project: Project) =>
      getProjectStatus(project.start_date, project.end_date) === "in-progress"
  );

  const completedProjects = project?.filter(
    (project: Project) =>
      getProjectStatus(project.start_date, project.end_date) === "completed"
  );

  const scheduledProjects = project?.filter(
    (project: Project) =>
      getProjectStatus(project.start_date, project.end_date) === "scheduled"
  );

  return (
    <div className="mx-auto p-4">
      {/* In Progress Projects */}
      <div className="grid grid-cols-2 gap-4">
        {inProgressProjects?.map((project: Project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <hr className="my-8" />

      {/* Completed Projects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {completedProjects?.map((project: Project) => (
          <div key={project.id}>
            <ProjectCard project={project} />
          </div>
        ))}
      </div>

      <hr className="my-8" />

      {/* Scheduled Projects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {scheduledProjects?.map((project: Project) => (
          <div key={project.id}>
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;

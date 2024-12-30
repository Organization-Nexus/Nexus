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

  const getProjectStatus = (end_date: string) => {
    return new Date(end_date) >= new Date() ? "in-progress" : "completed";
  };

  const inProgressProjects = project?.filter(
    (project: Project) => getProjectStatus(project.end_date) === "in-progress"
  );
  const completedProjects = project?.filter(
    (project: Project) => getProjectStatus(project.end_date) === "completed"
  );

  return (
    <div className="mx-auto p-4">
      {/* Progress Projects */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {inProgressProjects?.map((project: Project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      <hr className="my-8" />

      {/* Completed Projects */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {completedProjects?.map((project: Project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectList;

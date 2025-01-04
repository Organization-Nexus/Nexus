"use client";

import { Project, ProjectListProps } from "@/types/project";
import { useQuery as useReactQuery } from "@tanstack/react-query";
import ProjectCard from "./ProjectCard";
import { projectApi } from "@/api/project";

const ProjectList = ({ projects = [] }: ProjectListProps) => {
  const { data: project } = useReactQuery({
    queryKey: ["projectList"],
    queryFn: projectApi.getMyProjects,
    initialData: projects,
    initialDataUpdatedAt: Date.now(),
  });

  const now = new Date();

  const inProgress: Project[] = [];
  const completed: Project[] = [];
  const scheduled: Project[] = [];

  project?.forEach((proj: Project) => {
    const startDate = new Date(proj.start_date);
    const endDate = new Date(proj.end_date);

    if (startDate > now) {
      scheduled.push(proj);
    } else if (endDate >= now) {
      inProgress.push(proj);
    } else {
      completed.push(proj);
    }
  });

  return (
    <div className="mx-auto p-4">
      <div className="grid grid-cols-2 gap-4">
        {inProgress?.map((proj, index) => (
          <ProjectCard key={proj.id} project={proj} />
        ))}
      </div>

      <hr className="my-8" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {completed?.map((proj, index) => (
          <ProjectCard key={proj.id} project={proj} />
        ))}
      </div>

      <hr className="my-8" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {scheduled?.map((proj, index) => (
          <ProjectCard key={proj.id} project={proj} />
        ))}
      </div>
    </div>
  );
};

export default ProjectList;

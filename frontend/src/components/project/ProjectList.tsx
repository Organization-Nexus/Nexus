"use client";

import { Project, ProjectListProps } from "@/types/project";
import ProjectCard from "./ProjectCard";
import { useState, useEffect } from "react";

export default function ProjectList({ project }: ProjectListProps) {
  const now = new Date();
  const [inProgress, setInProgress] = useState<Project[]>([]);
  const [completed, setCompleted] = useState<Project[]>([]);
  const [scheduled, setScheduled] = useState<Project[]>([]);

  useEffect(() => {
    if (project) {
      const inProgressArr: Project[] = [];
      const completedArr: Project[] = [];
      const scheduledArr: Project[] = [];

      project.forEach((proj: Project) => {
        const startDate = new Date(proj.start_date);
        const endDate = new Date(proj.end_date);

        if (startDate > now) {
          scheduledArr.push(proj);
        } else if (endDate >= now) {
          inProgressArr.push(proj);
        } else {
          completedArr.push(proj);
        }
      });

      setScheduled(scheduledArr);
      setInProgress(inProgressArr);
      setCompleted(completedArr);
    }
  }, [project]);

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
}

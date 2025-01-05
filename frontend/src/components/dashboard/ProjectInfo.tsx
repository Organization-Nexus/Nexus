import { Project, ProjectBase } from "@/types/project";
import React from "react";
import ProgressBar from "../project/ProgressBar";
import calculateProjectProgress from "@/utils/calculateProjectProgress";

function ProjectInfo({ project }: { project: ProjectBase }) {
  const progressPercentage = calculateProjectProgress(
    project.start_date,
    project.end_date
  );
  return (
    <>
      <div className="flex items-center space-x-8 p-4">
        <img
          src={
            typeof project?.project_image === "string"
              ? project.project_image
              : URL.createObjectURL(project.project_image)
          }
          alt={`${project?.title} project image`}
          className="w-24 h-24 object-cover"
        />
        <div className="w-full">
          <p className="text-2xl font-semibold text-primary">
            {project?.title}
            <span className="text-sm font-medium text-gray-400 pl-4">
              프로젝트 방입니다. 🧑‍🚀
            </span>
          </p>
          <hr className="my-2" />
          <p className="text-gray-600">{project?.description}</p>
          <ProgressBar progress={progressPercentage} />
          <div className="flex justify-between text-gray-400 text-xs">
            <p>{project?.start_date}</p>
            <p>{project?.start_date}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectInfo;

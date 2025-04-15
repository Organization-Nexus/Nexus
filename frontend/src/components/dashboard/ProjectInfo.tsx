import { ProjectProps } from "@/types/project";
import ProgressBar from "../project/ProgressBar";
import calculateProjectProgress from "@/utils/calculateProjectProgress";
import Image from "next/image";

export default function ProjectInfo({ project }: ProjectProps) {
  const progressPercentage = calculateProjectProgress(
    project.start_date,
    project.end_date
  );
  return (
    <>
      <div className="flex items-center space-x-8 p-2 mt-2">
        <div className="relative w-24 h-24">
          {typeof project?.project_image === "string" && (
            <Image
              src={project.project_image}
              alt={`${project?.title} project image`}
              layout="fill"
              objectFit="cover"
            />
          )}
        </div>
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
            <p>{project?.end_date}</p>
          </div>
        </div>
      </div>
    </>
  );
}

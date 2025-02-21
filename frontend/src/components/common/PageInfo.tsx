"use client";

import { ProjectProps } from "@/types/project";
import Image from "next/image";

interface PageInfoProps extends ProjectProps {
  menuType: {
    title: string;
    description: string;
  };
}

export default function ProjectInfo({ project, menuType }: PageInfoProps) {
  return (
    <div className="flex w-full pt-4 mt-8">
      <div className="w-1/2 max-w-7xl space-y-6">
        <div className="">
          <div className="flex items-center space-x-6">
            <Image
              src={
                typeof project?.project_image === "string"
                  ? project.project_image
                  : "/default-image.jpg"
              }
              alt={project?.title || "Project Image"}
              width={100}
              height={100}
              className="rounded-lg"
            />
            <div>
              <div className="flex items-end space-x-2">
                <p className="text-4xl font-semibold text-primary">
                  {project?.title}
                </p>
                <p className="text-2xl text-gray-700 font-semibold">
                  {menuType.title}
                </p>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {menuType.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

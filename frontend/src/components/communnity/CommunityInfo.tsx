"use client";

import { ProjectProps } from "@/types/project";
import Image from "next/image";

export default function CommunityInfo({ project }: ProjectProps) {
  return (
    <div className="flex justify-center w-full pt-4">
      <div className="w-3/4 max-w-7xl space-y-6">
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
              <div className="flex items-center space-x-2">
                <p className="text-3xl font-semibold text-primary">
                  {project?.title}
                </p>
                <p className="text-xl text-gray-700 font-medium">Community</p>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                팀원들과 편하게 대화하는 커뮤니티 공간입니다. 🌴
              </p>
            </div>
          </div>
        </div>
        <hr />
      </div>
    </div>
  );
}

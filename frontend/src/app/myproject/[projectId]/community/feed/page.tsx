import { feedApi } from "@/api/feed";
import { projectApi } from "@/api/project";
import FeedNoticeList from "@/components/communnity/feed-notice/FeedNoticeList";
import RightNavBar from "@/components/navbar/RightNavBar";
import type { Feed } from "@/types/feed";
import { ProjectIdProps } from "@/types/project";
import React from "react";

export default async function Feed({ params }: ProjectIdProps) {
  const projectId = params.projectId;
  const project = await projectApi.getProjectById(projectId);
  const feeds = await feedApi.getfeedsByProjectId(projectId);

  return (
    <>
      <div>
        <div className="flex items-center">
          <img
            src={
              typeof project?.project_image === "string"
                ? project.project_image
                : undefined
            }
            alt={`${project?.title} project image`}
            className="w-24 h-24 object-cover mr-4"
          />
          <div className="space-y-2">
            <div className="flex text-xl">
              <h1 className="font-semibold mr-2">{project.title}</h1>
              <p> 커뮤니티</p>
            </div>
            <p className="text-gray-600 text-sm">
              팀원들과 편하게 대화하는 커뮤니티 공간입니다. 🌴
            </p>
          </div>
        </div>
        <div className="flex">
          <div className="w-[70%]">
            <FeedNoticeList feeds={feeds} />
          </div>
          <div className="w-[350px] bg-white p-6 rounded-lg shadow-xl h-[600px] overflow-y-auto"></div>
        </div>
      </div>
    </>
  );
}

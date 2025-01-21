import { communityApi } from "@/api/community";
import { projectApi } from "@/api/project";
import FeedNoticeList from "@/components/communnity/feed-notice/FeedNoticeList";
import { ProjectIdProps } from "@/types/project";
import React from "react";
import Image from "next/image";

export default async function Feed({ params }: ProjectIdProps) {
  const projectId = params.projectId;
  const project = await projectApi.getProjectById(projectId);
  const feeds = await communityApi.getfeedsByProjectId(projectId);

  return (
    <>
      <div className="flex justify-center w-full py-8">
        <div className="w-1/2 max-w-7xl space-y-4">
          {/* 프로젝트 정보 섹션 */}
          <div className="bg-white border rounded-xl shadow-md p-8">
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
                  <p className="text-2xl text-gray-700 font-bold">Feed</p>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  팀원들과 편하게 대화하는 커뮤니티 공간입니다. 🌴
                </p>
              </div>
            </div>
          </div>

          {/* 피드 리스트 영역 */}
          <div className="bg-white border rounded-xl shadow-md p-6">
            <FeedNoticeList feeds={feeds} />
          </div>
        </div>

        {/* 오른쪽 섹션: 공지사항 등 */}
        <div className="pl-8">
          <div className="bg-white border rounded-xl shadow-md p-6 h-[600px] w-[400px]">
            <h3 className="text-2xl font-semibold text-gray-800">공지사항</h3>
            <div className="mt-4">
              {/* 여기에 공지사항 컴포넌트를 추가할 수 있습니다 */}
              <p className="text-sm text-gray-600">
                여기에 공지사항 내용을 추가해주세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

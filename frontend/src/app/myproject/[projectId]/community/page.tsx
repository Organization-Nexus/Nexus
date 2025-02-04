import { communityApi } from "@/app/_api/models/community";
import { projectApi } from "@/app/_api/models/project";
import { projectUserApi } from "@/app/_api/models/project-user";
import CommunityClientTaps from "@/components/communnity/CommunityClientTaps";
import CommunityInfo from "@/components/communnity/CommunityInfo";
import { ProjectIdProps } from "@/types/project";

export default async function Community({ params }: ProjectIdProps) {
  const projectId = params.projectId;
  const project = await projectApi.getProjectById(projectId);
  const notices = await communityApi.getNoticesByProjectId(projectId);
  const feeds = await communityApi.getfeedsByProjectId(projectId);
  const projectUser = await projectUserApi.getProjectUser(projectId);

  return (
    <div className="flex justify-center py-8">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-md">
        <CommunityInfo project={project} />
        <CommunityClientTaps
          projectId={projectId}
          projectUser={projectUser}
          feeds={feeds}
          notices={notices}
        />
      </div>

      <div className="pl-8">
        <div className="bg-white border rounded-xl shadow-md p-6 h-[600px] w-[400px]">
          <h3 className="text-2xl font-semibold text-gray-800">공지사항</h3>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              여기에 공지사항 내용을 추가해주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

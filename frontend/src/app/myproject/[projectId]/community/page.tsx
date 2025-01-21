import { communityApi } from "@/api/community";
import { projectApi } from "@/api/project";
import { ProjectIdProps } from "@/types/project";
import CommunityInfo from "@/components/communnity/CommunityInfo";
import CommunityClientTaps from "@/components/communnity/CommunityClientTaps";

export default async function Community({ params }: ProjectIdProps) {
  const projectId = params.projectId;
  const project = await projectApi.getProjectById(projectId);
  const notices = await communityApi.getNoticesByProjectId(projectId);
  const feeds = await communityApi.getfeedsByProjectId(projectId);

  return (
    <div className="flex justify-center py-8">
      <div className="w-2/3 max-w-7xl">
        <CommunityInfo project={project} />
        <CommunityClientTaps feeds={feeds} />
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

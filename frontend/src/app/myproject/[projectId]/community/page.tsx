import { communityApi } from "@/api/community";
import { projectApi } from "@/api/project";
import CommunityInfo from "@/components/communnity/communityInfo";
import { ProjectIdProps } from "@/types/project";

export default async function Community({ params }: ProjectIdProps) {
  const projectId = params.projectId;
  const project = await projectApi.getProjectById(projectId);
  const notices = await communityApi.getNoticesByProjectId(projectId);
  const feeds = await communityApi.getfeedsByProjectId(projectId);

  return (
    <>
      <div>
        <CommunityInfo project={project} />
      </div>
    </>
  );
}

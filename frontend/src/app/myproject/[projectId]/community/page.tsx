import { projectApi } from "@/app/_api/models/project";
import { projectUserApi } from "@/app/_api/models/project-user";
import PageInfo from "@/components/common/PageInfo";
import CommunityClientTaps from "@/components/communnity/CommunityClientTaps";
import { ProjectIdProps } from "@/types/project";

export default async function Community({ params }: ProjectIdProps) {
  const projectId = params.projectId;
  const projectUser = await projectUserApi.getProjectUser(projectId);
  const project = await projectApi.getProjectById(projectId);
  const communityMenuType = {
    title: "커뮤니티",
    description: "팀원들과 편하게 대화하는 커뮤니티 공간입니다. 🌴",
  };
  return (
    <div>
      <div className="mx-20">
        <PageInfo project={project} menuType={communityMenuType} />
        <CommunityClientTaps projectId={projectId} projectUser={projectUser} />
      </div>
    </div>
  );
}

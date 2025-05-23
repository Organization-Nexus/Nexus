import { projectApi } from "@/app/_api/models/project";
import PageInfo from "@/components/common/PageInfo";
import MilestoneContainer from "@/components/milestone/MilestoneContainer";
import RightNavBar from "@/components/navbar/RighytNavBar/RightNavBar";
import { ProjectIdProps } from "@/types/project";

export default async function Milestones({ params }: ProjectIdProps) {
  const projectId = params.projectId;
  const project = await projectApi.getProjectById(projectId);
  const milestoneMenuType = {
    title: "마일스톤",
    description: "마일스톤을 한 눈에 확인하고 관리하세요. ✅",
  };

  return (
    <div className="mx-20">
      <PageInfo project={project} menuType={milestoneMenuType} />
      <div className="flex w-full justify-between">
        <MilestoneContainer project={project} />
        <RightNavBar projectId={projectId} />
      </div>
    </div>
  );
}

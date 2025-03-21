import { milestoneApi } from "@/app/_api/models/milestone";
import { projectApi } from "@/app/_api/models/project";
import PageInfo from "@/components/common/PageInfo";
import MilestoneContainer from "@/components/milestone/MilestoneContainer";
import TodayTasksSidebar from "@/components/milestone/TodayTasksSidebar";
import { ProjectIdProps } from "@/types/project";

export default async function Issues({ params }: ProjectIdProps) {
  const projectId = params.projectId;
  const project = await projectApi.getProjectById(projectId);
  const milestones = await milestoneApi.getMilestonesByProjectId(
    Number(projectId)
  );
  const issueMenuType = {
    title: "이슈",
    description: "상세 업무내용을 확인하세요. 👍",
  };

  return (
    <div className="mx-20">
      <PageInfo project={project} menuType={issueMenuType} />
      <div className="flex w-full justify-between">
        <MilestoneContainer project={project} />
        <TodayTasksSidebar />
      </div>
    </div>
  );
}

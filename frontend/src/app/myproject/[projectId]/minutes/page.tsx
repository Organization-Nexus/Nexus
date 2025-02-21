import { projectApi } from "@/app/_api/models/project";
import PageInfo from "@/components/common/PageInfo";
import { MinutesContainer } from "@/components/minutes/ MinutesContainer";
import { ProjectIdProps } from "@/types/project";

export default async function Minutes({ params }: ProjectIdProps) {
  const projectId = params.projectId;
  const project = await projectApi.getProjectById(projectId);
  const minutesMenuType = {
    title: "회의록",
    description: "회의 내용을 기록하고 공유하는 공간입니다. 📝",
  };

  return (
    <div className="mx-20">
      <PageInfo project={project} menuType={minutesMenuType} />
      <div className="flex justify-between py-8">
        <MinutesContainer project={project} />
      </div>
    </div>
  );
}

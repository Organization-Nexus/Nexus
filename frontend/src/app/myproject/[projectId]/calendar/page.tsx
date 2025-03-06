import { projectApi } from "@/app/_api/models/project";
import { projectUserApi } from "@/app/_api/models/project-user";
import PageInfo from "@/components/common/PageInfo";
import { ProjectIdProps } from "@/types/project";

export default async function Community({ params }: ProjectIdProps) {
  const projectId = params.projectId;
  const projectUser = await projectUserApi.getProjectUser(projectId);
  const project = await projectApi.getProjectById(projectId);
  const communityMenuType = {
    title: "달력",
    description: "업무 일정을 확인하고 관리해보세요. ⏱️",
  };
  return (
    <div>
      <div className="mx-20">
        <PageInfo project={project} menuType={communityMenuType} />
        <div className="w-4/5 my-[25vh]">
          <div className="flex flex-row justify-center">
            <div className="row-span-2 text-7xl font-semibold text-primary text-center  mr-4">
              {" "}
              🚧{" "}
            </div>
            <div className="flex flex-col  justify-center">
              <div className="text-3xl font-semibold text-primary">
                Comming Soon
              </div>

              <div className="text-gray-400 text-lg text-center mt-2">
                페이지 준비중
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

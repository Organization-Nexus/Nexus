import { projectApi } from "@/app/_api/models/project";
import { projectUserApi } from "@/app/_api/models/project-user";
import { ProjectIdProps } from "@/types/project";

export default async function Community({ params }: ProjectIdProps) {
  const projectId = params.projectId;
  const projectUser = await projectUserApi.getProjectUser(projectId);
  const project = await projectApi.getProjectById(projectId);
  const adminMenuType = {
    title: "관리자 페이지",
    description: "관리자 페이지입니다 ",
  };
  return (
    <div>
      <div className="mx-20">
        {/* <PageInfo project={project} menuType={adminMenuType} /> */}
        <div className="w-4/5 my-[45vh]">
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

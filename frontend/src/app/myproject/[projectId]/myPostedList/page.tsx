import { projectApi } from "@/app/_api/models/project";
import { projectUserApi } from "@/app/_api/models/project-user";
import PageInfo from "@/components/common/PageInfo";
import MyPostedListContainer from "@/components/myPostedList/MyPostedListContainer";
import { ProjectIdProps } from "@/types/project";

export default async function page({ params }: ProjectIdProps) {
  const projectId = params.projectId;
  const project = await projectApi.getProjectById(projectId);
  const projectUser = await projectUserApi.getProjectUser(projectId);
  const myPostedListMenuType = {
    title: "내가 쓴 글",
    description: "나는 어떤 글을 썼을까? 🤔",
  };
  return (
    <div className="mx-20">
      <PageInfo project={project} menuType={myPostedListMenuType} />
      <MyPostedListContainer />
    </div>
  );
}

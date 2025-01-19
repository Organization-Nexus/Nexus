import { projectApi } from "@/api/project";
import ProjectList from "@/components/project/ProjectList";
import { userApi } from "@/api/user";
import MyprojectHeader from "@/components/project/MyprojectHeader";
import RightNavBar from "@/components/navbar/RightNavBar";
import ModalMain from "@/components/modal/config/ModalMain";

const contents = [
  "Project Management",
  "Task Management",
  "Team Management",
  "Calendar",
  "Chat",
];

export default async function MyProject() {
  const projects = await projectApi.getMyProjects();
  const user = await userApi.getUser();

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-[#EDF2FB]">
        <div className="flex w-full max-w-screen-2xl mx-auto h-[880px] py-16 space-x-12">
          <div className="flex-1 bg-white p-9 rounded-2xl shadow-md overflow-y-auto">
            <div className="flex justify-between px-4">
              <MyprojectHeader user={user} />
              <ModalMain label="프로젝트 생성" />
            </div>
            <hr className="my-4" />
            <ProjectList projects={projects} />
          </div>
          <div className="w-[400px] bg-white px-6 py-3 rounded-2xl shadow-xl h-[400px] overflow-y-auto">
            <RightNavBar contents={contents} user={user} />
          </div>
        </div>
      </div>
    </>
  );
}

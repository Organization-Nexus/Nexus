import { projectApi } from "@/api/project";
import ModalButton from "@/components/project/ModalButton";
import RightNavBar from "@/components/project/RightNavBar";
import { LogoutButton } from "@/components/project/LogoutButton";
import ProjectList from "@/components/project/ProjectList";
import { userApi } from "@/api/user";
import MyprojectHeader from "@/components/project/MyprojectHeader";

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
        <div className="flex w-full max-w-screen-2xl mx-auto py-6 space-x-2">
          <div className="flex-1 bg-white p-8 rounded-lg shadow-md h-[1000px] overflow-y-auto">
            <div className="flex justify-between">
              <MyprojectHeader user={user} />
              <ModalButton label="Create Project" />
            </div>
            <hr className="my-4" />
            <ProjectList projects={projects} />
          </div>
          <div className="w-[350px] bg-white p-6 rounded-lg shadow-xl h-[600px] overflow-y-auto">
            <RightNavBar contents={contents} />
          </div>
        </div>
      </div>
      <LogoutButton />
    </>
  );
}

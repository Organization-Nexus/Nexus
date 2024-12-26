import ProjectList from "@/components/Project/ProjectList";
import RightNavBar from "@/components/common/RightNavBar";
import ModalButton from "@/components/common/ModalButton";
import { LogoutButton } from "@/components/common/LogoutButton";
import { getMyProjects } from "@/api/utils/project";

const contents = [
  "Project Management",
  "Task Management",
  "Team Management",
  "Calendar",
  "Chat",
];

export default async function MyProject() {
  const projects = await getMyProjects();
  return (
    <div className="flex justify-center items-center h-screen bg-[#EDF2FB]">
      <div className="flex max-w-screen-xl w-full mx-auto py-6 space-x-6">
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md h-[700px] overflow-y-auto">
          <div className="flex justify-between">
            <h2 className="text-2xl font-semibold mb-4">My Projects</h2>
            <ModalButton label="Create Project" />
            <LogoutButton />
          </div>
          <hr className="my-4" />
          <div className="p-4">
            <ProjectList projects={projects} />
          </div>
        </div>
        <div className="w-[350px] bg-white p-6 rounded-lg shadow-xl h-[600px] overflow-y-auto">
          <RightNavBar contents={contents} />
        </div>
      </div>
    </div>
  );
}

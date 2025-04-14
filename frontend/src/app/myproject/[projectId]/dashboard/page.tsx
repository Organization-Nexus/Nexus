import { projectApi } from "@/app/_api/models/project";
import CommunityCardSection from "@/components/dashboard/CommunityCardSection";
import MinutesCardSection from "@/components/dashboard/MinutesCardSection";
import ProjectInfo from "@/components/dashboard/ProjectInfo";
import ProjectUsers from "@/components/dashboard/ProjectUsers";
import TodoCardSection from "@/components/dashboard/TodoCardSection";
import { ProjectIdProps } from "@/types/project";

export default async function Dashboard({ params }: ProjectIdProps) {
  const projectId = params.projectId;
  const projects = await projectApi.getProjectById(projectId);

  return (
    <div className="flex min-h-screen justify-center">
      <div className="w-full  max-w-7xl mx-20 my-20">
        {/* Project Header */}
        <div className="bg-white px-10 py-4 rounded-lg shadow-md mb-4 mt-8">
          {/* Project Info */}
          <ProjectInfo project={projects} />
          <hr className="my-2" />
          {/* Project Team Members */}
          <div className="flex flex-wrap justify-start gap-4">
            <ProjectUsers projectId={projectId} />
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-5 grid-rows-2 gap-4 ">
          {/* 왼쪽 Column */}
          <div className="row-span-2 col-span-2">
            <CommunityCardSection
              projectId={projectId}
              title="Creeper 커뮤니티"
            />
          </div>

          {/* 오른쪽 Column */}
          <div className="space-y-4 col-span-3">
            <TodoCardSection projectId={projectId} title="내가 담당중인 업무" />

            <MinutesCardSection projectId={projectId} title="회의록" />
          </div>
        </div>
      </div>
    </div>
  );
}

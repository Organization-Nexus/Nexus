import { projectApi } from "@/app/_api/models/project";
import CardSection from "@/components/dashboard/CardSection";
import ProjectInfo from "@/components/dashboard/ProjectInfo";
import ProjectUsers from "@/components/dashboard/ProjectUsers";
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
            <CardSection title="Creeper 커뮤니티">
              <div className="space-y-2">
                {Array(6)
                  .fill(null)
                  .map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm">제목입니다.</span>
                    </div>
                  ))}
              </div>
            </CardSection>
          </div>

          {/* 오른쪽 Column */}
          <div className="space-y-4 col-span-3">
            <CardSection title="내가 담당중인 업무">02</CardSection>

            <CardSection title="일정">03</CardSection>
          </div>
        </div>
      </div>
    </div>
  );
}

import { projectApi } from "@/api/project";
import CardSection from "@/components/dashboard/CardSection";
import ProjectInfo from "@/components/dashboard/ProjectInfo";
import { ProjectIdProps } from "@/types/project";

export default async function Dashboard({ params }: ProjectIdProps) {
  const projectId = params.projectId;
  const project = await projectApi.getProjectById(projectId);

  return (
    <div className="h-full flex justify-center items-center">
      <div className="w-full max-w-7xl mx-auto">
        {/* Project Header */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* Project Info */}
          <ProjectInfo project={project} />
          <hr className="my-2" />
          {/* Project Team Members */}
          <div>
            {project?.projectUsers.map((user, index) => (
              <div className="flex">
                <div
                  key={index}
                  className="flex flex-col items-center justify-center p-4 "
                >
                  <div className="w-16 h-16 bg-gray-200 rounded-3xl mb-1"></div>
                  <p className="font-bold text-sm text-gray-700">홍길동</p>
                  <p className="text-xs text-gray-400">{user.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard Cards Section */}
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Community Section */}
            <CardSection title="Community">
              <p className="text-gray-600">Coming soon...</p>
            </CardSection>
            {/* My Tasks Section */}
            <CardSection title="My Tasks">
              <p className="text-gray-600">Coming soon...</p>
            </CardSection>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Calendar Section */}
            <CardSection title="Calendar">
              <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg ">
                <p className="text-gray-600">Calendar coming soon...</p>
              </div>
            </CardSection>
            {/* Chat Section */}
            <CardSection title="Chat">
              <p className="text-gray-600">Coming soon...</p>
            </CardSection>
          </div>
        </div>
      </div>
    </div>
  );
}

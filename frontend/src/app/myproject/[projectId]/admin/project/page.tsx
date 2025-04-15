import { projectApi } from "@/app/_api/models/project";
import AdminProjectPage from "@/components/admin/AdminProjectPage";
import { ProjectIdProps } from "@/types/project";

export default async function page({ params }: ProjectIdProps) {
  const projectId = params.projectId;
  const project = await projectApi.getProjectById(projectId);
  return (
    <div className="mx-auto w-full h-screen flex items-center justify-center">
      <AdminProjectPage project={project} />
    </div>
  );
}

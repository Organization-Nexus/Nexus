import { Project } from "@/types/project";
import ProgressBar from "./ProgressBar";
import calculateProjectProgress from "@/utils/calculateProjectProgress";
import { useRouter } from "next/navigation";
import { FaRegFaceGrinBeam } from "react-icons/fa6";

const ProjectCard = ({ project }: { project: Project }) => {
  const router = useRouter();
  const now = new Date();
  const startDate = new Date(project.start_date);
  const endDate = new Date(project.end_date);

  let status: string;
  let stickerColor: string;

  if (startDate > now) {
    status = "scheduled";
    stickerColor = "bg-yellow-400";
  } else if (endDate >= now) {
    status = "in-progress";
    stickerColor = "bg-blue-400";
  } else {
    status = "completed";
    stickerColor = "bg-gray-400";
  }

  const progressPercentage = calculateProjectProgress(
    project.start_date,
    project.end_date
  );

  const projectMembers = project.projectUsers;
  const memberCount = projectMembers.length;

  const bgColor =
    status === "in-progress"
      ? "bg-blue-50"
      : status === "scheduled"
      ? "bg-yellow-50"
      : "bg-gray-50";

  const trimmedDescription =
    project.description.length > 25
      ? `${project.description.slice(0, 25)}...`
      : project.description;

  const handleCardClick = () => {
    router.push(`/myproject/${project.id}/dashboard`);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`${bgColor} shadow-lg rounded-lg overflow-hidden hover:scale-105 transition-transform relative cursor-pointer`}
    >
      {/* Status Sticker */}
      <div
        className={`absolute top-2 left-2 px-3 py-1 text-white text-xs rounded-md ${stickerColor}`}
      >
        {status === "in-progress"
          ? "진행중"
          : status === "scheduled"
          ? "예정됨"
          : status === "completed"
          ? "완료됨"
          : ""}
      </div>

      <div className="flex p-6">
        {/* Project Image */}
        {project.project_image && (
          <img
            src={
              typeof project.project_image === "string"
                ? project.project_image
                : undefined
            }
            className="w-32 h-32 object-cover rounded-md mr-4"
          />
        )}
        <div className="flex-1 space-y-2">
          {/* Title and Description */}
          <h3 className="text-xl font-semibold text-gray-800">
            {project.title}
          </h3>
          <p className="text-sm text-gray-600">{trimmedDescription}</p>

          {/* Dates */}
          <div className="flex justify-between text-xs text-gray-500">
            <div>Start Date: {project.start_date}</div>
            <div>End Date: {project.end_date}</div>
          </div>

          {/* Member Information */}
          <div className="flex gap-2 text-sm text-gray-500">
            <div className="flex items-center justify-center gap-1">
              <p className="text-md">
                <FaRegFaceGrinBeam />
              </p>
              {memberCount}
            </div>
          </div>

          {/* Progress Bar */}
          <ProgressBar progress={progressPercentage} status={status} />
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;

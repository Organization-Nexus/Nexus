import { ProjectUserProps } from "@/types/project-user";
import React from "react";

function ProjectUsers({ projectUsers = [] }: ProjectUserProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {projectUsers.map((projectUser) => (
        <div
          key={projectUser.id}
          className="flex flex-col items-center justify-center p-4"
        >
          {/* User Profile Image */}
          <div className="w-16 h-16 bg-gray-200 rounded-3xl mb-1">
            <img
              src={projectUser.user?.log.profileImage}
              alt={`${projectUser.user?.name}'s profile`}
              className="w-full h-full object-cover rounded-3xl"
            />
          </div>
          {/* User Name */}
          <p className="font-bold text-sm text-gray-700">
            {projectUser.user?.name}
          </p>
          {/* User Position */}
          <p className="text-xs text-gray-400">{projectUser.position}</p>
        </div>
      ))}
    </div>
  );
}

export default ProjectUsers;

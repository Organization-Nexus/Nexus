"use client";

import { Project, ProjectListProps } from "@/types/ProjectList";
import React from "react";

const currentDate = new Date();

const ProjectList: React.FC<ProjectListProps> = ({ projects = [] }) => {
  const inProgressProjects = projects.filter(
    (project) => new Date(project.end_date) >= currentDate
  );
  const completedProjects = projects.filter(
    (project) => new Date(project.end_date) < currentDate
  );

  const renderProject = (project: Project, isCompleted: boolean) => {
    return (
      <div key={project.id} className="bg-white p-4 shadow-md mb-4">
        <div className="flex items-start">
          {project.image_url && (
            <img
              src={project.image_url}
              alt={`${project.name} image`}
              className="w-12 h-12 object-cover mr-4"
            />
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {project.name}
            </h3>
            <p className="text-sm text-gray-500">{project.description}</p>
          </div>
        </div>

        <div className="flex items-center mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                isCompleted ? "bg-green-500" : "bg-blue-500"
              }`}
              style={{ width: isCompleted ? "100%" : "50%" }}
            ></div>
          </div>
          <span className="text-xs text-gray-400 ml-2">
            {isCompleted ? "100%" : "50%"}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">In Progress</h2>
      {inProgressProjects.map((project) => renderProject(project, false))}

      <h2 className="text-xl font-semibold">Completed</h2>
      {completedProjects.map((project) => renderProject(project, true))}
    </div>
  );
};

export default ProjectList;

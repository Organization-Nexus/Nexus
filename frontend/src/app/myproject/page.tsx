import React from "react";
import ProjectList from "@/components/project/ProjectList";
import RightNavBar from "@/components/common/RightNavBar";
import { Project } from "@/types/ProjectList";
import ModalButton from "@/components/common/ModalButton";

const projects: Project[] = [
  {
    id: 1,
    name: "Project A",
    description: "This is the description for Project A.",
    start_date: "2024-01-01",
    end_date: "2024-12-31",
    image_url:
      "https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/image/grass.png",
  },
  {
    id: 2,
    name: "Project B",
    description: "This is the description for Project B.",
    start_date: "2024-03-01",
    end_date: "2024-09-30",
    image_url:
      "https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/image/cobblestone.png",
  },
  {
    id: 3,
    name: "Project C",
    description: "This is the description for Project C.",
    start_date: "2024-09-01",
    end_date: "2024-12-31",
    image_url: "https://via.placeholder.com/50",
  },
];

const Page = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-[#EDF2FB]">
      <div className="flex max-w-screen-xl w-full mx-auto py-6 space-x-6">
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md h-[700px] overflow-y-auto">
          <div className="flex justify-between">
            <h2 className="text-2xl font-semibold mb-4">My Projects</h2>
            <ModalButton label="Create Project" />
          </div>
          <hr className="my-4" />
          <div className="p-4">
            <ProjectList projects={projects} />
          </div>
        </div>
        <div className="w-[350px] bg-white p-6 rounded-lg shadow-xl h-[600px] overflow-y-auto">
          <RightNavBar />
        </div>
      </div>
    </div>
  );
};

export default Page;

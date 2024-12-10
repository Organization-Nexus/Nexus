"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProjectList from "@/components/Projects/ProjectList";
import Modal from "./CreateProject";

interface MyProjectsClientProps {
  fakeData: Project[];
}

export default function MyProjectsClient({ fakeData }: MyProjectsClientProps) {
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => setModalOpen(!isModalOpen);

  return (
    <>
      {/* Sub Header */}
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">
          All Projects
          <span className="text-gray-400 text-sm ml-2 font-normal">
            ({fakeData.length})
          </span>
        </h1>
        <Button onClick={toggleModal}>Create Project</Button>
      </div>

      <hr className="mt-6" />

      {/* Project List */}
      <div className="px-4">
        {/* In Progress */}
        <div className="flex items-center w-full my-6">
          <div className="border-4 rounded-full mr-2 border-[#50E161]"></div>
          <p className="whitespace-nowrap">In progress</p>
          <span className="text-gray-400 text-sm mx-2">
            ({fakeData.length})
          </span>
          <hr className="flex-grow border-t border-[#DEDEDE]" />
        </div>
        <ProjectList projects={fakeData} />

        {/* Done */}
        <div className="flex items-center w-full my-6">
          <div className="border-4 rounded-full mr-2 border-[#FF0000]"></div>
          <p className="whitespace-nowrap">Done</p>
          <span className="text-gray-400 text-sm mx-2">
            ({fakeData.length})
          </span>
          <hr className="flex-grow border-t border-[#DEDEDE]" />
        </div>
        <ProjectList projects={fakeData} />
      </div>

      {isModalOpen && <Modal onClose={toggleModal} />}
    </>
  );
}

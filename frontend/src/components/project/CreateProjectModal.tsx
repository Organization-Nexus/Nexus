"use client";

import React, { useState } from "react";
import LogoImage from "./LogoImage";

interface CreateProjectModalProps {
  onClose: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose }) => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);
  const [isCustomLogo, setIsCustomLogo] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      projectName,
      description,
      startDate,
      endDate,
      image,
      selectedLogo,
    });
  };

  const handleLogoSelect = (logo: string | null) => {
    setSelectedLogo(logo);
  };

  const handleCustomLogoToggle = () => {
    setIsCustomLogo((prev) => !prev);
    setSelectedLogo(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[600px]">
        <h2 className="text-2xl font-semibold mb-4">Create New Project</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Project Name:</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="border p-2 mt-1 mb-3 w-full"
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 mt-1 mb-3 w-full"
            />
          </div>

          <div className="flex space-x-4 mb-3">
            <div className="w-1/2">
              <label>Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border p-2 mt-1 mb-3 w-full"
              />
            </div>
            <div className="w-1/2">
              <label>End Date:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border p-2 mt-1 mb-3 w-full"
              />
            </div>
          </div>

          <div className="mb-4">
            <button
              type="button"
              onClick={handleCustomLogoToggle}
              className={`px-4 py-2 rounded ${
                isCustomLogo
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              {isCustomLogo ? "Use Default Logo" : "Use Custom Logo"}
            </button>
          </div>

          <div>
            {isCustomLogo ? (
              <div>
                <label>Upload Custom Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files && setImage(e.target.files[0])
                  }
                  className="border p-2 mt-1 mb-3 w-full"
                />
              </div>
            ) : (
              <LogoImage onLogoSelect={handleLogoSelect} />
            )}
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Create
            </button>
            <button
              onClick={onClose}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;

import { useState } from "react";
import { useVoteOptionResponses } from "@/query/queries/community";
import { Modal } from "../config/ModalMaps";

export interface VoteResponserListProps {
  isOpen: boolean;
  onClose: () => void;
  voteId: string;
  projectId: string;
}

export default function VoteResponserList({
  isOpen,
  onClose,
  voteId,
  projectId,
}: VoteResponserListProps) {
  const { data: voteOptionResponsers, refetch } = useVoteOptionResponses(
    projectId,
    voteId
  );

  const [activeTab, setActiveTab] = useState<
    "participated" | "nonParticipated" | null
  >("participated");

  const handleClose = () => {
    onClose();
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleTabChange = (tab: "participated" | "nonParticipated" | null) => {
    setActiveTab(tab);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeOnOutsideClick={true}
      className="w-[40%] max-w-lg h-auto bg-white rounded-lg shadow-lg p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <Modal.Title className="text-2xl font-semibold text-gray-800">
          투표 현황
        </Modal.Title>
        <Modal.Button variant="nothing" onClick={onClose} className="text-xl">
          X
        </Modal.Button>
      </div>
      <div className="my-2">
        <hr />
        <div className="text-sm flex">
          <button
            onClick={() => handleTabChange("participated")}
            className={`w-1/2 text-center py-2 ${
              activeTab === "participated"
                ? "bg-blue-500 text-white"
                : "text-gray-700"
            }`}
          >
            참여자
          </button>
          <button
            onClick={() => handleTabChange("nonParticipated")}
            className={`w-1/2 text-center py-2 ${
              activeTab === "nonParticipated"
                ? "bg-blue-500 text-white"
                : "text-gray-700"
            }`}
          >
            미참여자
          </button>
        </div>
        <hr />
      </div>

      <div className="space-y-2">
        {voteOptionResponsers?.map((voteOption) => (
          <div
            key={voteOption.id}
            className="bg-gray-100 p-4 rounded-md shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800">
                {voteOption.content}
              </h3>
              <span className="text-sm text-gray-500">
                {voteOption.voteCount} 표
              </span>
            </div>

            <div className="space-y-2">
              {activeTab === "participated"
                ? voteOption.response_users?.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-4 bg-white p-2 rounded-lg shadow-md hover:bg-gray-100 transition"
                    >
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="w-12 h-12 rounded-lg"
                      />
                      <div>
                        <span className="text-sm font-semibold text-gray-800">
                          {user.name}
                        </span>
                      </div>
                    </div>
                  ))
                : activeTab === "nonParticipated" && null}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

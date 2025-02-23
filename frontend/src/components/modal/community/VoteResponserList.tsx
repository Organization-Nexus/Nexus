import { useState, useEffect } from "react";
import { Modal } from "../config/ModalMaps";
import { communityApi } from "@/app/_api/models/community"; // API 경로가 맞는지 확인해주세요.

export interface VoteResponserListProps {
  isOpen: boolean;
  onClose: () => void;
  voteId: string;
  projectId: string;
}

interface VoteOption {
  id: number;
  content: string;
  voteCount: number;
  response_users: { id: number; name: string; profileImage: string }[];
}

export default function VoteResponserList({
  isOpen,
  onClose,
  voteId,
  projectId,
}: VoteResponserListProps) {
  const [voteOptionResponsers, setVoteOptionResponsers] = useState<
    VoteOption[] | null
  >(null);
  const [activeTab, setActiveTab] = useState<
    "participated" | "nonParticipated" | null
  >("participated");

  const handleClose = () => {
    onClose();
  };

  const handleTabChange = (tab: "participated" | "nonParticipated" | null) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen) return;
      try {
        const data = await communityApi.getVoteOptionByVoteIdAndProjectId(
          voteId,
          projectId
        );
        setVoteOptionResponsers(data);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      }
    };
    fetchData();
  }, [isOpen, voteId, projectId]);

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
              {activeTab === "participated" &&
              voteOption.response_users.length > 0 ? (
                voteOption.response_users.map((user) => (
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
              ) : (
                <div className="text-gray-500 text-sm">참여자가 없습니다.</div>
              )}

              {activeTab === "nonParticipated" &&
                voteOption.response_users.length === 0 && (
                  <div className="text-gray-500 text-sm">
                    미참여자가 없습니다.
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

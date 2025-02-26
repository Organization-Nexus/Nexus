import { useState, useEffect } from "react";
import { Modal } from "../config/ModalMaps";
import { communityApi } from "@/app/_api/models/community";
import { X, RefreshCcw, UsersRound } from "lucide-react";
import { userApi } from "@/app/_api/models/user";

export interface VoteResponserListProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  deadline: string | null;
  voteId: string;
  projectId: string;
}

interface VoteOption {
  id: number;
  content: string;
  voteCount: number;
  isSelectedByUser: boolean;
  response_users: {
    id: number;
    name: string;
    profileImage: string;
  }[];
}

export default function VoteResponserList({
  isOpen,
  onClose,
  title,
  deadline,
  voteId,
  projectId,
}: VoteResponserListProps) {
  const [voteOptionResponsers, setVoteOptionResponsers] = useState<
    VoteOption[] | null
  >(null);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [voteOptions, userData] = await Promise.all([
        communityApi.getVoteOptionByVoteIdAndProjectId(voteId, projectId),
        userApi.getUser(),
      ]);
      setVoteOptionResponsers(voteOptions);
      setCurrentUserName(userData.name);
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, voteId, projectId]);

  const handleRefresh = async () => {
    await fetchData();
  };

  const totalVotes = voteOptionResponsers
    ? voteOptionResponsers.reduce((acc, option) => acc + option.voteCount, 0)
    : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOutsideClick={true}
      className="w-[40%] max-w-lg bg-white rounded-lg shadow-lg p-6 overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-4">
        <Modal.Title className="text-xl font-semibold text-gray-800">
          {title}
        </Modal.Title>
        <div className="flex items-center">
          <button
            onClick={handleRefresh}
            className="text-gray-600 hover:text-black transition"
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
          <Modal.Button variant="nothing" onClick={onClose}>
            <X />
          </Modal.Button>
        </div>
      </div>
      <div className="my-2">
        <Modal.Divider />
      </div>

      <div className="flex flex-col h-full">
        {voteOptionResponsers?.map((voteOption) => {
          const votePercentage =
            totalVotes > 0 ? (voteOption.voteCount / totalVotes) * 100 : 0;

          const topUsers = voteOption.response_users.slice(0, 3);

          return (
            <div key={voteOption.id} className="p-2">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-md font-semibold">
                      - {voteOption.content}
                    </h3>
                    <span className="text-sm text-gray-400">
                      {voteOption.voteCount}
                    </span>
                  </div>
                </div>
                <div>
                  {topUsers.length > 0 && (
                    <div className="flex mt-2">
                      {topUsers.map((user, index) => {
                        const isSelectedUser = user.name === currentUserName;
                        return (
                          <div
                            key={user.id}
                            className="relative group"
                            style={{
                              marginLeft: index === 0 ? "0px" : "-10px",
                            }}
                          >
                            <img
                              src={user.profileImage}
                              alt={user.name}
                              className={`w-6 h-6 rounded-full ${
                                isSelectedUser
                                  ? "border-2 border-green-400"
                                  : ""
                              }`}
                            />
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 border text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {user.name}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
                <div
                  className="h-3 rounded-full bg-[#C2D6FF]"
                  style={{ width: `${votePercentage}%` }}
                />
              </div>
            </div>
          );
        })}
        <div className="flex justify-between items-center text-gray-400 text-sm mt-6">
          <span className="flex items-center gap-1">
            <UsersRound className="w-4 h-4" /> {totalVotes}
          </span>
          {deadline && <span>투표 마감일 : {deadline}</span>}
        </div>
      </div>
    </Modal>
  );
}

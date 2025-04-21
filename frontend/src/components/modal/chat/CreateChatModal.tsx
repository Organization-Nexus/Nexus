"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { chatApi } from "@/app/_api/models/chat";
import Loading from "@/components/utils/Loading";
import { ChevronDown, X } from "lucide-react";

type CreateChatModalProps = {
  onClose: () => void;
  onSuccess: () => void;
};

export function CreateChatModal({ onClose, onSuccess }: CreateChatModalProps) {
  const [activeTab, setActiveTab] = useState("personal");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
  const [groupChatTitle, setGroupChatTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 채팅 가능한 사용자 목록 조회
  const { data: availableUsers } = useQuery({
    queryKey: ["availableChatUsers"],
    queryFn: async () => {
      const response = await chatApi.getAvailableChatUsers();
      return response;
    },
  });

  // 사용자의 프로젝트 목록 조회
  const { data: userProjects } = useQuery({
    queryKey: ["userProjects"],
    queryFn: async () => {
      const response = await chatApi.getUserProjects();
      return response;
    },
  });

  // 선택한 프로젝트의 멤버 목록 조회
  const { data: projectMembers, refetch: refetchProjectMembers } = useQuery({
    queryKey: ["projectMembers", selectedProjectId],
    queryFn: async () => {
      if (!selectedProjectId) return [];
      const response = await chatApi.getProjectMembers(
        Number(selectedProjectId)
      );
      return response;
    },
    enabled: !!selectedProjectId,
  });

  // 프로젝트 선택 시 멤버 목록 조회
  useEffect(() => {
    if (selectedProjectId) {
      refetchProjectMembers();
      setSelectedMemberIds([]); // 프로젝트 변경 시 선택된 멤버 초기화
    }
  }, [selectedProjectId, refetchProjectMembers]);

  // 1:1 채팅방 생성
  const handleCreatePersonalChat = async () => {
    if (!selectedUserId) return;

    setIsLoading(true);
    try {
      await chatApi.createPersonalChat(Number(selectedUserId));
      onSuccess();
    } catch (error) {
      console.error("Failed to create personal chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 프로젝트 그룹 채팅방 생성
  const handleCreateGroupChat = async () => {
    if (!selectedProjectId || selectedMemberIds.length === 0) return;

    setIsLoading(true);
    try {
      const title =
        groupChatTitle ||
        userProjects?.find((p) => p.id === Number(selectedProjectId))?.title +
          " 채팅방";

      await chatApi.createProjectGroupChat(
        Number(selectedProjectId),
        title,
        selectedMemberIds
      );
      onSuccess();
    } catch (error) {
      console.error("Failed to create group chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 멤버 선택 토글
  const toggleMember = (userId: number) => {
    if (selectedMemberIds.includes(userId)) {
      setSelectedMemberIds(selectedMemberIds.filter((id) => id !== userId));
    } else {
      setSelectedMemberIds([...selectedMemberIds, userId]);
    }
  };

  // 전체 선택/해제
  const toggleSelectAll = () => {
    if (projectMembers && projectMembers.length > 0) {
      if (selectedMemberIds.length === projectMembers.length) {
        setSelectedMemberIds([]);
      } else {
        setSelectedMemberIds(projectMembers.map((member) => member.id));
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">새 채팅 시작</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="personal" className="flex-1">
              1:1 채팅
            </TabsTrigger>
            <TabsTrigger value="group" className="flex-1">
              프로젝트 채팅
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">채팅할 상대 선택</h3>
                <div className="max-h-60 overflow-y-auto border rounded-md">
                  {availableUsers?.map((user) => (
                    <div
                      key={user.id}
                      className={`p-3 cursor-pointer hover:bg-gray-50 ${
                        Number(selectedUserId) === user.id ? "bg-blue-50" : ""
                      }`}
                      onClick={() => setSelectedUserId(user.id.toString())}
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full mr-3">
                          <Image
                            src={user.log.profileImage as string}
                            alt="Profile"
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        </div>
                        <div>{user.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onClose}>
                  취소
                </Button>
                <Button
                  onClick={handleCreatePersonalChat}
                  disabled={!selectedUserId || isLoading}
                >
                  {isLoading ? <Loading /> : "채팅 시작"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="group">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">프로젝트 선택</h3>
                <div className="relative">
                  <select
                    className="w-full p-2 border rounded-md appearance-none pr-8" // appearance-none으로 기본 화살표 제거, pr-8로 오른쪽 여백 추가
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                  >
                    <option value="">프로젝트를 선택하세요</option>
                    {userProjects?.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                  {/* 커스텀 화살표 추가 */}
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>
              {selectedProjectId && (
                <>
                  <div>
                    <h3 className="font-medium mb-2">채팅방 이름</h3>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      placeholder={`${
                        userProjects?.find(
                          (p) => p.id === Number(selectedProjectId)
                        )?.title
                      } 채팅방`}
                      value={groupChatTitle}
                      onChange={(e) => setGroupChatTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">참여자 선택</h3>
                      <button
                        className="text-sm text-blue-600"
                        onClick={toggleSelectAll}
                      >
                        {selectedMemberIds.length === projectMembers?.length
                          ? "전체 해제"
                          : "전체 선택"}
                      </button>
                    </div>
                    <div className="max-h-60 overflow-y-auto border rounded-md">
                      {projectMembers?.map((member) => {
                        // 콘솔에 멤버 객체 출력하여 구조 확인
                        return (
                          <div
                            key={member.id}
                            className="p-3 cursor-pointer hover:bg-gray-50"
                            onClick={() => toggleMember(member.id)}
                          >
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="mr-3"
                                checked={selectedMemberIds.includes(member.id)}
                                onChange={() => {}}
                              />
                              <div className="w-8 h-8 bg-gray-200 rounded-full mr-3">
                                <Image
                                  src={member.log.profileImage as string}
                                  alt="Profile"
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                />
                              </div>
                              <div>{member.name}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onClose}>
                  취소
                </Button>
                <Button
                  onClick={handleCreateGroupChat}
                  disabled={
                    !selectedProjectId ||
                    selectedMemberIds.length === 0 ||
                    isLoading
                  }
                >
                  {isLoading ? <Loading /> : "채팅방 생성"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

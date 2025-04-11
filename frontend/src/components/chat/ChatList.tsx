"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { chatApi } from "@/app/_api/models/chat";
import Loading from "@/components/utils/Loading";
import { useUserInfo } from "@/query/queries/user";
import { useChat } from "@/provider/socketProvider";
import { CreateChatModal } from "../modal/chat/CreateChatModal";
import { CirclePlus, X } from "lucide-react";

export default function ChatList() {
  const { selectChatRoom, closeChat } = useChat();
  const { data: currentUser } = useUserInfo();
  const currentUserId = currentUser?.id;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    data: chatRooms,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["chatRooms"],
    queryFn: async () => {
      const response = await chatApi.getUserChatRooms();
      return response;
    },
  });

  const handleSelectChatRoom = (roomId: number) => {
    selectChatRoom(roomId.toString());
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-10">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex gap-2">
          <h2 className="font-bold text-lg">채팅 목록</h2>
        </div>
        <div>
          <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
            <CirclePlus />새 채팅
          </Button>

          <button
            onClick={closeChat}
            className="ml-2 p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
      </div>
      <div className="h-full flex flex-col">
        {/* <div className="p-4 flex justify-between items-center">
          <h3 className="font-medium">채팅</h3>
          <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
            새 채팅
          </Button>
        </div> */}

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {chatRooms?.length ?? 0 > 0 ? (
            chatRooms?.map((room) => (
              <div
                key={room.id}
                className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => handleSelectChatRoom(room.id)}
              >
                {room.type === "PERSONAL" ? (
                  <div className="font-medium">
                    {room.participants
                      .filter((p) => p.user.id !== currentUserId)
                      .map((p) => p.user.name)
                      .join(", ")}
                  </div>
                ) : (
                  <div>
                    <div className="font-medium">{room.title}</div>
                    <div className="text-sm text-gray-500">
                      {room.type === "GROUP"
                        ? `${room.title} 프로젝트`
                        : "그룹 채팅"}
                    </div>
                  </div>
                )}
                <div className="text-xs text-gray-400 mt-1">
                  참여자: {room.participants.length}명
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              아직 채팅방이 없습니다. 새 채팅을 시작해보세요.
            </div>
          )}
        </div>

        {isCreateModalOpen && (
          <CreateChatModal
            onClose={() => setIsCreateModalOpen(false)}
            onSuccess={() => {
              setIsCreateModalOpen(false);
              refetch();
            }}
          />
        )}
      </div>
    </div>
  );
}

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
import Image from "next/image";

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
        <div className="flex-1 overflow-y-auto p-2 pt-0">
          {chatRooms?.length ?? 0 > 0 ? (
            chatRooms?.map((room) => (
              <div
                key={room.id}
                className="p-4 border-b cursor-pointer hover:bg-gray-50 flex items-center gap-3"
                onClick={() => handleSelectChatRoom(room.id)}
              >
                {/* 이미지 영역 */}
                <div className="flex-shrink-0">
                  {room.type === "PERSONAL" ? (
                    // 개인 채팅일 경우 상대방 프로필 이미지
                    <div className="w-10 h-10 overflow-hidden">
                      {
                        room.participants
                          .filter((p) => p.user.id !== currentUserId)
                          .map((p) => (
                            <Image
                              src={p.user.log.profileImage as string}
                              alt="Profile Image"
                              width={40}
                              height={40}
                              className="object-cover rounded-2xl mr-2 mb-2 max-w-[40px] max-h-[40px] min-w-[40px] min-h-[40px]"
                              priority
                            />
                          ))[0]
                      }
                    </div>
                  ) : (
                    // 그룹 채팅일 경우 프로젝트 이미지
                    <div className="w-10 h-10 rounded-lg overflow-hidden ">
                      <Image
                        src={room.project?.project_image as string}
                        alt="Project Image"
                        width={40}
                        height={40}
                        className="object-cover rounded-2xl mr-2 mb-2 max-w-[40px] max-h-[40px] min-w-[40px] min-h-[40px]"
                        priority
                      />
                    </div>
                  )}
                </div>

                {/* 텍스트 영역 */}
                <div className="flex-1 min-w-0">
                  {room.type === "PERSONAL" ? (
                    <div className="font-medium truncate">
                      {room.participants
                        .filter((p) => p.user.id !== currentUserId)
                        .map((p) => p.user.name)
                        .join(", ")}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="text-xs font-medium border border-gray-200 rounded-full px-2 py-0.5">
                        {room.project?.title}
                      </span>
                      <div className="font-medium flex items-center ml-2">
                        {room.title}

                        <span className=" text-gray-400 ml-2">
                          {room.participants.length}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="text-xs text-gray-400 mt-1">
                    참여자: {room.participants.length}명
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              아직 채팅방이 없어요. 새 채팅을 시작해보세요 💬
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

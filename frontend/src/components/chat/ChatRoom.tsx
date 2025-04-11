"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { chatApi } from "@/app/_api/models/chat";
import { socketService } from "@/utils/socketService";
import Loading from "@/components/utils/Loading";
import { useUserInfo } from "@/query/queries/user";
import { useChat } from "@/provider/socketProvider";
import { ChevronLeft, X } from "lucide-react";

type ChatRoomProps = {
  roomId: string;
};

export default function ChatRoom({ roomId }: ChatRoomProps) {
  const { closeChat, showChatList } = useChat();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: currentUser } = useUserInfo();
  const currentUserId = currentUser?.id;

  // 채팅방 정보 조회
  const { data: chatRoom, isLoading: isLoadingRoom } = useQuery({
    queryKey: ["chatRoom", Number(roomId)],
    queryFn: async () => {
      const response = await chatApi.getUserChatRooms();
      return response.find((room: any) => room.id === Number(roomId));
    },
  });

  // 채팅방 메시지 조회
  const { data: initialMessages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ["chatMessages", Number(roomId)],
    queryFn: async () => {
      const response = await chatApi.getChatRoomMessages(Number(roomId));
      return response;
    },
    enabled: !!roomId,
  });

  // 초기 메시지 설정
  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  // 웹소켓 연결 및 메시지 수신 설정
  useEffect(() => {
    socketService.joinRoom(roomId);

    const handleNewMessage = (newMessage: any) => {
      //   console.log("웹소켓으로 받은 메시지:", newMessage);
      if (newMessage.chatRoomId === roomId) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socketService.onMessage(roomId, handleNewMessage);

    return () => {
      socketService.leaveRoom(roomId);
      socketService.offMessage(roomId, handleNewMessage);
    };
  }, [roomId]);

  // 메시지 목록 스크롤 자동 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 메시지 전송
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    socketService.sendMessage(roomId, message);
    setMessage("");
  };

  // 채팅방 제목 표시
  const getChatRoomTitle = () => {
    if (!chatRoom) return "채팅방";

    if (chatRoom.type === "PERSONAL") {
      return chatRoom.participants
        .filter((p) => p.userId !== currentUserId)
        .map((p) => p.user.name)
        .join(", ");
    } else {
      return chatRoom.title;
    }
  };

  //   // 읽지 않은 사람 수 계산
  //   const getUnreadCount = (msg: any) => {
  //     if (!chatRoom || !msg.readBy) return 0;

  //     // 메시지 보낸 사람은 자동으로 읽은 것으로 처리
  //     const senderId = msg.senderId.toString();

  //     // 채팅방 참여자 중 메시지를 읽지 않은 사람들 계산
  //     const participantIds = chatRoom.participants
  //       .map((p: any) => p.userId.toString())
  //       .filter((id) => id !== senderId); // 보낸 사람 제외

  //     const readByIds = Array.isArray(msg.readBy)
  //       ? msg.readBy.map((id: any) => id.toString())
  //       : [];

  //     console.log("senderId", senderId);
  //     console.log("readByIds", readByIds);
  //     console.log(
  //       "참여자 중 readBy에 포함되지 않은 사람 수",
  //       participantIds.filter((id) => !readByIds.includes(id)).length
  //     );

  //     // 참여자 중 readBy에 포함되지 않은 사람 수
  //     return participantIds.filter((id) => !readByIds.includes(id)).length;
  //   };

  // 연속된 메시지 그룹화 (같은 사람이 연속해서 보낸 메시지)
  const groupedMessages = messages.reduce((acc: any[], msg, index, arr) => {
    const prevMsg = index > 0 ? arr[index - 1] : null;

    // 이전 메시지와 같은 사람이 보낸 메시지이고 1분 이내 메시지면 그룹화
    const isSameSender = prevMsg && prevMsg.senderId === msg.senderId;
    const isWithinTimeWindow =
      prevMsg &&
      new Date(msg.createdAt).getTime() -
        new Date(prevMsg.createdAt).getTime() <
        60 * 1000;

    if (isSameSender && isWithinTimeWindow) {
      // 이전 그룹에 추가
      const lastGroup = acc[acc.length - 1];
      lastGroup.messages.push(msg);
      return acc;
    } else {
      // 새 그룹 생성
      acc.push({
        senderId: msg.senderId,
        sender: msg.sender,
        messages: [msg],
      });
      return acc;
    }
  }, []);

  if (isLoadingRoom || isLoadingMessages) {
    return (
      <div className="flex justify-center p-10">
        <Loading />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex p-4 border-b justify-between items-center">
        <button
          onClick={showChatList}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <div className="flex text-md font-semibold -mb-1 items-center">
            {getChatRoomTitle()}
            <div className="ml-2 text-gray-500">
              {chatRoom?.participants.length}
            </div>
          </div>
          {chatRoom?.type === "GROUP" && chatRoom.project && (
            <div className="text-sm text-gray-500">
              {chatRoom.project.title}
            </div>
          )}
        </div>

        <button
          onClick={closeChat}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {groupedMessages.map((group, groupIndex) => {
          const isMyMessage = group.senderId === currentUserId;

          return (
            <div
              key={`group-${groupIndex}`}
              className={`flex ${
                isMyMessage ? "justify-end" : "justify-start"
              } w-full`}
            >
              {/* 상대방 메시지일 경우 프로필 이미지 표시 */}
              {!isMyMessage && (
                <div className="mr-2 flex-shrink-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={group.sender?.log?.profileImage}
                      alt={group.sender?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {isMyMessage ? (
                // 내가 보낸 메시지 레이아웃
                <div className="flex items-end">
                  {/* 시간, 읽음 표시 */}
                  <div className="flex items-end mr-1 justify-end">
                    {/* {getUnreadCount(group.messages[group.messages.length - 1]) >
                    0 ? (
                      <span className="text-xs text-custom-point mr-2">
                        {getUnreadCount(
                          group.messages[group.messages.length - 1]
                        )}
                      </span>
                    ) : (
                      <CheckCheck
                        size={12}
                        className="text-custom-point mr-1"
                      />
                    )} */}
                    <div className="text-xs text-gray-500">
                      {format(
                        new Date(
                          group.messages[group.messages.length - 1].createdAt
                        ),
                        "HH:mm"
                      )}
                    </div>
                  </div>

                  {/* 메시지 목록 */}
                  <div className="flex flex-col items-end">
                    <div className="space-y-1">
                      {group.messages.map((msg: any) => (
                        <div key={msg.id} className="flex justify-end">
                          <div className="px-3 py-2 rounded-lg bg-custom-point text-white rounded-tr-none">
                            <div className="text-sm">{msg.content}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // 상대방 메시지 레이아웃
                <div className="flex flex-col max-w-[70%]">
                  {/* 상대방 이름 표시 */}
                  <div className="font-medium text-sm mb-1 ml-1">
                    {group.sender?.name || "알 수 없음"}
                  </div>

                  {/* 메시지 목록 */}
                  <div className="space-y-1">
                    {group.messages.map((msg: any, msgIndex: number) => (
                      <div key={msg.id} className="flex items-end">
                        <div className="px-3 py-2 rounded-lg bg-gray-100 rounded-tl-none">
                          <div className="text-sm">{msg.content}</div>
                        </div>

                        {/* 상대방 메시지의 경우 시간 표시가 오른쪽에 위치 */}
                        {msgIndex === group.messages.length - 1 && (
                          <div className="ml-1">
                            <div className="text-xs text-gray-500">
                              {format(new Date(msg.createdAt), "HH:mm")}
                            </div>
                          </div>
                        )}
                        {/* 읽음 표시
                        {getUnreadCount(
                          group.messages[group.messages.length - 1]
                        ) > 0 ? (
                          <span className="text-xs text-custom-point ml-2">
                            {getUnreadCount(
                              group.messages[group.messages.length - 1]
                            )}
                          </span>
                        ) : (
                          <CheckCheck
                            size={12}
                            className="text-custom-point ml-1"
                          />
                        )} */}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="border-t p-3">
        <div className="flex">
          <input
            type="text"
            className="flex-1 p-2 border rounded-l-md focus:outline-none"
            placeholder="메시지를 입력하세요..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className="bg-custom-point text-white px-4 rounded-r-md"
            disabled={!message.trim()}
          >
            전송
          </button>
        </div>
      </form>
    </div>
  );
}

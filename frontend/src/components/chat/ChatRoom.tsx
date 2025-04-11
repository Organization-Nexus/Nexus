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
      console.log("웹소켓으로 받은 메시지:", newMessage);
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

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={msg.id || index}
            className={`flex ${
              msg.senderId === currentUserId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                msg.senderId === currentUserId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              {msg.senderId !== currentUserId && (
                <div className="font-medium text-sm mb-1">
                  {msg.sender?.name || "알 수 없음"}
                </div>
              )}
              <div>{msg.content}</div>
              <div
                className={`text-xs mt-1 ${
                  msg.senderId === currentUserId
                    ? "text-blue-100"
                    : "text-gray-500"
                }`}
              >
                {format(new Date(msg.createdAt), "HH:mm")}
              </div>
            </div>
          </div>
        ))}
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
            className="bg-blue-500 text-white px-4 rounded-r-md"
            disabled={!message.trim()}
          >
            전송
          </button>
        </div>
      </form>
    </div>
  );
}

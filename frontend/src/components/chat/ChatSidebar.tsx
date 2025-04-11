"use client";

import { useEffect, useRef } from "react";
import Cookies from "js-cookie";
import ChatList from "./ChatList";
import ChatRoom from "./ChatRoom";
import { socketService } from "@/utils/socketService";
import { useChat } from "@/provider/socketProvider";

export default function ChatSidebar() {
  const { isChatOpen, activeChatRoomId, closeChat, showChatList } = useChat();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 로그인 상태일 때만 소켓 연결 시도
    const token = Cookies.get("access_token");
    if (token) {
      socketService.connect();
    }

    return () => {
      if (token) {
        socketService.disconnect();
      }
    };
  }, []);

  // 바깥 영역 클릭 시 닫히는 기능
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (overlayRef.current && e.target === overlayRef.current) {
      closeChat();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ease-in-out ${
        isChatOpen
          ? "visible bg-black bg-opacity-30"
          : "invisible bg-black bg-opacity-0 pointer-events-none"
      }`}
      onClick={handleOutsideClick}
      ref={overlayRef}
    >
      <div
        className={`fixed right-0 top-0 h-screen w-80 md:w-96 bg-white shadow-lg flex flex-col border-l transition-transform duration-300 ease-in-out ${
          isChatOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()} // 사이드바 내부 클릭은 전파 방지
      >
        {/* <div className="p-4 border-b flex justify-between items-center">
          <div className="flex gap-2">
            {activeChatRoomId && (
              <button
                onClick={showChatList}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <h2 className="font-bold text-lg">
              {activeChatRoomId ? "채팅" : "채팅 목록"}
            </h2>
          </div>
          <button
            onClick={closeChat}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div> */}

        <div className="flex-1 overflow-hidden">
          {activeChatRoomId ? (
            <ChatRoom roomId={activeChatRoomId} />
          ) : (
            <ChatList />
          )}
        </div>
      </div>
    </div>
  );
}

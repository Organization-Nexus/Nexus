"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ChatContextType = {
  isChatOpen: boolean;
  activeChatRoomId: string | null;
  openChat: () => void;
  closeChat: () => void;
  selectChatRoom: (roomId: string) => void;
  showChatList: () => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatRoomId, setActiveChatRoomId] = useState<string | null>(null);

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);
  const selectChatRoom = (roomId: string) => setActiveChatRoomId(roomId);
  const showChatList = () => setActiveChatRoomId(null);

  return (
    <ChatContext.Provider
      value={{
        isChatOpen,
        activeChatRoomId,
        openChat,
        closeChat,
        selectChatRoom,
        showChatList,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

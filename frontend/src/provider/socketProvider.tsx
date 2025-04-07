// "use client";

// import { createContext, useContext, useEffect, useState } from "react";
// import { socketService } from "@/utils/socketService";

// type ConnectionStatus = "connected" | "disconnected" | "error";

// interface SocketContextType {
//   connectionStatus: ConnectionStatus;
//   hasNewMessages: boolean;
//   unreadMessageCounts: Record<string, number>;
//   connect: () => void;
//   disconnect: () => void;
//   joinRoom: (roomId: string) => void;
//   leaveRoom: (roomId: string) => void;
//   sendMessage: (roomId: string, content: string) => void;
//   markAsRead: (roomId?: string) => void;
// }

// const defaultContext: SocketContextType = {
//   connectionStatus: "disconnected",
//   hasNewMessages: false,
//   unreadMessageCounts: {},
//   connect: () => {},
//   disconnect: () => {},
//   joinRoom: () => {},
//   leaveRoom: () => {},
//   sendMessage: () => {},
//   markAsRead: () => {},
// };

// const SocketContext = createContext<SocketContextType>(defaultContext);

// export function SocketProvider({ children }: { children: React.ReactNode }) {
//   const [connectionStatus, setConnectionStatus] =
//     useState<ConnectionStatus>("disconnected");
//   const [hasNewMessages, setHasNewMessages] = useState(false);
//   const [unreadMessageCounts, setUnreadMessageCounts] = useState<
//     Record<string, number>
//   >({});
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   // 로그인 상태 확인
//   useEffect(() => {
//     // 클라이언트 사이드에서만 실행
//     if (typeof window !== "undefined") {
//       const token = localStorage.getItem("token");
//       const isLoggedIn = !!token;
//       setIsAuthenticated(isLoggedIn);

//       if (isLoggedIn) {
//         // 자동 연결
//         connect();
//       }
//     }
//   }, []);

//   // 새 메시지 알림 처리
//   useEffect(() => {
//     if (!isAuthenticated) return;

//     const handleNewMessage = (message: any) => {
//       // 새 메시지 상태 업데이트
//       setHasNewMessages(true);

//       // 읽지 않은 메시지 카운트 업데이트
//       setUnreadMessageCounts((prev) => {
//         const roomId = message.chatRoomId;
//         return {
//           ...prev,
//           [roomId]: (prev[roomId] || 0) + 1,
//         };
//       });

//       // 브라우저 알림 표시 (선택 사항)
//       if (
//         typeof window !== "undefined" &&
//         document.visibilityState !== "visible" &&
//         "Notification" in window
//       ) {
//         if (Notification.permission === "granted") {
//           new Notification(`새 메시지`, {
//             body: message.content,
//             icon: "/logo.png",
//           });
//         }
//       }
//     };

//     // 전역 메시지 리스너 등록
//     socketService.onGlobalMessage(handleNewMessage);

//     return () => {
//       socketService.offGlobalMessage(handleNewMessage);
//     };
//   }, [isAuthenticated]);

//   const connect = () => {
//     if (!isAuthenticated && typeof window !== "undefined") {
//       const token = localStorage.getItem("token");
//       setIsAuthenticated(!!token);
//       if (!token) return;
//     }

//     socketService.connect();
//     socketService.onConnectionChange(setConnectionStatus);
//   };

//   const disconnect = () => {
//     socketService.offConnectionChange(setConnectionStatus);
//     socketService.disconnect();
//     setConnectionStatus("disconnected");
//   };

//   const joinRoom = (roomId: string) => {
//     socketService.joinRoom(roomId);
//   };

//   const leaveRoom = (roomId: string) => {
//     socketService.leaveRoom(roomId);
//   };

//   const sendMessage = (roomId: string, content: string) => {
//     socketService.sendMessage(roomId, content);
//   };

//   // 읽음 표시 처리 함수
//   const markAsRead = (roomId?: string) => {
//     if (roomId) {
//       // 특정 채팅방 메시지만 읽음 처리
//       setUnreadMessageCounts((prev) => ({
//         ...prev,
//         [roomId]: 0,
//       }));

//       // 모든 채팅방이 읽음 처리되었는지 확인
//       const updatedCounts = {
//         ...unreadMessageCounts,
//         [roomId]: 0,
//       };

//       const hasUnread = Object.values(updatedCounts).some((count) => count > 0);
//       if (!hasUnread) {
//         setHasNewMessages(false);
//       }
//     } else {
//       // 모든 메시지 읽음 처리
//       setHasNewMessages(false);
//       setUnreadMessageCounts({});
//     }
//   };

//   // 컴포넌트 언마운트 시 연결 해제
//   useEffect(() => {
//     return () => {
//       disconnect();
//     };
//   }, []);

//   return (
//     <SocketContext.Provider
//       value={{
//         connectionStatus,
//         hasNewMessages,
//         unreadMessageCounts,
//         connect,
//         disconnect,
//         joinRoom,
//         leaveRoom,
//         sendMessage,
//         markAsRead,
//       }}
//     >
//       {children}

//       {/* 연결 상태 표시 (선택 사항) */}
//       {connectionStatus === "error" && (
//         <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50">
//           연결에 문제가 있습니다.
//         </div>
//       )}
//     </SocketContext.Provider>
//   );
// }

// export const useSocket = () => useContext(SocketContext);

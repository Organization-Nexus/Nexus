// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useQuery } from "@tanstack/react-query";

// import { Button } from "@/components/ui/button";
// import { chatApi } from "../_api/models/chat";
// import { socketService } from "@/utils/socketService";
// import Loading from "@/components/utils/Loading";
// import { CreateChatModal } from "@/components/modal/chat/CreateChatModal";
// import { useUserInfo } from "@/query/queries/user";

// export default function ChatPage() {
//   const router = useRouter();
//   const { data: currentUser } = useUserInfo();
//   const currentUserId = currentUser?.id;

//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

//   // 채팅방 목록 조회
//   const {
//     data: chatRooms,
//     isLoading,
//     refetch,
//   } = useQuery({
//     queryKey: ["chatRooms"],
//     queryFn: async () => {
//       const response = await chatApi.getUserChatRooms();
//       console.log("chatRooms", response);
//       return response;
//     },
//   });

//   // WebSocket 연결
//   useEffect(() => {
//     socketService.connect();
//     return () => {
//       socketService.disconnect();
//     };
//   }, []);

//   // 채팅방 선택
//   const handleSelectChatRoom = (roomId: number) => {
//     router.push(`/chat/${roomId}`);
//   };

//   // 채팅방 생성 모달 열기
//   const handleOpenCreateModal = () => {
//     setIsCreateModalOpen(true);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center p-10">
//         <Loading />
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">내 채팅</h1>
//         <Button onClick={handleOpenCreateModal}>새 채팅 시작</Button>
//       </div>

//       <div className="space-y-2">
//         {chatRooms?.length ?? 0 > 0 ? (
//           chatRooms?.map((room) => (
//             <div
//               key={room.id}
//               className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
//               onClick={() => handleSelectChatRoom(room.id)}
//             >
//               {room.type === "PERSONAL" ? (
//                 // 1:1 채팅방인 경우 상대방 이름 표시
//                 <div>
//                   {room.participants
//                     .filter((p) => p.user.id !== currentUserId)
//                     .map((p) => p.user.name)
//                     .join(", ")}
//                 </div>
//               ) : (
//                 // 그룹 채팅방인 경우 제목 표시
//                 <div>
//                   <div className="font-medium">{room.title}</div>
//                   <div className="text-sm text-gray-500">
//                     {room.type === "GROUP"
//                       ? `${room.title} 프로젝트`
//                       : "그룹 채팅"}
//                   </div>
//                 </div>
//               )}
//               <div className="text-xs text-gray-400 mt-1">
//                 참여자: {room.participants.length}명
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="text-center py-10 text-gray-500">
//             아직 채팅방이 없습니다. 새 채팅을 시작해보세요.
//           </div>
//         )}
//       </div>

//       {/* 채팅 생성 모달 */}
//       {isCreateModalOpen && (
//         <CreateChatModal
//           onClose={() => setIsCreateModalOpen(false)}
//           onSuccess={() => {
//             setIsCreateModalOpen(false);
//             refetch();
//           }}
//         />
//       )}
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { socketService } from "@/utils/socketService";
// import { Button } from "@/components/ui/button";

// export default function SimpleSocketTest() {
//   const [isConnected, setIsConnected] = useState(false);
//   const [message, setMessage] = useState("");
//   const [receivedMessages, setReceivedMessages] = useState<string[]>([]);

//   // 소켓 연결 상태 확인
//   useEffect(() => {
//     const checkConnection = () => {
//       const connected = socketService.isConnected();
//       setIsConnected(connected);
//     };

//     // 초기 연결 상태 확인
//     checkConnection();

//     // 주기적으로 연결 상태 확인
//     const interval = setInterval(checkConnection, 2000);

//     return () => {
//       clearInterval(interval);
//     };
//   }, []);

//   // 메시지 수신 리스너
//   useEffect(() => {
//     const socket = socketService.connect();

//     if (socket) {
//       const handleTestMessage = (data: any) => {
//         setReceivedMessages((prev) => [...prev, data.content]);
//       };

//       socket.on("testMessage", handleTestMessage);

//       return () => {
//         socket.off("testMessage", handleTestMessage);
//       };
//     }
//   }, []);

//   const handleConnect = () => {
//     socketService.connect();
//   };

//   const handleDisconnect = () => {
//     socketService.disconnect();
//     setIsConnected(false);
//   };

//   const handleSendMessage = () => {
//     if (message.trim()) {
//       socketService.sendTestMessage(message);
//       setMessage("");
//     }
//   };

//   return (
//     <div className="p-4 border rounded-md shadow-sm">
//       <h2 className="text-lg font-semibold mb-4">간단한 웹소켓 테스트</h2>

//       <div className="mb-4">
//         <p>
//           연결 상태:
//           <span
//             className={`ml-2 font-medium ${
//               isConnected ? "text-green-600" : "text-red-600"
//             }`}
//           >
//             {isConnected ? "연결됨" : "연결 안됨"}
//           </span>
//         </p>
//       </div>

//       <div className="flex space-x-4 mb-4">
//         <Button onClick={handleConnect} disabled={isConnected}>
//           연결
//         </Button>

//         <Button
//           onClick={handleDisconnect}
//           disabled={!isConnected}
//           variant="destructive"
//         >
//           연결 해제
//         </Button>
//       </div>

//       <div className="mb-4">
//         <div className="flex items-center space-x-2">
//           <input
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder="테스트 메시지 입력"
//             className="border p-2 rounded flex-1"
//           />
//           <Button onClick={handleSendMessage} disabled={!isConnected}>
//             전송
//           </Button>
//         </div>
//       </div>

//       <div className="border p-4 rounded-md bg-gray-50 min-h-[100px] max-h-[200px] overflow-y-auto">
//         <h3 className="font-medium mb-2">수신된 메시지:</h3>
//         {receivedMessages.length > 0 ? (
//           <ul className="space-y-1">
//             {receivedMessages.map((msg, index) => (
//               <li key={index} className="bg-white p-2 rounded border">
//                 {msg}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-gray-500">아직 수신된 메시지가 없습니다.</p>
//         )}
//       </div>
//     </div>
//   );
// }

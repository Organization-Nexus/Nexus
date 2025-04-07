// utils/socketService.ts
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

// 환경 변수에서 소켓 서버 URL 가져오기
const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8000";

class SocketService {
  private socket: Socket | null = null;

  // 소켓 연결
  connect() {
    if (!this.socket) {
      console.log("소켓 서버에 연결 중...");

      console.log(Cookies.get("access_token"));
      const token = Cookies.get("access_token");
      if (!token) {
        console.error("인증 토큰이 없습니다. 로그인이 필요합니다.");
        return;
      }
      this.socket = io(SOCKET_URL, {
        transports: ["websocket"],
        auth: {
          token: token,
        },
      });

      this.socket.on("connect", () => {
        console.log("소켓 연결됨");
      });

      this.socket.on("disconnect", (reason) => {
        console.log("소켓 연결 해제됨:", reason);
      });

      this.socket.on("connect_error", (error) => {
        console.error("연결 오류:", error);
      });

      // 서버에서 보내는 연결 성공 이벤트
      this.socket.on("connection_established", (data) => {
        console.log("서버 연결 확인:", data);
      });

      // 테스트 메시지 수신
      this.socket.on("testMessage", (data) => {
        console.log("테스트 메시지 수신:", data);
      });
    }

    return this.socket;
  }

  // 테스트 메시지 전송
  sendTestMessage(message: string) {
    if (!this.socket) this.connect();
    console.log("테스트 메시지 전송:", message);
    this.socket?.emit("testMessage", { content: message });
  }

  // 연결 해제
  disconnect() {
    if (this.socket) {
      console.log("소켓 연결 해제 중");
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // 현재 연결 상태 확인
  isConnected() {
    return this.socket?.connected || false;
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
export const socketService = new SocketService();

// import { io, Socket } from "socket.io-client";

// // 환경 변수에서 소켓 서버 URL 가져오기
// const SOCKET_URL =
//   process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8001";

// class SocketService {
//   private socket: Socket | null = null;
//   private connectionListeners: Function[] = [];
//   private messageListeners: Record<string, Function[]> = {};
//   private globalMessageListeners: Function[] = [];

//   // 소켓 연결
//   connect() {
//     if (!this.socket) {
//       console.log("소켓 서버에 연결 중...");

//       // 토큰 가져오기 (localStorage는 클라이언트 사이드에서만 접근 가능)
//       let token = "";
//       if (typeof window !== "undefined") {
//         token = localStorage.getItem("token") || "";
//       }

//       if (!token) {
//         console.error("인증 토큰이 없습니다. 로그인이 필요합니다.");
//         return null;
//       }

//       this.socket = io(SOCKET_URL, {
//         transports: ["websocket"],
//         auth: {
//           token, // JWT 토큰 전달
//         },
//         reconnection: true,
//         reconnectionAttempts: 5,
//         reconnectionDelay: 1000,
//         reconnectionDelayMax: 5000,
//         timeout: 20000,
//       });

//       // 연결 이벤트 리스너 설정
//       this.setupConnectionListeners();
//     }

//     return this.socket;
//   }

//   // 연결 상태 변경 리스너 설정
//   private setupConnectionListeners() {
//     if (!this.socket) return;

//     this.socket.on("connect", () => {
//       console.log("소켓 연결됨");
//       this.notifyConnectionChange("connected");
//     });

//     this.socket.on("disconnect", (reason) => {
//       console.log("소켓 연결 해제됨:", reason);
//       this.notifyConnectionChange("disconnected");
//     });

//     this.socket.on("connect_error", (error) => {
//       console.error("연결 오류:", error);
//       this.notifyConnectionChange("error");
//     });

//     // 서버에서 보내는 연결 성공 이벤트
//     this.socket.on("connection_established", (data) => {
//       console.log("서버 연결 확인:", data);
//     });

//     // // 새 메시지 수신 리스너
//     // this.socket.on("newMessage", (message) => {
//     //   console.log("새 메시지 수신:", message);

//     //   // 전역 메시지 리스너에게 알림
//     //   this.globalMessageListeners.forEach((listener) => {
//     //     try {
//     //       listener(message);
//     //     } catch (error) {
//     //       console.error("전역 메시지 리스너에서 오류:", error);
//     //     }
//     //   });

//     //   // 특정 채팅방 리스너에게 알림
//     //   const roomId = message.chatRoomId;
//     //   if (roomId && this.messageListeners[roomId]) {
//     //     this.messageListeners[roomId].forEach((listener) => {
//     //       try {
//     //         listener(message);
//     //       } catch (error) {
//     //         console.error(`채팅방 ${roomId} 메시지 리스너에서 오류:`, error);
//     //       }
//     //     });
//     //   }
//     // });
//   }

//   // 채팅방 입장
//   joinRoom(roomId: string) {
//     if (!this.socket) this.connect();
//     console.log(`채팅방 입장: ${roomId}`);
//     this.socket?.emit("joinRoom", { roomId });
//   }

//   // 채팅방 퇴장
//   leaveRoom(roomId: string) {
//     console.log(`채팅방 퇴장: ${roomId}`);
//     this.socket?.emit("leaveRoom", { roomId });

//     // 채팅방 관련 리스너 정리
//     if (this.messageListeners[roomId]) {
//       delete this.messageListeners[roomId];
//     }
//   }

//   // 메시지 전송
//   sendMessage(roomId: string, content: string) {
//     if (!this.socket) return;
//     console.log(`채팅방 ${roomId}에 메시지 전송:`, content);
//     this.socket.emit("sendMessage", {
//       chatRoomId: roomId,
//       content,
//     });
//   }

//   // 특정 채팅방 메시지 리스너 등록
//   onMessage(roomId: string, callback: (message: any) => void) {
//     if (!this.messageListeners[roomId]) {
//       this.messageListeners[roomId] = [];
//     }
//     this.messageListeners[roomId].push(callback);
//   }

//   // 특정 채팅방 메시지 리스너 제거
//   offMessage(roomId: string, callback: Function) {
//     if (!this.messageListeners[roomId]) return;

//     const index = this.messageListeners[roomId].indexOf(callback);
//     if (index !== -1) {
//       this.messageListeners[roomId].splice(index, 1);
//     }
//   }

//   // 전역 메시지 리스너 등록 (모든 채팅방)
//   onGlobalMessage(callback: (message: any) => void) {
//     this.globalMessageListeners.push(callback);
//   }

//   // 전역 메시지 리스너 제거
//   offGlobalMessage(callback: Function) {
//     const index = this.globalMessageListeners.indexOf(callback);
//     if (index !== -1) {
//       this.globalMessageListeners.splice(index, 1);
//     }
//   }

//   // 연결 상태 변경 리스너 등록
//   onConnectionChange(
//     callback: (status: "connected" | "disconnected" | "error") => void
//   ) {
//     this.connectionListeners.push(callback);

//     // 현재 상태 즉시 알림
//     if (this.socket) {
//       callback(this.socket.connected ? "connected" : "disconnected");
//     }
//   }

//   // 연결 상태 변경 리스너 제거
//   offConnectionChange(callback: Function) {
//     const index = this.connectionListeners.indexOf(callback);
//     if (index !== -1) {
//       this.connectionListeners.splice(index, 1);
//     }
//   }

//   // 연결 상태 변경 알림
//   private notifyConnectionChange(
//     status: "connected" | "disconnected" | "error"
//   ) {
//     this.connectionListeners.forEach((listener) => {
//       try {
//         listener(status);
//       } catch (error) {
//         console.error("연결 리스너에서 오류:", error);
//       }
//     });
//   }

//   // 타이핑 중 상태 전송
//   sendTyping(roomId: string, isTyping: boolean) {
//     if (!this.socket) return;
//     this.socket.emit("typing", {
//       chatRoomId: roomId,
//       isTyping,
//     });
//   }

//   // 타이핑 이벤트 리스너
//   onTyping(
//     callback: (data: {
//       userId: string;
//       isTyping: boolean;
//       chatRoomId: string;
//     }) => void
//   ) {
//     if (!this.socket) this.connect();
//     this.socket?.on("typing", callback);
//   }

//   // 타이핑 이벤트 리스너 제거
//   offTyping(callback: Function) {
//     this.socket?.off("typing", callback as any);
//   }

//   // 완전 연결 해제
//   disconnect() {
//     if (this.socket) {
//       console.log("소켓 연결 해제 중");
//       this.socket.disconnect();
//       this.socket = null;

//       // 모든 리스너 정리
//       this.messageListeners = {};
//       this.globalMessageListeners = [];
//     }
//   }

//   // 현재 연결 상태 확인
//   isConnected() {
//     return this.socket?.connected || false;
//   }
// }

// // 싱글톤 인스턴스 생성 및 내보내기
// export const socketService = new SocketService();

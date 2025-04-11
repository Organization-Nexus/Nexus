import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

// 환경 변수에서 소켓 서버 URL 가져오기
const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8000";

class SocketService {
  private socket: Socket | null = null;
  private messageListeners: Map<string, Function[]> = new Map();

  // 소켓 연결
  connect() {
    if (!this.socket) {
      console.log("소켓 서버에 연결 중...");

      // console.log(Cookies.get("access_token"));
      const token = Cookies.get("access_token");
      if (!token) {
        console.error("인증 토큰이 없습니다. 로그인이 필요합니다.");
        return null;
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

      this.socket.on("newMessage", (message) => {
        const listeners = this.messageListeners.get(message.chatRoomId) || [];
        listeners.forEach((listener) => listener(message));
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

  joinRoom(roomId: string) {
    if (!this.socket) this.connect();
    this.socket?.emit("joinRoom", { roomId });
  }

  leaveRoom(roomId: string) {
    if (!this.socket) this.connect();
    this.socket?.emit("leaveRoom", { roomId });
  }

  sendMessage(roomId: string, content: string) {
    if (!this.socket) this.connect();
    this.socket?.emit("sendMessage", { roomId, content });
  }

  onMessage(roomId: string, callback: (message: any) => void) {
    if (!this.messageListeners.has(roomId)) {
      this.messageListeners.set(roomId, []);
    }
    this.messageListeners.get(roomId)?.push(callback);
  }

  offMessage(roomId: string, callback: Function) {
    const listeners = this.messageListeners.get(roomId) || [];
    const index = listeners.indexOf(callback);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }
}

export const socketService = new SocketService();

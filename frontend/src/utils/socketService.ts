import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

// 환경 변수에서 소켓 서버 URL 가져오기
const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://13.209.41.52:8000";
class SocketService {
  private socket: Socket | null = null;
  private messageListeners: Map<string, Function[]> = new Map();

  // 소켓 연결
  connect() {
    if (!this.socket) {
      const token = Cookies.get("access_token");
      if (!token) {
        return null;
      }
      this.socket = io(SOCKET_URL, {
        transports: ["websocket", "polling"],
        auth: {
          token: token,
        },
      });

      this.socket.on("connect", () => {});

      this.socket.on("disconnect", (reason) => {});

      this.socket.on("connect_error", (error) => {});

      // 서버에서 보내는 연결 성공 이벤트
      this.socket.on("connection_established", (data) => {});

      this.socket.on("newMessage", (message) => {
        const listeners = this.messageListeners.get(message.chatRoomId) || [];
        listeners.forEach((listener) => listener(message));
      });

      // 테스트 메시지 수신
      this.socket.on("testMessage", (data) => {});
    }

    return this.socket;
  }

  // 테스트 메시지 전송
  sendTestMessage(message: string) {
    if (!this.socket) this.connect();
    this.socket?.emit("testMessage", { content: message });
  }

  // 연결 해제
  disconnect() {
    if (this.socket) {
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

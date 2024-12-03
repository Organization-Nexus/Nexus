// Axios 인스턴스 설정
import axios from "axios";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
console.log("Server URL:", serverUrl); // 서버 URL을 로그로 확인

const api = axios.create({
  baseURL: serverUrl,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

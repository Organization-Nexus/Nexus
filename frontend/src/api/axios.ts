// src/api/axios.ts
import axios from "axios";
import Cookies from "js-cookie";

// 클라이언트 사이드에서는 NEXT_PUBLIC_ 접두사가 붙은 환경변수만 접근 가능
const CLIENT_URL = process.env.NEXT_PUBLIC_SERVER_URL;
// 서버 사이드에서는 모든 환경변수 접근 가능
const SERVER_URL = process.env.NEST_PUBLIC_SERVER_URL;

// 현재 실행 환경이 서버인지 클라이언트인지 확인
const isServer = typeof window === "undefined";

export const api = axios.create({
  baseURL: isServer ? SERVER_URL : CLIENT_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use((config) => {
  // 서버 사이드에서는 쿠키 접근 불가
  if (!isServer) {
    const token = Cookies.get("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 서버 사이드에서는 리프레시 토큰 로직 실행하지 않음
    if (isServer) return Promise.reject(error);

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get("refresh_token");
        const { data } = await api.post("/auth/refresh", null, {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });

        Cookies.set("access_token", data.access_token);
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;

        return api(originalRequest);
      } catch (error) {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

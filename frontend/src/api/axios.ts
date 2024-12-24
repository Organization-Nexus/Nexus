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

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러 (토큰 만료) 처리
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await api.post("/auth/refresh", {
          refresh_token: refreshToken,
        });

        const { access_token } = response.data;
        localStorage.setItem("accessToken", access_token);

        // 새로운 토큰으로 헤더 업데이트
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // refresh token 만료 또는 갱신 실패
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

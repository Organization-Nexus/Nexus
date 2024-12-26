import Cookies from "js-cookie";
import { AxiosInstance } from "axios";

export const createResponseInterceptor = (
  api: AxiosInstance,
  isServer: boolean
) => {
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
};

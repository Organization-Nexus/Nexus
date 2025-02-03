import Cookies from "js-cookie";
import { AxiosInstance } from "axios";

export const createRequestInterceptor = (
  api: AxiosInstance,
  isServer: boolean
) => {
  api.interceptors.request.use((config) => {
    if (!isServer) {
      // 클라이언트에서는 js-cookie 사용
      const token = Cookies.get("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      // 서버에서는 next/headers 사용
      const cookiestore = require("next/headers").cookies();
      const token = cookiestore.get("access_token")?.value;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });
};

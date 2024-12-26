import axios from "axios";
import { createRequestInterceptor } from "./requestInterceptor";
import { createResponseInterceptor } from "./responseInterceptor";

const CLIENT_URL = process.env.NEXT_PUBLIC_SERVER_URL;
const SERVER_URL = process.env.NEST_PUBLIC_SERVER_URL;

const isServer = typeof window === "undefined";

export const api = axios.create({
  baseURL: isServer ? SERVER_URL : CLIENT_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

createRequestInterceptor(api, isServer);
createResponseInterceptor(api, isServer);

export default api;

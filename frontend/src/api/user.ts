import { User } from "@/types/user";
import { api } from "./config/axios";

export const userApi = {
  getUser: async (): Promise<User> => {
    return await api.get<User>("/user").then((res) => res.data);
  },
};

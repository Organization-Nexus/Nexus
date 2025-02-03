import { UpdateUserDto, User } from "@/types/user";
import { api } from "../axios";

export const userApi = {
  getUser: async (): Promise<User> => {
    return await api.get<User>("/user").then((res) => res.data);
  },

  updateUser: async (userData: UpdateUserDto): Promise<User> => {
    return await api.put<User>("/user", userData).then((res) => res.data);
  },
};

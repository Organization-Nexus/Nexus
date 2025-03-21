import { UpdateUserDto, User } from "@/types/user";
import { api } from "../axios";

export const userApi = {
  getUser: async (): Promise<User> => {
    return await api.get<User>("/user").then((res) => res.data);
  },

  updateUser: async (data: UpdateUserDto | FormData) => {
    const isFormData = data instanceof FormData;
    return await api.put("/user", data, {
      headers: {
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
      },
    });
  },
};

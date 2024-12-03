import api from "../axios";

export const getPing = async (): Promise<string> => {
  const response = await api.get<string>("/ping");
  return response.data;
};

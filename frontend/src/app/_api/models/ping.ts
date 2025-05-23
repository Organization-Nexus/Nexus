import api from "../axios";

const getPing = async (): Promise<string> => {
  const response = await api.get<string>("/ping");
  return response.data;
};

export default { getPing };

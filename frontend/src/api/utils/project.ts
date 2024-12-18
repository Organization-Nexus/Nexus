import api from "../axios";

const createProject = async (): Promise<string> => {
  const response = await api.get<string>("/project/create");
  return response.data;
};

export default { createProject };

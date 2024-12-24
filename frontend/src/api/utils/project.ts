import api from "../axios";

export const getMyProjects = async () => {
  try {
    const response = await api.get("/project/my-projects");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

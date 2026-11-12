import { api } from "@/utils/axios";

const getCurrentUser = async () => {
  try {
    const { data } = await api.get("/api/getCurrentUser");
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getCurrentUser;

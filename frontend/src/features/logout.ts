import { api } from "@/utils/axios";

async function logOut() {
  try {
    await api.get("/api/auth/logout");
  } catch (error) {
    console.error(error);
  }
}

export default logOut;

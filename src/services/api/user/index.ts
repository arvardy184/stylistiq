import { BASE_URL } from "@/config";
import axios from "axios";

export const Profile = async (token: string) => {
  const response = await axios.get(`${BASE_URL}/user/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};

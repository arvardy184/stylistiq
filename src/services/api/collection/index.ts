import { BASE_URL } from "@/config";
import axios from "axios";

export const GetAllCollectionByToken = async (token: string) => {
  const response = await axios.get(`${BASE_URL}/collection`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

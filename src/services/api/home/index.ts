import { BASE_URL } from "@/config";
import axios from "axios";

export const GetScheduleByDate = async (token: string, date: string) => {
  const response = await axios.get(`${BASE_URL}/schedule/date/${date}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

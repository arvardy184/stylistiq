import { BASE_URL } from "@env";
import axios from "axios";

export const LoginGoogle = async (token: string) => {
  const response = await axios.post(
    `${BASE_URL}/auth/login/firebase`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
};

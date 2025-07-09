import { BASE_URL } from "@/config";
import { LoginRequest } from "@/services/request/auth/login";
import { RegisterRequest } from "@/services/request/auth/register";
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

export const Login = async (data: LoginRequest) => {
  const response = await axios.post(`${BASE_URL}/auth/login`, data);
  return response.data.data;
};

export const Register = async (data: RegisterRequest) => {
  const response = await axios.post(`${BASE_URL}/auth/register`, data);
  return response.data.data;
};

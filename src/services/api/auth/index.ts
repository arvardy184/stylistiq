import { BASE_URL } from "@/config";
import { LoginFormData } from "@/screens/auth/screen/body/form/login";
import { RegisterFormData } from "@/screens/auth/screen/body/form/register";
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

export const Login = async (data: LoginFormData) => {
  const response = await axios.post(`${BASE_URL}/auth/login`, data);
  return response.data.data;
};

export const Register = async (data: RegisterFormData) => {
  const response = await axios.post(`${BASE_URL}/auth/register`, data);
  return response.data.data;
};

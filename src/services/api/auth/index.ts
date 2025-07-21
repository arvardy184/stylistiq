import { BASE_URL } from "@/config";
import { ChangePasswordFormData } from "@/screens/auth/screen/body/form/changePassword";
import { LoginFormData } from "@/screens/auth/screen/body/form/login";
import { RegisterFormData } from "@/screens/auth/screen/body/form/register";
import { ResetPasswordFormData } from "@/screens/auth/screen/body/form/resetPassword";
import axios from "axios";

export const LoginGoogle = async (token: string) => {
  try {
    console.log('🚀 LoginGoogle function called');
    console.log('📡 BASE_URL:', BASE_URL);
    console.log('🔑 Token received:', token ? 'Yes' : 'No');
    
    const response = await axios.post(
      `${BASE_URL}/auth/login/firebase`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    console.log('✅ LoginGoogle successful');
    console.log('📊 Response:', JSON.stringify(response.data, null, 2));
    
    return response.data.data;
  } catch (error) {
    console.error('❌ LoginGoogle error:', error);
    console.error('🔍 Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

export const Login = async (data: LoginFormData) => {
  try {
    console.log('🚀 Login function called');
    console.log('📡 BASE_URL:', BASE_URL);
    console.log('📝 Data being sent:', JSON.stringify(data, null, 2));
    
    const response = await axios.post(`${BASE_URL}/auth/login`, data);
    
    console.log('✅ Login successful');
    console.log('📊 Response:', JSON.stringify(response.data, null, 2));
    
    return response.data.data;
  } catch (error) {
    console.error('❌ Login error:', error);
    console.error('🔍 Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

export const Register = async (data: RegisterFormData) => {
  try {
    console.log('🚀 Register function called');
    console.log('📡 BASE_URL:', BASE_URL);
    console.log('📝 Data being sent:', JSON.stringify(data, null, 2));
    
    const response = await axios.post(`${BASE_URL}/auth/register`, data);
    
    console.log('✅ Register successful');
    console.log('📊 Response:', JSON.stringify(response.data, null, 2));
    
    return response.data.data;
  } catch (error) {
    console.error('❌ Register error:', error);
    console.error('🔍 Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

export const ForgotPassword = async (email: string) => {
  const response = await axios.post(`${BASE_URL}/auth/forgot-password`, {
    email: email.trim(),
  });
  return response.data.data;
};

export const ResetPassword = async (data: ResetPasswordFormData) => {
  const response = await axios.post(`${BASE_URL}/auth/reset-password`, data);
  return response.data.data;
};

export const ChangePassword = async (
  data: ChangePasswordFormData,
  token: string
) => {
  const response = await axios.post(`${BASE_URL}/auth/change-password`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

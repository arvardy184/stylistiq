import { BASE_URL } from "@/config";
import { LoginFormData } from "@/screens/auth/screen/body/form/login";
import { RegisterFormData } from "@/screens/auth/screen/body/form/register";
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

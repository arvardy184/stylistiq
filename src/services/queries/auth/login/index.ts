import { LoginFormData } from "@/screens/auth/screen/body/form/login";
import { Login } from "@/services/api/auth";
import { useAuthStore } from "@/store/auth/authStore";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Toast from "react-native-toast-message";

export const useLogin = () => {
  const { setToken } = useAuthStore();
  const navigation = useNavigation<any>();

  return useMutation({
    mutationFn: (data: LoginFormData) => {
      console.log('🎯 useLogin mutation called');
      console.log('📝 Form data:', JSON.stringify(data, null, 2));
      return Login(data);
    },
    onSuccess: (data) => {
      setToken(data.token);
      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: "Welcome back!",
      });
      navigation.navigate("Main");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const apiMessage = error.response?.data?.message;
        console.error("Login error message:", apiMessage || error.message);
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: apiMessage || "Please try again.",
        });
      } else {
        console.error("Unexpected login error:", error);
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: "Unexpected error occurred.",
        });
      }
    },
  });
};

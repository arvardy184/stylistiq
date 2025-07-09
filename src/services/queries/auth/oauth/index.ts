import { LoginGoogle } from "@/services/api/auth";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth/authStore";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

export const useOauthMutation = () => {
  const { setToken } = useAuthStore();
  const navigation = useNavigation<any>();

  return useMutation({
    mutationFn: (token: string) => LoginGoogle(token),
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
      console.error("Google login error:", error);
      Toast.show({
        type: "error",
        text1: "Google Login Failed",
        text2: "An error occurred during login. Please try again.",
      });
    },
  });
};

import { LoginGoogle } from "@/services/api/auth";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth/authStore";
import { useNavigation } from "@react-navigation/native";

export const useOauthMutation = () => {
  const { setToken } = useAuthStore();
  const navigation = useNavigation<any>();
  return useMutation({
    mutationFn: (token: string) => LoginGoogle(token),
    onSuccess: (data) => {
      setToken(data.token);
      navigation.navigate("Main");
    },
    onError: (error) => {
      console.error("Login gagal di backend:", error);
    },
  });
};

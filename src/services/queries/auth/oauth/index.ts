import { LoginGoogle } from "@/services/api/auth";
import { useMutation } from "@tanstack/react-query";

export const useOauthMutation = () => {
  return useMutation({
    mutationFn: (token: string) => LoginGoogle(token),
    onSuccess: (data) => {
      console.log("Login berhasil! Response dari backend:", data);
    },
    onError: (error) => {
      console.error("Login gagal di backend:", error);
    },
  });
};

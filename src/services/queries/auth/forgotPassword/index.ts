import { ForgotPassword } from "@/services/api/auth";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Toast from "react-native-toast-message";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => ForgotPassword(email),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Email Sent",
        text2: "Please check your email for password reset instructions.",
      });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const apiMessage = error.response?.data?.message;
        console.error(
          "Forgot password error message:",
          apiMessage || error.message
        );
        Toast.show({
          type: "error",
          text1: "Failed to Send Email",
          text2: apiMessage || "Please try again.",
        });
      } else {
        console.error("Unexpected forgot password error:", error);
        Toast.show({
          type: "error",
          text1: "Failed to Send Email",
          text2: "Unexpected error occurred.",
        });
      }
    },
  });
};

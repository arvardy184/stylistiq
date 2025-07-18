import { ResetPasswordFormData } from "@/screens/auth/screen/body/form/resetPassword";
import { ResetPassword } from "@/services/api/auth";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Toast from "react-native-toast-message";

export const useResetPassword = () => {
  const navigation = useNavigation();
  return useMutation({
    mutationFn: (data: ResetPasswordFormData) => ResetPassword(data),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Password Reset Successful",
        text2:
          "Your password has been updated. You can now log in with your new credentials.",
      });
      navigation.navigate("Login");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const apiMessage = error.response?.data?.message;
        console.error(
          "Reset password error message:",
          apiMessage || error.message
        );
        Toast.show({
          type: "error",
          text1: "Password Reset Failed",
          text2: apiMessage || "Please try again.",
        });
      } else {
        console.error("Unexpected reset password error:", error);
        Toast.show({
          type: "error",
          text1: "Password Reset Failed",
          text2: "An unexpected error occurred. Please try again later.",
        });
      }
    },
  });
};

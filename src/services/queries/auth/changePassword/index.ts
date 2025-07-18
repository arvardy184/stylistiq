import { ChangePasswordFormData } from "@/screens/auth/screen/body/form/changePassword";
import { ChangePassword } from "@/services/api/auth";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Toast from "react-native-toast-message";

export const useChangePassword = (token: string) => {
  const navigation = useNavigation();

  return useMutation({
    mutationFn: (data: ChangePasswordFormData) => ChangePassword(data, token),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Password Changed Successfully",
        text2: "Your password has been updated.",
      });
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const apiMessage = error.response?.data?.message;
        console.error(
          "Change password error message:",
          apiMessage || error.message
        );
        Toast.show({
          type: "error",
          text1: "Failed to Change Password",
          text2:
            apiMessage ||
            "The old password may be incorrect. Please try again.",
        });
      } else {
        console.error("Unexpected change password error:", error);
        Toast.show({
          type: "error",
          text1: "Failed to Change Password",
          text2: "An unexpected error occurred. Please try again later.",
        });
      }
    },
  });
};

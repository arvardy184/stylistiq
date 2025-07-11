import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Toast from "react-native-toast-message";
import { UpdateProfile } from "@/services/api/user";
import { UpdateProfileFormData } from "@/screens/profile/form/updateProfile";

export const useUpdateProfile = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileFormData) => UpdateProfile(token, data),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Update Successful",
        text2: "Your profile has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const apiMessage = error.response?.data?.message;
        Toast.show({
          type: "error",
          text1: "Update Failed",
          text2: apiMessage || "Please try again.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Update Failed",
          text2: "An unexpected error occurred.",
        });
      }
    },
  });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Toast from "react-native-toast-message";
import { UpdateBodyProfile } from "@/services/api/user";
import { UpdateBodyProfileFormData } from "@/screens/profile/form/updateBodyProfile";

export const useUpdateBodyProfile = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateBodyProfileFormData) =>
      UpdateBodyProfile(token, data),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Update Body Profile Successful",
        text2: "Your body profile has been updated.",
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

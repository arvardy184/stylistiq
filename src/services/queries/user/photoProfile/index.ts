import { UpdateProfilePicture } from "@/services/api/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

export const useUpdateProfilePicture = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => UpdateProfilePicture(token, formData),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Photo Updated",
        text2: "Your profile picture has been changed.",
      });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error) => {
      Toast.show({ type: "error", text1: "Upload Failed" });
      console.error("Error updating profile picture:", error);
    },
  });
};

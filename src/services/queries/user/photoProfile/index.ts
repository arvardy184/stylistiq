import { UpdateProfilePicture } from "@/services/api/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

export const useUpdateProfilePicture = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      console.log("Calling UpdateProfilePicture API...");
      const result = await UpdateProfilePicture(token, formData);
      console.log("API response:", result);
      return result;
    },
    onSuccess: (data) => {
      console.log("Upload successful:", data);
      Toast.show({
        type: "success",
        text1: "Photo Updated",
        text2: "Your profile picture has been changed.",
      });
      // Invalidate queries to refetch user profile
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error) => {
      console.error("Upload error:", error);
      Toast.show({
        type: "error",
        text1: "Upload Failed",
        text2: "Please check your internet connection and try again.",
      });
    },
    onMutate: () => {
      console.log("Starting upload...");
    },
  });
};

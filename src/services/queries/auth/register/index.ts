import { Register } from "@/services/api/auth";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { RegisterFormData } from "@/screens/auth/screen/body/form/register";
import Toast from "react-native-toast-message";

export const useRegister = () => {
  const navigation = useNavigation<any>();
  return useMutation({
    mutationFn: (data: RegisterFormData) => {
      console.log('🎯 useRegister mutation called');
      console.log('📝 Form data:', JSON.stringify(data, null, 2));
      return Register(data);
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Registration Successful",
        text2: "Please log in to continue",
      });
      navigation.navigate("Login");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const apiMessage = error.response?.data?.message;
        console.error(
          "Registration error message:",
          apiMessage || error.message
        );
        Toast.show({
          type: "error",
          text1: "Registration Failed",
          text2: apiMessage || "Please try again.",
        });
      } else {
        console.error("Unexpected registration error:", error);
        Toast.show({
          type: "error",
          text1: "Registration Failed",
          text2: "Unexpected error occurred.",
        });
      }
    },
  });
};

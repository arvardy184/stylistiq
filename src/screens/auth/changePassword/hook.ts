import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Toast from "react-native-toast-message";
import { useAuthStore } from "@/store/auth/authStore";
import { useChangePassword } from "@/services/queries/auth/changePassword";
import { ChangePasswordFormData } from "../screen/body/form/changePassword";
import { changePasswordSchema } from "@/schemas/auth/changePassword";

export const useChangePasswordScreen = () => {
  const { token } = useAuthStore();
  const changePasswordMutation = useChangePassword(token);

  const [isOldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (formData: ChangePasswordFormData) => {
    if (!token) {
      Toast.show({
        type: "error",
        text1: "Authentication Error",
        text2: "You are not logged in.",
      });
      return;
    }
    const data = {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    };
    changePasswordMutation.mutate(data);
  };

  const toggleOldPasswordVisibility = () => {
    setOldPasswordVisible(!isOldPasswordVisible);
  };

  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisible(!isNewPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  return {
    control,
    handleSubmit,
    errors,
    onSubmit,
    isOldPasswordVisible,
    isNewPasswordVisible,
    isConfirmPasswordVisible,
    toggleOldPasswordVisibility,
    toggleNewPasswordVisibility,
    toggleConfirmPasswordVisibility,
    isLoading: changePasswordMutation.isPending,
  };
};

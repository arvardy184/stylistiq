import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRoute } from "@react-navigation/native";
import { resetPasswordSchema } from "@/schemas/auth/resetPassword";
import { useResetPassword } from "@/services/queries/auth/resetPassword";
import { ResetPasswordFormData } from "../screen/body/form/resetPassword";
import { ResetPasswordScreenRouteProp } from "./type";

export const useResetPasswordScreen = () => {
  const route = useRoute<ResetPasswordScreenRouteProp>();
  const { email } = route.params;

  const resetPasswordMutation = useResetPassword();

  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      email: email,
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPasswordMutation.mutate(data);
  };

  const toggleNewPasswordVisibility = () => {
    setIsNewPasswordVisible(!isNewPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  return {
    control,
    handleSubmit,
    errors,
    onSubmit,
    isNewPasswordVisible,
    isConfirmPasswordVisible,
    toggleNewPasswordVisibility,
    toggleConfirmPasswordVisibility,
    isLoading: resetPasswordMutation.isPending,
  };
};

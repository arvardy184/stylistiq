import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLogin } from "@/services/queries/auth/login";
import { useRegister } from "@/services/queries/auth/register";
import { loginSchema } from "@/schemas/auth/login";
import { registerSchema } from "@/schemas/auth/register";
import { LoginFormData } from "../form/login";
import { RegisterFormData } from "../form/register";

export const useAuthForm = (isLogin: boolean) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigation = useNavigation();
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const loginForm = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    await loginMutation.mutateAsync(data);
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    await registerMutation.mutateAsync(data);
  };

  const handleSwitchForm = () => {
    loginForm.reset();
    registerForm.reset();
    navigation.navigate(isLogin ? "Register" : "Login");
  };

  return {
    loginForm,
    registerForm,
    onLoginSubmit,
    onRegisterSubmit,
    handleSwitchForm,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isLoading: loginMutation.isPending || registerMutation.isPending,
  };
};
